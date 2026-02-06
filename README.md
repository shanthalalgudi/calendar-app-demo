# Calendar App with Event Management

A full-featured calendar application with event management and email notifications, built with vanilla HTML, CSS, and JavaScript.

## Features

### Calendar Display
- 📅 Displays current month in a clean grid layout
- ⬅️➡️ Navigate between months with previous/next buttons
- 🎯 Highlights today's date
- 📱 Responsive design for mobile and desktop
- 🚀 No dependencies (except EmailJS for email notifications)

### Event Management
- ➕ Create, edit, and delete events
- 🔵 Visual event indicators (colored dots) on calendar dates
- 👁️ View all events for a specific date by clicking on it
- 📋 Upcoming events list with countdown timers
- 💾 Events persist in browser localStorage

### Notifications
- 📧 Email notifications via EmailJS (24h and 1h before events)
- 🔔 Browser notifications when page is open
- ⚙️ Easy EmailJS configuration through settings modal
- 🔄 Automatic notification checks every 5 minutes
- ✅ Duplicate notification prevention

## Quick Start

1. Open `index.html` in any web browser
2. Click "**+ Add Event**" to create your first event
3. Click on any date to view events for that day
4. (Optional) Configure EmailJS in Settings (⚙) for email notifications

## EmailJS Setup (Optional)

Email notifications are optional. To enable them:

1. Create a free account at [EmailJS](https://www.emailjs.com/)
2. Configure an email service and template
3. Click the Settings button (⚙) in the calendar
4. Enter your Service ID, Template ID, and Public Key
5. Click "Test Email" to verify configuration

**See [emailjs-setup.md](emailjs-setup.md) for detailed setup instructions.**

## File Structure

```
calendar_app_demo/
├── index.html          # Main HTML structure
├── styles.css          # CSS styling and layout
├── calendar.js         # Core logic and event management
├── emailjs-setup.md    # EmailJS configuration guide
├── tasks/
│   └── todo.md         # Implementation checklist
└── README.md           # This file
```

## How to Use

### Creating Events

1. Click the "**+ Add Event**" button in the header
2. Fill in the event details:
   - **Event Title**: Name of your event
   - **Date**: When the event occurs
   - **Time**: Event time (12:00 PM by default)
   - **Email**: Where to send notification reminders
3. Click "**Save Event**"

### Viewing Events

- **Event indicators**: Small colored dots appear below dates that have events
- **Click on a date**: Opens a modal showing all events for that day
- **Upcoming Events**: Collapsible section below calendar shows next 5 events

### Editing/Deleting Events

1. Click on a date with events
2. In the event list modal, click:
   - "**Edit**" to modify event details
   - "**Delete**" to remove the event (with confirmation)

### Notifications

- Events automatically send reminders at:
  - **24 hours** before the event
  - **1 hour** before the event
- Browser notifications show when the page is open
- Email notifications require EmailJS configuration (see emailjs-setup.md)

## Technical Details

### Data Storage
- Events stored in browser localStorage
- Persists across page reloads
- Notification status tracked to prevent duplicates

### Architecture
- **No build tools required** - runs directly in browser
- Vanilla JavaScript with no frameworks
- EmailJS SDK loaded from CDN for email notifications
- Event-driven architecture with clear separation of concerns

### Browser Compatibility
Works in all modern browsers that support:
- CSS Grid and Flexbox
- ES6 JavaScript (arrow functions, classes, modules)
- localStorage API
- Notification API (for browser notifications)
- Fetch API (for EmailJS)

## Testing Checklist

### Calendar Display
- ✅ Calendar displays current month on load
- ✅ Today's date is highlighted
- ✅ Navigation buttons work correctly
- ✅ Dates align properly under day names
- ✅ Year transitions work (Dec → Jan, Jan → Dec)
- ✅ Leap year handling (test February 2024 vs 2025)
- ✅ Responsive layout at different screen sizes

### Event Management
- ✅ Add Event modal opens and closes correctly
- ✅ Form validation works (required fields)
- ✅ Events persist after page reload
- ✅ Event dots appear on correct dates
- ✅ Click date to view events modal
- ✅ Edit event updates correctly
- ✅ Delete event removes from storage and UI
- ✅ Upcoming events list shows correct events
- ✅ Countdown timers display accurately

### Notifications
- ✅ EmailJS settings can be saved and loaded
- ✅ Test email functionality works
- ✅ Browser notification permission requested
- ✅ Notifications checked on page load
- ✅ Periodic checks run every 5 minutes
- ✅ Duplicate notifications prevented

### Code Quality
- ✅ No console errors
- ✅ JSDoc comments on functions
- ✅ Clean, readable code structure
- ✅ XSS prevention (HTML escaping)

## Privacy & Security

- **Local storage**: All event data stored locally in your browser
- **No server**: Events never leave your device (except emails via EmailJS)
- **EmailJS**: Only used if you configure it; credentials stored in browser localStorage
- **No tracking**: No analytics or third-party tracking
- **XSS protection**: User input is escaped before rendering

## Troubleshooting

### Events not appearing
- Check browser console for errors
- Verify localStorage is enabled in your browser
- Try clearing localStorage and recreating events

### Email notifications not sending
- See [emailjs-setup.md](emailjs-setup.md) for configuration help
- Check EmailJS dashboard for error logs
- Use "Test Email" button to verify configuration

### Browser notifications not showing
- Check browser notification permissions
- Ensure notifications are enabled for the site
- Some browsers block notifications on file:// URLs - try using a local server

## Future Enhancements

Possible additions:
- Multi-day events and recurring events
- Week view and year view
- Event categories with color coding
- Export/import events (iCal format)
- Integration with Google Calendar API
- Dark mode theme

## License

Free to use and modify.

## Credits

Built with vanilla JavaScript, HTML, and CSS. Email notifications powered by [EmailJS](https://www.emailjs.com/).
