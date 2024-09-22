document.addEventListener('DOMContentLoaded', function() {
    const homeLink = document.getElementById('home-link');
    const calendarLink = document.getElementById('calendar-link');
    const musicLink = document.getElementById('music-link');
    const photoLink = document.getElementById('photo-link');

    const homeSection = document.getElementById('home');
    const calendarSection = document.getElementById('calendar');
    const musicSection = document.getElementById('music');
    const photoSection = document.getElementById('photo');

    homeLink.addEventListener('click', function() {
        homeSection.style.display = 'block';
        calendarSection.style.display = 'none';
        musicSection.style.display = 'none';
        photoSection.style.display = 'none';
    });

    calendarLink.addEventListener('click', function() {
        homeSection.style.display = 'none';
        calendarSection.style.display = 'block';
        musicSection.style.display = 'none';
        photoSection.style.display = 'none';
        app.renderCalendar(app.currentDate); // Render calendar when the calendar section is shown
    });

    musicLink.addEventListener('click', function() {
        homeSection.style.display = 'none';
        calendarSection.style.display = 'none';
        musicSection.style.display = 'block';
        photoSection.style.display = 'none';
    });
    photoLink.addEventListener('click', function() {
            homeSection.style.display = 'none';
            calendarSection.style.display = 'none';
            musicSection.style.display = 'none';
            photoSection.style.display = 'block';
     });
});

// Calendar functionality
var app = {
    settings: {
        container: $('.calendar'),
        calendar: $('.front'),
        daysContainer: $('.weeks'),
        form: $('.back'),
        input: $('#event-input'),
        eventList: $('#event-list'),
        saveButton: $('#save-event'),
        dismissButton: $('#dismiss-event'),
        currentMonthYearElement: $('#current-month-year'),
        prevButton: $('#prev'),
        nextButton: $('#next'),
        selectedDate: null
    },

    currentDate: new Date(),
    events: {},

    init: function() {
        this.bindUIActions();
        this.renderCalendar(this.currentDate);
    },

    renderCalendar: function(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const lastDay = new Date(year, month + 1, 0).getDate();
        const prevLastDay = new Date(year, month, 0).getDate();
        const currentMonthYear = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);
        this.settings.currentMonthYearElement.text(currentMonthYear);

        let days = '';
        const today = new Date();
        const firstDayIndex = firstDay === 0 ? 6 : firstDay - 1;
        for (let i = firstDayIndex; i > 0; i--) {
            days += `<div class="day prev-month">${prevLastDay - i + 1}</div>`;
        }

        for (let i = 1; i <= lastDay; i++) {
            const dateKey = `${year}-${month + 1}-${i}`;
            const hasEvents = this.events[dateKey] && this.events[dateKey].length > 0;
            const eventMarker = hasEvents ? '<span class="event-marker">•</span>' : '';
            const isToday = (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) ? 'today' : '';
            days += `<div class="day ${isToday}" data-date="${dateKey}">${i}${eventMarker}</div>`;
        }

        const totalSlots = 42;
        const currentSlots = firstDayIndex + lastDay;
        for (let i = 1; i <= totalSlots - currentSlots; i++) {
            days += `<div class="day next-month">${i}</div>`;
        }

        this.settings.daysContainer.html(days);
        this.bindDayClicks();
    },

    bindDayClicks: function() {
        const self = this;
        this.settings.daysContainer.find('.day').not('.prev-month, .next-month').on('click', function() {
            const selectedDate = $(this).data('date');
            self.settings.selectedDate = selectedDate;
            self.showEventsForDate(selectedDate);
            self.settings.container.toggleClass('flip');
        });
    },

    showEventsForDate: function(date) {
        this.settings.form.find('#event-date').text(date);
        const eventsForDate = this.events[date] || [];
        const eventListHtml = eventsForDate.map((event, index) => `
            <li>
                <input class="edit-event" data-index="${index}" value="${event}" />
                <button class="delete-event" data-date="${date}" data-index="${index}">Delete</button>
            </li>
        `).join('');
        this.settings.eventList.html(eventListHtml);
        this.bindEditEventClicks();
        this.bindDeleteEventClicks();
    },

    bindEditEventClicks: function() {
        const self = this;
        this.settings.eventList.find('.edit-event').on('change', function() {
            const index = $(this).data('index');
            const newValue = $(this).val();
            const date = self.settings.selectedDate;
            self.editEvent(date, index, newValue);
        });
    },

    bindDeleteEventClicks: function() {
        const self = this;
        this.settings.eventList.find('.delete-event').on('click', function() {
            const date = $(this).data('date');
            const index = $(this).data('index');
            self.deleteEvent(date, index);
        });
    },

    editEvent: function(date, index, newValue) {
        if (this.events[date]) {
            this.events[date][index] = newValue;
        }
        this.showEventsForDate(date);
        this.renderCalendar(this.currentDate);
    },

    deleteEvent: function(date, index) {
        if (this.events[date]) {
            this.events[date].splice(index, 1);
            if (this.events[date].length === 0) {
                delete this.events[date];
            }
        }
        this.showEventsForDate(date);
        this.renderCalendar(this.currentDate);
    },

    bindUIActions: function() {
        const self = this;
        this.settings.prevButton.on('click', function() {
            self.currentDate.setMonth(self.currentDate.getMonth() - 1);
            self.renderCalendar(self.currentDate);
        });

        this.settings.nextButton.on('click', function() {
            self.currentDate.setMonth(self.currentDate.getMonth() + 1);
            self.renderCalendar(self.currentDate);
        });

        this.settings.saveButton.on('click', function() {
            const eventDate = self.settings.selectedDate;
            const eventDescription = self.settings.input.val();
            if (eventDescription) {
                if (!self.events[eventDate]) {
                    self.events[eventDate] = [];
                }
                self.events[eventDate].push(eventDescription);
                self.settings.input.val('');
            }
            self.showEventsForDate(eventDate);
            self.renderCalendar(self.currentDate);
        });

        this.settings.dismissButton.on('click', function() {
            self.settings.container.toggleClass('flip');
        });
    }
};

