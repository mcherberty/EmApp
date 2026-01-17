# Configuration Guide for Emergency Reporting App

## .env File Configuration

The `.env` file contains all configuration settings for the application. Update these settings according to your setup.

### Basic Settings

```
# Server Configuration
PORT=3000                          # Port on which the application runs
```

### Email Configuration

```
# SMTP Server Settings (for sending emails)
SMTP_HOST=smtp.gmail.com          # SMTP server address
SMTP_PORT=587                      # SMTP port (usually 587 for TLS, 465 for SSL)
SMTP_USER=your-email@gmail.com    # Your email address (sender)
SMTP_PASS=xxxx xxxx xxxx xxxx     # App password or email password

# Ministry Configuration
MINISTRY_EMAIL=ministry@disaster.gov  # Email address of Ministry of Disaster Management
```

## Email Provider Setup Instructions

### ✅ Gmail (Recommended)

**Step 1: Enable 2-Step Verification**
1. Go to https://myaccount.google.com/security
2. Click on "2-Step Verification"
3. Follow the instructions to enable it

**Step 2: Create App Password**
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Windows Computer" (or your device type)
3. Click "Generate"
4. Copy the 16-character password generated

**Step 3: Update .env**
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx
```

**Troubleshooting Gmail:**
- If still not working, enable "Less secure app access": https://myaccount.google.com/lesssecureapps
- Make sure you're using the App Password, not your regular Google password
- Wait 15-30 seconds after generating App Password before using it

---

### Outlook / Hotmail

**Step 1: Get Your Account Ready**
1. Login to your Outlook/Hotmail account
2. Enable 2-factor authentication (recommended)

**Step 2: Create App Password**
1. Go to https://account.microsoft.com/security-info
2. Add an app password
3. Copy the password

**Step 3: Update .env**
```
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-app-password
```

---

### Yahoo Mail

**Step 1: Generate App Password**
1. Go to https://login.yahoo.com
2. Account Security → Generate app password
3. Select "Mail" and "Windows Computer"
4. Copy the generated password

**Step 2: Update .env**
```
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password
```

---

### ProtonMail

**Step 1: Configure SMTP/IMAP**
1. Go to https://account.proton.me/security/bridges
2. Download ProtonMail Bridge
3. Setup credentials for SMTP

**Step 2: Update .env**
```
SMTP_HOST=127.0.0.1
SMTP_PORT=1025
SMTP_USER=your-email@proton.me
SMTP_PASS=your-bridge-password
```

---

### SendGrid (Recommended for Production)

**Step 1: Create SendGrid Account**
1. Sign up at https://sendgrid.com/
2. Create an API key

**Step 2: Update .env**
```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.xxxxxxxxx...
```

---

## Ministry Email Configuration

Replace the default ministry email with your actual ministry address:

```env
MINISTRY_EMAIL=official-ministry@government.gov
```

## Verification

To verify your email configuration is working:

1. Start the app: `npm start`
2. Look for this message in the console:
   ```
   Email service ready
   ```
   This means the email service is configured correctly.

3. Submit a test report through the web form
4. Check your email for:
   - **Confirmation email**: Should arrive at your email address
   - **Ministry notification**: Check the MINISTRY_EMAIL inbox

## Common Email Issues

| Issue | Solution |
|-------|----------|
| "Invalid login" error | Check SMTP_USER and SMTP_PASS are correct |
| "Connection timeout" | Verify SMTP_HOST and SMTP_PORT are correct |
| Emails not arriving | Check spam folder, verify recipient email is correct |
| "Authentication failed" | For Gmail, use App Password not regular password |
| Port 587 blocked | Try port 465 with SMTP protocol TLS/SSL |

## Production Recommendations

For production environments:

1. **Use a dedicated email service** (SendGrid, AWS SES, Mailgun)
2. **Store credentials securely** (use secret management services)
3. **Enable email logging** (to track delivery)
4. **Set up email templates** (for better formatting)
5. **Use authenticated domain** (SPF, DKIM, DMARC records)
6. **Enable TLS/SSL** (for secure transmission)

## Resetting Configuration

If you want to reset to default settings:

1. Delete the `.env` file
2. The application will prompt you to configure it
3. Or manually create a new `.env` with default values

## Security Tips

🔒 **Important Security Practices:**

- Never share your `.env` file
- Don't commit `.env` to version control
- Use different passwords for different environments
- Rotate credentials regularly
- Use app-specific passwords when available
- Enable 2-factor authentication on email accounts
- Monitor email sending logs for suspicious activity

---

**Need Help?**
- Check SETUP_INSTRUCTIONS.md for step-by-step setup
- Review README.md for application features
- Check your email provider's SMTP settings documentation
