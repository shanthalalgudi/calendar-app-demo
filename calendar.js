// Date utility functions

/**
 * Get the number of days in a given month
 * @param {number} year - The year
 * @param {number} month - The month (0-11, where 0 is January)
 * @returns {number} Number of days in the month
 */
function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

/**
 * Get the day of week for the first day of the month
 * @param {number} year - The year
 * @param {number} month - The month (0-11, where 0 is January)
 * @returns {number} Day of week (0-6, where 0 is Sunday)
 */
function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
}

/**
 * Check if a given date is today
 * @param {number} year - The year
 * @param {number} month - The month (0-11, where 0 is January)
 * @param {number} day - The day of month
 * @returns {boolean} True if the date is today
 */
function isToday(year, month, day) {
    const today = new Date();
    return (
        today.getFullYear() === year &&
        today.getMonth() === month &&
        today.getDate() === day
    );
}

/**
 * Get the previous month and year
 * @param {number} year - The current year
 * @param {number} month - The current month (0-11)
 * @returns {object} Object with year and month for previous month
 */
function getPreviousMonth(year, month) {
    if (month === 0) {
        return { year: year - 1, month: 11 };
    }
    return { year: year, month: month - 1 };
}

/**
 * Get the next month and year
 * @param {number} year - The current year
 * @param {number} month - The current month (0-11)
 * @returns {object} Object with year and month for next month
 */
function getNextMonth(year, month) {
    if (month === 11) {
        return { year: year + 1, month: 0 };
    }
    return { year: year, month: month + 1 };
}

// Calendar state
let currentYear;
let currentMonth;

// Event management state
let events = [];
let editingEventId = null;

/**
 * Render the calendar for a given month and year
 * @param {number} year - The year to render
 * @param {number} month - The month to render (0-11)
 */
function renderCalendar(year, month) {
    // Update current state
    currentYear = year;
    currentMonth = month;

    // Update month/year header
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    document.getElementById('monthYear').textContent = `${monthNames[month]} ${year}`;

    // Get calendar data
    const firstDay = getFirstDayOfMonth(year, month);
    const daysInMonth = getDaysInMonth(year, month);

    // Get previous month data for filling partial weeks
    const prevMonthData = getPreviousMonth(year, month);
    const daysInPrevMonth = getDaysInMonth(prevMonthData.year, prevMonthData.month);

    // Clear existing grid
    const dateGrid = document.getElementById('dateGrid');
    dateGrid.innerHTML = '';

    // Add previous month's trailing days
    for (let i = firstDay - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        const cell = createDateCell(day, 'other-month', prevMonthData.year, prevMonthData.month);
        dateGrid.appendChild(cell);
    }

    // Add current month's days
    for (let day = 1; day <= daysInMonth; day++) {
        const cell = createDateCell(day, 'current-month', year, month);

        // Highlight today
        if (isToday(year, month, day)) {
            cell.classList.add('today');
        }

        // Add event indicators
        renderEventIndicators(cell, year, month, day);

        dateGrid.appendChild(cell);
    }

    // Add next month's leading days to complete the grid
    const totalCells = dateGrid.children.length;
    const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    const nextMonthData = getNextMonth(year, month);

    for (let day = 1; day <= remainingCells; day++) {
        const cell = createDateCell(day, 'other-month', nextMonthData.year, nextMonthData.month);
        dateGrid.appendChild(cell);
    }
}

/**
 * Create a date cell element
 * @param {number} day - The day number
 * @param {string} className - Additional class name for the cell
 * @param {number} year - The year (optional, for event handling)
 * @param {number} month - The month (optional, for event handling)
 * @returns {HTMLElement} The created cell element
 */
