# Email Notification Setup Guide

This guide explains how to set up email notifications for the Sahaja Krushi system.

## Overview

The notification system sends email alerts to admin users when new farmer queries are submitted. SMS notifications have been disabled as per requirements.

## Required Environment Variables

Create a `.env` file in the backend root directory with the following variables:

```env
# SMTP Email Configuration (Required for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=Sahaja Krushi <your_email@gmail.com>
```

## Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
   - Use this password as `SMTP_PASS`

## Other Email Providers

### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
```

### Yahoo Mail
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
```

### Custom SMTP Server
```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_USER=your_username
SMTP_PASS=your_password
SMTP_FROM=Your App Name <noreply@yourdomain.com>
```

## Testing the Notification System

1. **Set up your environment variables** in `.env`
2. **Run the test script**:
   ```bash
   node test-notification.js
   ```
3. **Check the console output** for SMTP connection status and email delivery results

## How It Works

1. When a farmer submits a query, `notifyAdminsNewQuery()` is called
2. The system fetches all admin users from the database
3. An HTML email is sent to all admin email addresses
4. The email includes:
   - Farmer details (name, ID, contact)
   - Query description
   - Direct link to admin panel
   - Professional styling

## Troubleshooting

### Common Issues

1. **"SMTP configuration missing"**
   - Check that all required environment variables are set
   - Verify the `.env` file is in the correct location

2. **"SMTP verification failed"**
   - Check your SMTP credentials
   - For Gmail, ensure you're using an App Password, not your regular password
   - Verify 2FA is enabled on your Gmail account

3. **"No admin recipients found"**
   - Ensure you have admin users in your database
   - Check that admin users have valid email addresses
   - Verify the user roles are set to 'ADMIN' or 'SUPER_ADMIN'

4. **"Email sent but not received"**
   - Check spam/junk folders
   - Verify the sender email address is not blocked
   - Check if your email provider has delivery restrictions

### Debug Mode

The notification service includes detailed logging. Check your console output for:
- SMTP connection verification
- Email delivery status
- Error messages with specific details

## Security Notes

- Never commit your `.env` file to version control
- Use App Passwords instead of main account passwords
- Consider using a dedicated email account for notifications
- Regularly rotate your SMTP credentials

## SMS Notifications

SMS notifications have been disabled as per requirements. The code is commented out but preserved for future use if needed.

## Support

If you encounter issues:
1. Check the console logs for detailed error messages
2. Verify your SMTP configuration
3. Test with a simple email client first
4. Contact your system administrator for SMTP server issues
