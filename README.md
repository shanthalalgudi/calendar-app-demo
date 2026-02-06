# Simple Calendar App

A minimal, dependency-free calendar application built with vanilla HTML, CSS, and JavaScript.

## Features

- 📅 Displays current month in a clean grid layout
- ⬅️➡️ Navigate between months with previous/next buttons
- 🎯 Highlights today's date
- 📱 Responsive design for mobile and desktop
- 🚀 No dependencies - runs directly in any browser

## Usage

1. Open `index.html` in any web browser
2. The calendar will display the current month
3. Use the `<` and `>` buttons to navigate between months
4. Today's date is highlighted in blue

## File Structure

```
calendar_app_demo/
├── index.html          # Main HTML structure
├── styles.css          # CSS Grid layout and styling
├── calendar.js         # Date calculations and rendering logic
├── tasks/
│   └── todo.md        # Implementation checklist
└── README.md          # This file
```

## Implementation Details

### Date Calculations
- Uses native JavaScript `Date` object
- Automatically handles leap years
- Properly manages year transitions (Dec ↔ Jan)

### Layout
- CSS Grid with 7 columns (Sunday-Saturday)
- Partial weeks filled with previous/next month dates
- Responsive design with mobile-friendly breakpoints

### Browser Compatibility
Works in all modern browsers that support:
- CSS Grid
- ES6 JavaScript (arrow functions, template literals)
- DOM APIs (addEventListener, querySelector)

## Testing Checklist

- ✅ Calendar displays current month on load
- ✅ Today's date is highlighted
- ✅ Navigation buttons work correctly
- ✅ Dates align properly under day names
- ✅ Year transitions work (Dec → Jan, Jan → Dec)
- ✅ Leap year handling (test February 2024 vs 2025)
- ✅ Responsive layout at different screen sizes
- ✅ No console errors

## Future Enhancements

Possible additions (not currently implemented):
- Event creation and management
- Multi-day event display
- Week view and year view
- Date selection functionality
- Integration with external calendar APIs

## License

Free to use and modify.