function createDateCell(day, className, year, month) {
    const cell = document.createElement('div');
    cell.className = `date-cell ${className}`;

    // Create date number element
    const dateNumber = document.createElement('span');
    dateNumber.className = 'date-number';
    dateNumber.textContent = day;
    cell.appendChild(dateNumber);

    // Add event indicators container
    const indicatorsContainer = document.createElement('div');
    indicatorsContainer.className = 'event-indicators';
    cell.appendChild(indicatorsContainer);

    // Add click handler for current month dates
    if (className === 'current-month' && year !== undefined && month !== undefined) {
        cell.addEventListener('click', () => {
            openViewEventsModal(year, month, day);
        });
    }

    return cell;
}

// ========================================
// Event Management Functions
// ========================================

/**
 * Generate a unique ID for an event
 * @returns {string} Unique event ID
 */
function generateId() {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Load events from localStorage
 * @returns {Array} Array of event objects
 */
function loadEvents() {
    try {
        const eventsJson = localStorage.getItem('calendar_events');
        return eventsJson ? JSON.parse(eventsJson) : [];
    } catch (error) {
        console.error('Error loading events:', error);
        return [];
    }
}

/**
 * Save events to localStorage
 * @param {Array} eventsArray - Array of event objects to save
 */
function saveEvents(eventsArray) {
    try {
        localStorage.setItem('calendar_events', JSON.stringify(eventsArray));
    } catch (error) {
        console.error('Error saving events:', error);
    }
}

/**
 * Create a new event
 * @param {string} title - Event title
 * @param {string} date - Event date (YYYY-MM-DD format)
 * @param {string} time - Event time (HH:MM format)
 * @param {string} email - Email for notifications
 * @returns {object} The created event object
 */
function createEvent(title, date, time, email) {
    const event = {
        id: generateId(),
        title: title.trim(),
        date: date,
        time: time,
        email: email.trim(),
        notificationsSent: {
            '24h': false,
            '1h': false
        },
        createdAt: Date.now()
    };

    events.push(event);
    saveEvents(events);
    return event;
}

/**
 * Update an existing event
 * @param {string} id - Event ID
 * @param {object} updates - Object with fields to update
 * @returns {object|null} Updated event or null if not found
 */
function updateEvent(id, updates) {
    const eventIndex = events.findIndex(e => e.id === id);
    if (eventIndex === -1) return null;

    events[eventIndex] = { ...events[eventIndex], ...updates };
    saveEvents(events);
    return events[eventIndex];
}

/**
 * Delete an event
 * @param {string} id - Event ID to delete
 * @returns {boolean} True if deleted, false if not found
 */
function deleteEvent(id) {
    const initialLength = events.length;
    events = events.filter(e => e.id !== id);

    if (events.length < initialLength) {
        saveEvents(events);
        return true;
    }
    return false;
}

/**
 * Get all events for a specific date
 * @param {number} year - The year
 * @param {number} month - The month (0-11)
 * @param {number} day - The day of month
 * @returns {Array} Array of events for that date
 */
function getEventsForDate(year, month, day) {
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === dateString);
}

/**
 * Get upcoming events sorted by date and time
 * @param {number} limit - Maximum number of events to return
 * @returns {Array} Array of upcoming events
 */
