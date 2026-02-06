# EmailJS Setup Guide

This guide will walk you through setting up EmailJS to enable email notifications for your calendar events.

## Overview

EmailJS allows you to send emails directly from the browser without a backend server. The calendar app uses EmailJS to send reminder notifications 24 hours and 1 hour before events.

## Step 1: Create an EmailJS Account

1. Go to [EmailJS](https://www.emailjs.com/)
2. Click "Sign Up" to create a free account
3. Verify your email address

## Step 2: Add an Email Service

1. Log in to your EmailJS dashboard
2. Go to **Email Services** in the left sidebar
3. Click **Add New Service**
4. Choose your email provider:
   - **Gmail** (recommended for personal use)
   - **Outlook/Hotmail**
   - **Yahoo**
   - Or use a custom SMTP server
5. Follow the connection instructions for your chosen provider
6. Click **Create Service**
7. **Save your Service ID** - you'll need this later (looks like `service_xxxxxxx`)

### Gmail Setup Tips
- You may need to enable "Less secure app access" or use an "App Password" if you have 2-factor authentication enabled
- For App Passwords: Google Account → Security → 2-Step Verification → App passwords

## Step 3: Create an Email Template

1. Go to **Email Templates** in the left sidebar
2. Click **Create New Template**
3. Set up your template with the following variables:

### Template Structure

**Subject:**
```
Event Reminder: {{event_title}}
```

**Body:**
```
Hello,

This is a reminder for your upcoming event:

Event: {{event_title}}
Date: {{event_date}}
Time: {{event_time}}

This is your {{reminder_type}} reminder.

Best regards,
Your Calendar App
```

4. Click **Save**
5. **Save your Template ID** - you'll need this later (looks like `template_xxxxxxx`)

### Required Template Variables

Make sure your template includes these variables (double curly braces):
- `{{event_title}}` - The event name
- `{{event_date}}` - The event date (formatted)
- `{{event_time}}` - The event time (formatted)
- `{{reminder_type}}` - Either "24 hour" or "1 hour"
- `{{to_email}}` - Recipient email (auto-populated by EmailJS)

## Step 4: Get Your Public Key

1. Go to **Account** in the left sidebar
2. Click on **API Keys**
3. Copy your **Public Key** (looks like a long string of characters)

## Step 5: Configure the Calendar App

1. Open the calendar app in your browser
2. Click the **Settings** button (⚙ icon) in the calendar header
3. Enter your credentials:
   - **Service ID**: The ID from Step 2 (e.g., `service_abc123`)
   - **Template ID**: The ID from Step 3 (e.g., `template_xyz789`)
   - **Public Key**: The key from Step 4
4. Click **Save Settings**

## Step 6: Test Your Configuration

1. In the Settings modal, click **Test Email**
2. Enter an email address when prompted
3. Check your inbox for the test notification
4. If you receive the test email, configuration is complete! ✅

## Troubleshooting

### Test email not received

1. **Check spam folder** - EmailJS emails sometimes land in spam initially
2. **Verify Service ID, Template ID, and Public Key** - Make sure they're copied correctly
3. **Check EmailJS dashboard** - Go to **History** to see if the email was sent
4. **Email service connection** - Verify your email service is connected in the EmailJS dashboard
5. **Template variables** - Ensure template variables match exactly (including double curly braces)

### Common errors

- **"401 Unauthorized"** - Your Public Key is incorrect
- **"404 Not Found"** - Service ID or Template ID is incorrect
- **Email not sending** - Check your email service connection status in EmailJS dashboard

## EmailJS Free Tier Limits

- **200 emails per month** for free accounts
- For more emails, consider upgrading to a paid plan
- Each event generates up to 2 emails (24h + 1h reminders)

## Security Notes

- Your EmailJS credentials are stored in browser localStorage
- Never commit your credentials to version control
- Public Key is safe to expose (it's meant for client-side use)
- Template variables prevent injection attacks
- Always use the official EmailJS SDK

## Notification Behavior

Once configured, the calendar will:
- Send a 24-hour reminder notification before each event
- Send a 1-hour reminder notification before each event
- Check for due notifications on page load
- Check for due notifications every 5 minutes while the page is open
- Prevent duplicate notifications by tracking sent status

## Disabling Notifications

To disable email notifications:
1. Open Settings
2. Clear all three fields (Service ID, Template ID, Public Key)
3. Click Save Settings

The app will continue to work normally, but only browser notifications will be shown (no emails).

## Additional Resources

- [EmailJS Documentation](https://www.emailjs.com/docs/)
- [EmailJS Template Variables](https://www.emailjs.com/docs/user-guide/dynamic-variables/)
- [EmailJS FAQs](https://www.emailjs.com/docs/faq/)

## Support

For EmailJS-specific issues, visit the [EmailJS Support Center](https://www.emailjs.com/docs/faq/).

For calendar app issues, check the main README.md file.
