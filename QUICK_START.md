# Quick Start Guide

## ⚡ Get Started in 5 Minutes

### Step 1: Unzip the Application
Extract `EmApp-Release.zip` to your desired location.

### Step 2: Install Dependencies (Windows)
Double-click **`install.bat`**

Wait for the command window to complete. This will:
- Install Node.js (if needed)
- Install all required npm packages
- Press any key to close when done

### Step 3: Configure Email
1. Open the **`.env`** file with Notepad
2. Update these lines with your email:
   ```
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   MINISTRY_EMAIL=ministry@disaster.gov
   ```
3. Save the file

**📧 Using Gmail?**
- Go to https://myaccount.google.com/apppasswords
- Generate an app password
- Paste it in SMTP_PASS field

**📧 Using other email?**
See `CONFIG_GUIDE.md` for setup instructions

### Step 4: Start the App
Double-click **`start.bat`**

You should see:
```
Emergency Reporting App running on port 3000
```

### Step 5: Open in Browser
Go to: **http://localhost:3000**

You're ready to use the app! 🎉

---

## 📋 Using the Application

1. **Select Event Type** - Choose from dropdown (Earthquake, Flood, Hurricane, etc.)
2. **Describe Event** - Type details about what's happening
3. **Add Location** - Click "Get My Location" or enter coordinates manually
4. **Upload Photo** - (Optional) Add a photo of the emergency
5. **Set Date & Time** - When the emergency occurred
6. **Enter Email** - Your email address
7. **Submit** - Click the button to send report

The system will:
- ✅ Send notification to Ministry of Disaster Management
- ✅ Send confirmation email to you
- ✅ Save report records locally

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't start app | Run `install.bat` first |
| Email not sending | Check `.env` file has correct credentials |
| Can't find location | Make sure to grant browser permission |
| Port 3000 in use | Change PORT in `.env` to 3001 |
| App won't open | Check terminal for error messages |

---

## 📚 More Information

- **Full Setup Instructions**: See `SETUP_INSTRUCTIONS.md`
- **Email Configuration**: See `CONFIG_GUIDE.md`
- **Features & Usage**: See `README.md`

---

## 💡 Tips

- Save this guide for reference
- Keep the `.env` file secure (contains email credentials)
- Test with a sample report before live use
- Check spam folder if confirmation email doesn't arrive
- Update MINISTRY_EMAIL to actual ministry address

---

## For Mac/Linux Users

Replace step 2 & 4 with:

**Install Dependencies:**
```bash
npm install
```

**Start the App:**
```bash
npm start
```

Then go to http://localhost:3000

---

Ready? Let's report emergencies and keep people safe! 🚨
