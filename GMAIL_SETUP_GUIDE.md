# Gmail Setup Guide for Email Notifications

## 🚨 Current Issue
Your Gmail account is rejecting the login credentials. This is a common issue that can be fixed by setting up proper authentication.

## 📋 Step-by-Step Solution

### Option 1: Gmail App Password (Recommended)

#### Step 1: Enable 2-Factor Authentication
1. Go to [Google Account](https://myaccount.google.com/)
2. Click **Security** in the left sidebar
3. Under "Signing in to Google", click **2-Step Verification**
4. Click **Get started** and follow the setup process
5. You'll need to verify with your phone number

#### Step 2: Generate App Password
1. After enabling 2FA, go back to **Security**
2. Under "2-Step Verification", you'll now see **App passwords**
3. Click **App passwords**
4. You might need to sign in again
5. Select **Mail** from the dropdown
6. Select **Other (Custom name)** and type "Sahaja Krushi"
7. Click **Generate**
8. **IMPORTANT**: Copy the 16-character password (format: `abcd efgh ijkl mnop`)
9. Click **Done**

#### Step 3: Update Your .env File
Replace your current password with the App Password:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=prajjugowda997@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
SMTP_FROM=Sahaja Krushi <prajjugowda997@gmail.com>
```

### Option 2: Alternative Email Providers

If Gmail continues to give issues, try these alternatives:

#### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your_email@outlook.com
SMTP_PASS=your_outlook_password
```

#### Yahoo Mail
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=your_email@yahoo.com
SMTP_PASS=your_yahoo_app_password
```

## 🔍 Troubleshooting

### If App Password doesn't work:
1. **Wait 5-10 minutes** after creating the App Password
2. **Remove spaces** from the App Password in your .env file
3. **Double-check** the email address is correct
4. **Try port 465** instead of 587:
   ```env
   SMTP_PORT=465
   ```

### If you can't enable 2FA:
1. **Use "Less secure app access"** (not recommended for security):
   - Go to [Less secure app access](https://myaccount.google.com/lesssecureapps)
   - Turn it ON
   - Use your regular Gmail password

### Common Error Messages:
- **"Username and Password not accepted"** → Use App Password
- **"Please log in via your web browser"** → Enable 2FA first
- **"This app is blocked"** → Check "Less secure app access"

## 🧪 Testing

After updating your .env file, run:
```bash
node email-diagnostic.js
```

You should see:
- ✅ SMTP connection verified successfully
- ✅ Test email sent successfully

## 📧 What to Expect

Once working, you'll receive:
- **Test email** from the diagnostic tool
- **Notification emails** when farmers submit queries
- **Professional HTML emails** with query details

## 🆘 Still Having Issues?

1. **Check spam folder** - emails might be there
2. **Try a different email provider** (Outlook, Yahoo)
3. **Contact your IT admin** if using corporate email
4. **Check firewall settings** - some networks block SMTP

## 🔒 Security Notes

- **Never share** your App Password
- **Use App Passwords** instead of your main password
- **Regularly rotate** your App Passwords
- **Keep 2FA enabled** for security