function getUpcomingEvents(limit = 5) {
    const now = new Date();

    return events
        .filter(event => {
            const eventDateTime = new Date(`${event.date}T${event.time}`);
            return eventDateTime >= now;
        })
        .sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time}`);
            const dateB = new Date(`${b.date}T${b.time}`);
            return dateA - dateB;
        })
        .slice(0, limit);
}

// ========================================
// UI Rendering Functions
// ========================================

/**
 * Render event indicators (dots) on a date cell
 * @param {HTMLElement} cell - The date cell element
 * @param {number} year - The year
 * @param {number} month - The month (0-11)
 * @param {number} day - The day of month
 */
function renderEventIndicators(cell, year, month, day) {
    const dayEvents = getEventsForDate(year, month, day);
    const indicatorsContainer = cell.querySelector('.event-indicators');

    if (dayEvents.length === 0) return;

    // Show up to 3 dots
    const maxDots = 3;
    const dotsToShow = Math.min(dayEvents.length, maxDots);

    for (let i = 0; i < dotsToShow; i++) {
        const dot = document.createElement('div');
        dot.className = 'event-dot';
        // Alternate colors for visual variety
        if (i % 2 === 0) {
            dot.style.backgroundColor = '#007bff';
        } else {
            dot.style.backgroundColor = '#fd7e14';
        }
        indicatorsContainer.appendChild(dot);
    }

    // Show "+X more" if there are additional events
    if (dayEvents.length > maxDots) {
        const moreText = document.createElement('span');
        moreText.className = 'event-more';
        moreText.textContent = `+${dayEvents.length - maxDots}`;
        indicatorsContainer.appendChild(moreText);
    }
}

// ========================================
// Modal Functions
// ========================================

/**
 * Open the event modal
 * @param {string} prefilledDate - Optional date to prefill (YYYY-MM-DD format)
 */
function openEventModal(prefilledDate = null) {
    const modal = document.getElementById('eventModal');
    const form = document.getElementById('eventForm');
    const modalTitle = document.getElementById('modalTitle');

    // Reset form
    form.reset();
    editingEventId = null;

    // Set title
    modalTitle.textContent = 'Add Event';

    // Prefill date if provided
    if (prefilledDate) {
        document.getElementById('eventDate').value = prefilledDate;
    } else {
        // Default to today
        const today = new Date();
        const dateString = today.toISOString().split('T')[0];
        document.getElementById('eventDate').value = dateString;
    }

    // Default time to 12:00
    document.getElementById('eventTime').value = '12:00';

    // Show modal
    modal.classList.add('open');
}

/**
 * Open event modal with existing event data for editing
 * @param {string} eventId - ID of event to edit
 */
function openEditEventModal(eventId) {
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    const modal = document.getElementById('eventModal');
    const modalTitle = document.getElementById('modalTitle');

    // Set form values
    document.getElementById('eventTitle').value = event.title;
    document.getElementById('eventDate').value = event.date;
    document.getElementById('eventTime').value = event.time;
    document.getElementById('eventEmail').value = event.email;

    // Set editing state
    editingEventId = eventId;
    modalTitle.textContent = 'Edit Event';

    // Show modal
    modal.classList.add('open');
}

/**
 * Close a modal
 * @param {string} modalId - ID of modal to close
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('open');
    editingEventId = null;
}

/**
 * Handle event form submission
 * @param {Event} e - Form submit event
 */
function handleEventFormSubmit(e) {
    e.preventDefault();

    const title = document.getElementById('eventTitle').value;
    const date = document.getElementById('eventDate').value;
    const time = document.getElementById('eventTime').value;
    const email = document.getElementById('eventEmail').value;

    // Validate
    if (!title || !date || !time || !email) {
        alert('Please fill in all fields');
        return;
    }

    // Create or update event
    if (editingEventId) {
        updateEvent(editingEventId, { title, date, time, email });
    } else {
        createEvent(title, date, time, email);
    }

    // Close modal and refresh calendar
    closeModal('eventModal');
    renderCalendar(currentYear, currentMonth);
    renderUpcomingEvents();
}

/**
 * Open modal to view all events for a specific date
 * @param {number} year - The year
 * @param {number} month - The month (0-11)
 * @param {number} day - The day of month
 */
function openViewEventsModal(year, month, day) {
    const dayEvents = getEventsForDate(year, month, day);
    const modal = document.getElementById('viewEventsModal');
    const title = document.getElementById('viewEventsTitle');
    const container = document.getElementById('eventsListContainer');

    // Set title with date
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    title.textContent = `Events - ${monthNames[month]} ${day}, ${year}`;

    // Render events
    renderDateEvents(container, dayEvents, year, month, day);

    // Show modal
    modal.classList.add('open');
}

/**
 * Render events list for a specific date
 * @param {HTMLElement} container - Container element
 * @param {Array} dayEvents - Array of events for the date
 * @param {number} year - The year
 * @param {number} month - The month (0-11)
 * @param {number} day - The day of month
 */
function renderDateEvents(container, dayEvents, year, month, day) {
    container.innerHTML = '';

    if (dayEvents.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = `
            <p>No events for this day</p>
            <button class="btn-primary" onclick="openEventModalForDate(${year}, ${month}, ${day})">Add Event</button>
        `;
        container.appendChild(emptyState);
        return;
    }

    // Sort events by time
    dayEvents.sort((a, b) => a.time.localeCompare(b.time));

    dayEvents.forEach(event => {
        const item = document.createElement('div');
        item.className = 'event-list-item';
        item.innerHTML = `
            <h3>${escapeHtml(event.title)}</h3>
            <p><strong>Time:</strong> ${formatTime(event.time)}</p>
            <p><strong>Email:</strong> ${escapeHtml(event.email)}</p>
            <div class="event-actions">
                <button class="btn-primary" onclick="editEventFromList('${event.id}')">Edit</button>
                <button class="btn-secondary" onclick="deleteEventFromList('${event.id}')">Delete</button>
            </div>
        `;
        container.appendChild(item);
    });
}

/**
 * Open event modal with date prefilled (called from view events modal)
 * @param {number} year - The year
 * @param {number} month - The month (0-11)
 * @param {number} day - The day of month
 */
function openEventModalForDate(year, month, day) {
    closeModal('viewEventsModal');
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    openEventModal(dateString);
}

/**
 * Edit event from events list
 * @param {string} eventId - Event ID
 */
function editEventFromList(eventId) {
    closeModal('viewEventsModal');
    openEditEventModal(eventId);
}

/**
 * Delete event from events list
 * @param {string} eventId - Event ID
 */
function deleteEventFromList(eventId) {
    if (!confirm('Are you sure you want to delete this event?')) {
        return;
    }

    deleteEvent(eventId);
    renderCalendar(currentYear, currentMonth);
    renderUpcomingEvents();
    closeModal('viewEventsModal');
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Format time from 24-hour to 12-hour format
 * @param {string} timeString - Time in HH:MM format
 * @returns {string} Formatted time (e.g., "2:30 PM")
 */
function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
}

/**
 * Format date to readable string
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {string} Formatted date (e.g., "February 10, 2026")
 */
function formatDate(dateString) {
    const [year, month, day] = dateString.split('-').map(Number);
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${monthNames[month - 1]} ${day}, ${year}`;
}

