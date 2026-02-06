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
        const cell = createDateCell(day, 'other-month');
        dateGrid.appendChild(cell);
    }

    // Add current month's days
    for (let day = 1; day <= daysInMonth; day++) {
        const cell = createDateCell(day, 'current-month');

        // Highlight today
        if (isToday(year, month, day)) {
            cell.classList.add('today');
        }

        dateGrid.appendChild(cell);
    }

    // Add next month's leading days to complete the grid
    const totalCells = dateGrid.children.length;
    const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);

    for (let day = 1; day <= remainingCells; day++) {
        const cell = createDateCell(day, 'other-month');
        dateGrid.appendChild(cell);
    }
}

/**
 * Create a date cell element
 * @param {number} day - The day number
 * @param {string} className - Additional class name for the cell
 * @returns {HTMLElement} The created cell element
 */
function createDateCell(day, className) {
    const cell = document.createElement('div');
    cell.className = `date-cell ${className}`;
    cell.textContent = day;
    return cell;
}

// Initialize calendar on page load
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date();
    renderCalendar(today.getFullYear(), today.getMonth());

    // Add navigation event listeners
    document.getElementById('prevMonth').addEventListener('click', () => {
        const prev = getPreviousMonth(currentYear, currentMonth);
        renderCalendar(prev.year, prev.month);
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
        const next = getNextMonth(currentYear, currentMonth);
        renderCalendar(next.year, next.month);
    });
});