$(document).ready(function() {
    app.init();
});


// Select necessary DOM elements
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const volumeSlider = document.getElementById('volume-slider');
const trackInfo = document.getElementById('track-name');
const musicUpload = document.getElementById('music-upload');

let audio = new Audio(); // Create new Audio object
let musicFiles = []; // Array to store uploaded files
let currentTrackIndex = 0; // Track index

// Play or Pause the music
playPauseBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playPauseBtn.textContent = 'Pause';
    } else {
        audio.pause();
        playPauseBtn.textContent = 'Play';
    }
});

// Play previous track
prevBtn.addEventListener('click', () => {
    if (currentTrackIndex > 0) {
        currentTrackIndex--;
        playTrack(currentTrackIndex);
    }
});

// Play next track
nextBtn.addEventListener('click', () => {
    if (currentTrackIndex < musicFiles.length - 1) {
        currentTrackIndex++;
        playTrack(currentTrackIndex);
    }
});

// Adjust volume
volumeSlider.addEventListener('input', (e) => {
    audio.volume = e.target.value;
});

// Upload music files
musicUpload.addEventListener('change', (event) => {
    musicFiles = Array.from(event.target.files); // Get the uploaded files
    currentTrackIndex = 0; // Start from the first file
    if (musicFiles.length > 0) {
        playTrack(currentTrackIndex); // Play the first track
    }
});

// Function to play a specific track
function playTrack(index) {
    const file = musicFiles[index];
    const fileURL = URL.createObjectURL(file); // Create a URL for the file
    audio.src = fileURL; // Set audio source
    audio.play(); // Play the track
    playPauseBtn.textContent = 'Pause'; // Change button to 'Pause'
    trackInfo.textContent = file.name; // Display track name
}

// Handle when track ends (play next)
audio.addEventListener('ended', () => {
    if (currentTrackIndex < musicFiles.length - 1) {
        currentTrackIndex++;
        playTrack(currentTrackIndex);
    } else {
        playPauseBtn.textContent = 'Play'; // Reset to Play button after all tracks
    }
});


// Get file input and gallery elements
const photoUpload = document.getElementById('photo-upload');
const photoGallery = document.getElementById('photo-gallery');

// Listen for file input change (photo upload)
photoUpload.addEventListener('change', (event) => {
    const files = event.target.files; // Get selected files
    handleFiles(files); // Handle the uploaded files
});

// Handle file upload and create previews
function handleFiles(files) {
    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (!file.type.startsWith('image/')) {
            continue; // Only process image files
        }

        const imgElement = createImagePreview(file); // Create image preview element
        photoGallery.appendChild(imgElement); // Append preview to gallery
    }
}

// Create image preview element
function createImagePreview(file) {
    const reader = new FileReader();

    const photoItem = document.createElement('div');
    photoItem.classList.add('photo-item');

    const img = document.createElement('img');
    photoItem.appendChild(img);

    // Delete button for each photo
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', () => {
        photoItem.remove(); // Remove the photo preview
    });
    photoItem.appendChild(deleteBtn);

    // Use FileReader to convert the image file to a data URL
    reader.onload = (e) => {
        img.src = e.target.result; // Set image src to the uploaded photo
    };
    reader.readAsDataURL(file); // Read the file to trigger the onload event

    return photoItem;
}