/**
 * Get countdown string for an event
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @param {string} timeString - Time in HH:MM format
 * @returns {string} Countdown string (e.g., "in 2 days, 5 hours")
 */
function getCountdown(dateString, timeString) {
    const eventDateTime = new Date(`${dateString}T${timeString}`);
    const now = new Date();
    const diff = eventDateTime - now;

    if (diff < 0) {
        return 'Past event';
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
        return `in ${days} day${days > 1 ? 's' : ''}, ${hours} hour${hours !== 1 ? 's' : ''}`;
    } else if (hours > 0) {
        return `in ${hours} hour${hours > 1 ? 's' : ''}, ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else {
        return `in ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
}

// ========================================
// EmailJS Configuration Functions
// ========================================

/**
 * Load EmailJS configuration from localStorage
 * @returns {object|null} Configuration object or null if not set
 */
function loadEmailJSConfig() {
    try {
        const configJson = localStorage.getItem('emailjs_config');
        return configJson ? JSON.parse(configJson) : null;
    } catch (error) {
        console.error('Error loading EmailJS config:', error);
        return null;
    }
}

/**
 * Save EmailJS configuration to localStorage
 * @param {object} config - Configuration object with serviceId, templateId, publicKey
 */
function saveEmailJSConfig(config) {
    try {
        localStorage.setItem('emailjs_config', JSON.stringify(config));
    } catch (error) {
        console.error('Error saving EmailJS config:', error);
    }
}

/**
 * Initialize EmailJS with saved configuration
 */
function initializeEmailJS() {
    const config = loadEmailJSConfig();
    if (config && config.publicKey && typeof emailjs !== 'undefined') {
        emailjs.init(config.publicKey);
        return true;
    }
    return false;
}

/**
 * Open settings modal
 */
function openSettingsModal() {
    const modal = document.getElementById('settingsModal');
    const config = loadEmailJSConfig();

    // Prefill form if config exists
    if (config) {
        document.getElementById('serviceId').value = config.serviceId || '';
        document.getElementById('templateId').value = config.templateId || '';
        document.getElementById('publicKey').value = config.publicKey || '';
    }

    modal.classList.add('open');
}

/**
 * Handle settings form submission
 * @param {Event} e - Form submit event
 */
function handleSettingsFormSubmit(e) {
    e.preventDefault();

    const config = {
        serviceId: document.getElementById('serviceId').value.trim(),
        templateId: document.getElementById('templateId').value.trim(),
        publicKey: document.getElementById('publicKey').value.trim()
    };

    if (!config.serviceId || !config.templateId || !config.publicKey) {
        alert('Please fill in all fields');
        return;
    }

    saveEmailJSConfig(config);
    initializeEmailJS();
    closeModal('settingsModal');
    alert('EmailJS settings saved successfully!');
}

/**
 * Test EmailJS configuration by sending a test email
 */
function testEmailJS() {
    const config = loadEmailJSConfig();

    if (!config || !config.serviceId || !config.templateId || !config.publicKey) {
        alert('Please configure and save EmailJS settings first');
        return;
    }

    if (typeof emailjs === 'undefined') {
        alert('EmailJS SDK not loaded');
        return;
    }

    const testEmail = document.getElementById('publicKey').value.trim() ?
        prompt('Enter email address to send test notification:') : null;

    if (!testEmail) {
        alert('Test cancelled');
        return;
    }

    // Initialize if not already done
    emailjs.init(config.publicKey);

    const templateParams = {
        to_email: testEmail,
        event_title: 'Test Event',
        event_date: 'February 10, 2026',
        event_time: '2:00 PM',
        reminder_type: '24 hours'
    };

    emailjs.send(config.serviceId, config.templateId, templateParams)
        .then(() => {
            alert('Test email sent successfully! Check your inbox.');
        })
        .catch((error) => {
            console.error('EmailJS test failed:', error);
            alert('Failed to send test email. Please check your configuration and console for errors.');
        });
}

// ========================================
// Notification System
// ========================================

/**
 * Request browser notification permission
 */
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

/**
 * Check all events for due notifications
 */
function checkNotifications() {
    const now = new Date();

    events.forEach(event => {
        const eventDateTime = new Date(`${event.date}T${event.time}`);
        const timeDiff = eventDateTime - now;

        // Convert to hours
        const hoursUntil = timeDiff / (1000 * 60 * 60);

        // Check for 24-hour reminder (23-25 hours before)
        if (hoursUntil >= 23 && hoursUntil <= 25 && !event.notificationsSent['24h']) {
            sendEventNotification(event, '24 hour');
            event.notificationsSent['24h'] = true;
            saveEvents(events);
        }

        // Check for 1-hour reminder (50 minutes - 70 minutes before)
        if (hoursUntil >= 0.83 && hoursUntil <= 1.17 && !event.notificationsSent['1h']) {
            sendEventNotification(event, '1 hour');
            event.notificationsSent['1h'] = true;
            saveEvents(events);
        }
    });
}

/**
 * Send event notification (both email and browser)
 * @param {object} event - Event object
 * @param {string} reminderType - Type of reminder ("24 hour" or "1 hour")
 */
function sendEventNotification(event, reminderType) {
    // Send email notification
    sendEmailNotification(event, reminderType);

    // Send browser notification
    const title = `Event Reminder: ${event.title}`;
    const body = `${formatDate(event.date)} at ${formatTime(event.time)} (${reminderType} reminder)`;
    showBrowserNotification(title, body);
}

/**
 * Send email notification via EmailJS
 * @param {object} event - Event object
 * @param {string} reminderType - Type of reminder ("24 hour" or "1 hour")
 */
function sendEmailNotification(event, reminderType) {
    const config = loadEmailJSConfig();

    if (!config || !config.serviceId || !config.templateId || !config.publicKey) {
        console.log('EmailJS not configured, skipping email notification');
        return;
    }

    if (typeof emailjs === 'undefined') {
        console.error('EmailJS SDK not loaded');
        return;
    }

    const templateParams = {
        to_email: event.email,
        event_title: event.title,
        event_date: formatDate(event.date),
        event_time: formatTime(event.time),
        reminder_type: reminderType
    };

    emailjs.send(config.serviceId, config.templateId, templateParams)
        .then(() => {
            console.log(`Email notification sent for event: ${event.title} (${reminderType})`);
        })
        .catch((error) => {
            console.error('EmailJS error:', error);
        });
}

/**
 * Show browser notification
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 */
function showBrowserNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
            body: body,
            icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="75" font-size="75">📅</text></svg>'
        });
    }
}

