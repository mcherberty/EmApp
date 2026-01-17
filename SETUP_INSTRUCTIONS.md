# Emergency Reporting App - Setup Instructions

## Quick Start

### For Windows Users

1. **Run the Installation Script**
   - Double-click `install.bat` in the application folder
   - This will install Node.js and all dependencies automatically

2. **Configure Email Settings**
   - Open the `.env` file with a text editor
   - Update the following settings:
     ```
     SMTP_USER=your-email@gmail.com
     SMTP_PASS=your-app-password
     MINISTRY_EMAIL=ministry@disaster.gov
     ```

3. **Start the Application**
   - Double-click `start.bat`
   - The server will start on `http://localhost:3000`

### For Mac/Linux Users

1. **Install Node.js** (if not already installed)
   ```bash
   # Using Homebrew (Mac)
   brew install node

   # Or download from https://nodejs.org/
   ```

2. **Navigate to Project Directory**
   ```bash
   cd EmApp
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Configure Email Settings**
   - Edit the `.env` file:
   ```bash
   nano .env
   ```
   - Update SMTP settings (see Email Configuration below)

5. **Start the Application**
   ```bash
   npm start
   ```

## Email Configuration Guide

### Using Gmail (Recommended)

1. **Enable 2-Step Verification**
   - Go to https://myaccount.google.com/security
   - Sign in and navigate to "2-Step Verification"
   - Follow the prompts to enable it

2. **Generate App Password**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer" (or your device)
   - Google will generate a 16-character password
   - Copy this password

3. **Update `.env` File**
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=xxxx xxxx xxxx xxxx
   MINISTRY_EMAIL=ministry@disaster.gov
   ```

### Using Other Email Providers

Update the SMTP settings based on your provider:

**Outlook/Hotmail:**
```
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

**Yahoo Mail:**
```
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-password
```

**Custom SMTP Server:**
```
SMTP_HOST=smtp.yourdomain.com
SMTP_PORT=587
SMTP_USER=your-username
SMTP_PASS=your-password
```

## Verify Installation

1. **Check Node.js is installed**
   ```bash
   node --version
   npm --version
   ```

2. **Start the server**
   ```bash
   npm start
   ```

3. **You should see:**
   ```
   Email service ready
   Emergency Reporting App running on port 3000
   Open http://localhost:3000 in your browser
   ```

4. **Open your browser**
   - Navigate to: http://localhost:3000
   - You should see the Emergency Reporting Form

## Troubleshooting

### Issue: "npm: command not found"
**Solution:** Node.js is not installed or not in PATH
- Install from https://nodejs.org/
- Restart terminal/command prompt after installation
- Verify with `node --version`

### Issue: Email not sending
**Steps to diagnose:**
1. Check `.env` file has correct email credentials
2. Verify SMTP_USER and SMTP_PASS are correct
3. For Gmail, ensure App Password is used (not regular password)
4. Check if "Less secure apps" is enabled (Gmail)
5. Verify firewall doesn't block port 587

**Test email configuration:**
```bash
# Add temporary logging to server.js to see detailed errors
```

### Issue: "Cannot find module 'express'"
**Solution:** Dependencies not installed
```bash
npm install
```

### Issue: Port 3000 already in use
**Option 1:** Change port in `.env`
```
PORT=3001
```

**Option 2:** Kill the process using port 3000
```bash
# Mac/Linux
lsof -i :3000
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Issue: GPS not working in browser
- Ensure page is loaded from localhost or HTTPS (not HTTP)
- Grant location permission when browser asks
- Verify device has location services enabled

### Issue: File upload fails
- Ensure file is an image (JPG, PNG, GIF, WebP)
- Check file size is under 10MB
- Verify `uploads/` folder has write permissions

## File Locations

After running the app, the following folders will be created:

- **uploads/** - Stores uploaded emergency photos
- **reports/** - Stores JSON records of all submitted reports

## Important Security Notes

1. **Never commit .env to version control** - It contains sensitive credentials
2. **Use HTTPS in production** - For real-world deployment
3. **Change the MINISTRY_EMAIL** - Update to actual ministry email address
4. **Rotate credentials regularly** - Change SMTP passwords periodically
5. **Backup reports** - The reports/ folder contains important emergency data

## Deployment to Production

For production deployment:

1. Use a proper email service (SendGrid, AWS SES, etc.)
2. Set up HTTPS/SSL certificates
3. Use environment variables from secure configuration services
4. Deploy to cloud platform (Heroku, AWS, Azure, etc.)
5. Set up database for better report management
6. Implement authentication if needed

## Support & Troubleshooting

If you encounter issues:

1. Check the README.md file for detailed feature information
2. Verify all entries in the .env file are correct
3. Check browser console (F12) for JavaScript errors
4. Check terminal/command prompt for server errors
5. Ensure all dependencies installed: `npm install`

## Testing the Application

1. **Fill out the form:**
   - Event Type: Select any option
   - Description: "Test emergency report"
   - GPS: Click "Get My Location" or enter coordinates
   - Photo: Optional (any image file)
   - Date/Time: Current date/time
   - Email: Your email address

2. **Check results:**
   - Should see success message on form
   - Check your email for confirmation
   - Ministry email should receive notification
   - Check `reports/` folder for saved report

## Next Steps

1. Test the application thoroughly
2. Update MINISTRY_EMAIL to actual ministry address
3. Train users on form usage
4. Set up backup and monitoring
5. Deploy to production when ready
