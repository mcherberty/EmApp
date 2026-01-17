require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only image files are allowed.'));
    }
  }
});

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Verify email connection
transporter.verify((error, success) => {
  if (error) {
    console.log('Email configuration error:', error);
  } else {
    console.log('Email service ready');
  }
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Success page route
app.get('/success', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'success.html'));
});

// Dashboard route
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Submit emergency report
app.post('/api/submit-report', upload.single('picture'), async (req, res) => {
  try {
    const {
      description,
      latitude,
      longitude,
      datetime,
      email,
      eventType
    } = req.body;

    // Validate required fields
    if (!description || !latitude || !longitude || !datetime || !email || !eventType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get file path if picture was uploaded
    // Store relative path that can be accessed via HTTP
    const pictureFilename = req.file ? req.file.filename : null;
    const picturePath = req.file ? `/uploads/${req.file.filename}` : null;

    // Create report object
    const report = {
      eventType,
      description,
      location: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      },
      datetime,
      reporterEmail: email,
      picture: picturePath,
      submittedAt: new Date().toISOString()
    };

    // Save report to file (optional - for record keeping)
    const reportsDir = path.join(__dirname, 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    const reportFile = path.join(reportsDir, `report-${Date.now()}.json`);
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));

    // Send emails
    const ministryEmail = process.env.MINISTRY_EMAIL;
    
    // Email to ministry
    const ministryEmailContent = `
      <h2>Emergency Report Submitted</h2>
      <p><strong>Event Type:</strong> ${eventType}</p>
      <p><strong>Description:</strong> ${description}</p>
      <p><strong>Location (GPS):</strong></p>
      <ul>
        <li>Latitude: ${latitude}</li>
        <li>Longitude: ${longitude}</li>
      </ul>
      <p><strong>Date & Time:</strong> ${datetime}</p>
      <p><strong>Reporter Email:</strong> ${email}</p>
      <p><strong>Submitted At:</strong> ${new Date().toISOString()}</p>
      <hr>
      <p>View location on map: <a href="https://www.google.com/maps?q=${latitude},${longitude}">Google Maps</a></p>
    `;

    const ministryMailOptions = {
      from: process.env.SMTP_USER,
      to: ministryEmail,
      subject: `Emergency Report: ${eventType}`,
      html: ministryEmailContent,
      attachments: req.file ? [{
        filename: req.file.filename,
        path: req.file.path
      }] : []
    };

    // Email to reporter
    const reporterEmailContent = `
      <h2>Your Emergency Report Has Been Submitted</h2>
      <p>Thank you for reporting this emergency. Your report has been received and submitted to the Ministry of Disaster Management.</p>
      <p><strong>Report Details:</strong></p>
      <ul>
        <li><strong>Event Type:</strong> ${eventType}</li>
        <li><strong>Description:</strong> ${description}</li>
        <li><strong>Location (GPS):</strong> ${latitude}, ${longitude}</li>
        <li><strong>Date & Time:</strong> ${datetime}</li>
        <li><strong>Submitted At:</strong> ${new Date().toISOString()}</li>
      </ul>
      <p>You will receive further updates regarding this emergency report.</p>
      <p>Thank you for your vigilance and quick reporting.</p>
    `;

    const reporterMailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: `Emergency Report Confirmation - ${eventType}`,
      html: reporterEmailContent
    };

    // Send both emails (don't block if email fails)
    Promise.all([
      transporter.sendMail(ministryMailOptions).catch(err => {
        console.error('Ministry email failed:', err);
      }),
      transporter.sendMail(reporterMailOptions).catch(err => {
        console.error('Reporter email failed:', err);
      })
    ]).catch(err => {
      console.error('Email sending error:', err);
    });

    res.json({
      success: true,
      message: 'Report submitted successfully. Confirmation email sent to your email address.',
      reportId: reportFile
    });

  } catch (error) {
    console.error('Error submitting report:', error);
    res.status(500).json({
      error: 'Failed to submit report',
      details: error.message
    });
  }
});

// Get current location
app.post('/api/get-location', (req, res) => {
  // This endpoint can be used to log location requests
  res.json({ success: true, message: 'Location endpoint ready' });
});

// Get all reports (for ministry dashboard)
app.get('/api/reports', (req, res) => {
  try {
    const reportsDir = path.join(__dirname, 'reports');
    
    if (!fs.existsSync(reportsDir)) {
      return res.json({ success: true, reports: [] });
    }
    
    const files = fs.readdirSync(reportsDir);
    const reports = [];
    
    files.forEach(file => {
      if (file.endsWith('.json')) {
        try {
          const filePath = path.join(reportsDir, file);
          const content = fs.readFileSync(filePath, 'utf8');
          const report = JSON.parse(content);
          report.id = file.replace('.json', '').replace('report-', '');
          reports.push(report);
        } catch (err) {
          console.error(`Error reading report file ${file}:`, err);
        }
      }
    });
    
    // Sort by most recent first
    reports.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    
    res.json({ success: true, reports });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Failed to fetch reports', details: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
  }
  res.status(500).json({ error: 'An error occurred', details: err.message });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Emergency Reporting App running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser`);
});