// ========================================
// Upcoming Events Functions
// ========================================

/**
 * Render upcoming events list
 */
function renderUpcomingEvents() {
    const container = document.getElementById('upcomingEventsList');
    const upcomingEvents = getUpcomingEvents(5);

    container.innerHTML = '';

    if (upcomingEvents.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = '<p>No upcoming events</p>';
        container.appendChild(emptyState);
        return;
    }

    upcomingEvents.forEach(event => {
        const item = document.createElement('div');
        item.className = 'upcoming-event-item';
        item.innerHTML = `
            <h3>${escapeHtml(event.title)}</h3>
            <p><strong>Date:</strong> ${formatDate(event.date)}</p>
            <p><strong>Time:</strong> ${formatTime(event.time)}</p>
            <p class="countdown">${getCountdown(event.date, event.time)}</p>
        `;
        container.appendChild(item);
    });
}

/**
 * Toggle upcoming events list visibility
 */
function toggleUpcomingEvents() {
    const list = document.getElementById('upcomingEventsList');
    const icon = document.getElementById('toggleIcon');

    list.classList.toggle('collapsed');
    icon.classList.toggle('collapsed');
}

// Initialize calendar on page load
document.addEventListener('DOMContentLoaded', () => {
    // Load events from localStorage
    events = loadEvents();

    // Initialize EmailJS
    initializeEmailJS();

    // Request notification permission
    requestNotificationPermission();

    // Check for due notifications
    checkNotifications();

    // Set up periodic notification checks (every 5 minutes)
    setInterval(checkNotifications, 5 * 60 * 1000);

    const today = new Date();
    renderCalendar(today.getFullYear(), today.getMonth());
    renderUpcomingEvents();

    // Add navigation event listeners
    document.getElementById('prevMonth').addEventListener('click', () => {
        const prev = getPreviousMonth(currentYear, currentMonth);
        renderCalendar(prev.year, prev.month);
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
        const next = getNextMonth(currentYear, currentMonth);
        renderCalendar(next.year, next.month);
    });

    // Settings button listener
    document.getElementById('settingsBtn').addEventListener('click', () => {
        openSettingsModal();
    });

    // Add event button listener
    document.getElementById('addEventBtn').addEventListener('click', () => {
        openEventModal();
    });

    // Event form submission
    document.getElementById('eventForm').addEventListener('submit', handleEventFormSubmit);

    // Settings form submission
    document.getElementById('settingsForm').addEventListener('submit', handleSettingsFormSubmit);
});
