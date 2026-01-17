# Emergency Reporting App

A Node.js application for reporting emergencies, disasters, and hazards with real-time email notifications to the Ministry of Disaster Management.

## Features

- **Emergency Event Submission**: Report earthquakes, floods, hurricanes, wildfires, tsunamis, chemical hazards, and more
- **GPS Location Tracking**: Automatic GPS coordinates or manual entry
- **Image Upload**: Attach photos of the emergency situation (up to 10MB)
- **Email Notifications**: 
  - Automatic notification to Ministry of Disaster Management
  - Confirmation email to the reporter
- **Real-time Reports**: All reports are timestamped and stored
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Security**: CORS enabled, file validation, and error handling

## Requirements

- Node.js (v14 or higher)
- npm (comes with Node.js)

## Installation

1. Extract the application files
2. Navigate to the project directory:
   ```bash
   cd EmApp
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Configure email settings in `.env` file:
   ```
   PORT=3000
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   MINISTRY_EMAIL=ministry@disaster.gov
   ```

   **Note**: For Gmail:
   - Enable "Less secure app access" or use an App Password
   - Create an App Password here: https://myaccount.google.com/apppasswords

## Running the Application

1. Start the server:
   ```bash
   npm start
   ```
   or for development with auto-reload:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Project Structure

```
EmApp/
├── server.js           # Main Express server
├── package.json        # Project dependencies
├── .env                # Environment variables (configure your email here)
├── public/
│   ├── index.html      # Main form interface
│   ├── styles.css      # Form styling
│   └── script.js       # Client-side functionality
├── uploads/            # Uploaded emergency photos (created automatically)
└── reports/            # Stored emergency reports (created automatically)
```

## How to Use

1. **Select Event Type**: Choose the type of emergency from the dropdown
2. **Describe the Event**: Provide detailed description of what's happening
3. **Enter Location**: 
   - Click "Get My Location" to use GPS (requires browser permission)
   - Or manually enter latitude and longitude
4. **Upload Photo**: Attach a photo of the emergency (optional but recommended)
5. **Set Date & Time**: When the emergency occurred
6. **Enter Email**: Your email address for confirmation
7. **Submit**: Click "Submit Emergency Report"

The system will:
- Save your report locally
- Send notification to Ministry of Disaster Management with photo
- Send confirmation email to your address

## Supported Event Types

- Earthquake
- Flood
- Hurricane/Cyclone
- Tornado
- Wildfire
- Landslide
- Tsunami
- Volcanic Eruption
- Chemical/Industrial Hazard
- Major Accident
- Other

## File Upload Specifications

- **Formats**: JPG, PNG, GIF, WebP
- **Maximum Size**: 10MB
- **Photos are attached** to both the ministry and confirmation emails

## Email Configuration

### Using Gmail

1. Enable 2-Step Verification: https://myaccount.google.com/security
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the App Password in the `.env` file as `SMTP_PASS`

### Using Other Email Providers

Update `.env` with your provider's SMTP settings:
- Gmail: smtp.gmail.com:587
- Outlook: smtp-mail.outlook.com:587
- Yahoo: smtp.mail.yahoo.com:587

## Security Notes

- Uploaded files are validated (image files only)
- File size limit prevents server overload
- Email validation is performed
- CORS is configured for local use
- For production, update CORS settings and use HTTPS

## Troubleshooting

### Email Not Sending
- Verify SMTP credentials in `.env`
- Check if SMTP service is working
- Ensure email account allows third-party applications
- Check firewall/network settings

### GPS Not Working
- Ensure HTTPS or localhost (browsers restrict geolocation on HTTP)
- Grant location permission when browser asks
- Check if device has GPS/location enabled

### File Upload Fails
- Check file format (must be an image)
- Ensure file size is under 10MB
- Verify `uploads/` folder permissions

## Support

For issues or questions, check the `.env` configuration file first and ensure all dependencies are installed with `npm install`.

## License

MIT
