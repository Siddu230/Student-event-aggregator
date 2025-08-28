import { http } from '@google-cloud/functions-framework';
import nodemailer from 'nodemailer';

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'siddusanapala5@gmail.com',
    pass: process.env.EMAIL_PASS || 'nuvv oabd mago bqeh'
  }
});

http('sendEmail', async (req, res) => {
  // Set CORS headers
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {
    const { userEmail, userName, eventTitle, eventDate, eventLocation } = req.body;

    // Always send to the specified email address
    const mailOptions = {
      from: process.env.EMAIL_USER || 'campusevents@gmail.com',
      to: 'naidunani1122.11@gmail.com', // Fixed recipient
      subject: `🎉 New Event Registration - ${eventTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 15px; text-align: center; margin-bottom: 20px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎉 New Event Registration</h1>
            <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">CampusEvents Platform</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #1a202c; margin-bottom: 20px;">📋 Registration Details</h2>
            
            <div style="background: #f7fafc; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
              <h3 style="color: #2d3748; margin: 0 0 15px 0;">👤 Student Information</h3>
              <p style="margin: 8px 0; color: #4a5568; font-size: 16px;"><strong>Name:</strong> ${userName}</p>
              <p style="margin: 8px 0; color: #4a5568; font-size: 16px;"><strong>Email:</strong> ${userEmail}</p>
            </div>
            
            <div style="background: #edf2f7; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
              <h3 style="color: #2d3748; margin: 0 0 15px 0;">📅 Event Information</h3>
              <p style="margin: 8px 0; color: #4a5568; font-size: 16px;"><strong>Event Name:</strong> ${eventTitle}</p>
              <p style="margin: 8px 0; color: #4a5568; font-size: 16px;"><strong>Date & Time:</strong> ${new Date(eventDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })}</p>
              <p style="margin: 8px 0; color: #4a5568; font-size: 16px;"><strong>Location:</strong> ${eventLocation}</p>
            </div>
            
            <div style="background: #e6fffa; padding: 20px; border-radius: 10px; border-left: 4px solid #38b2ac;">
              <h3 style="color: #2d3748; margin: 0 0 10px 0;">✅ Registration Status</h3>
              <p style="color: #4a5568; margin: 0; font-size: 16px;">Student successfully registered for this event</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <p style="color: #718096; font-size: 14px; margin: 0;">
                📧 This notification was sent from CampusEvents<br>
                🕒 Registration Time: ${new Date().toLocaleString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                })}
              </p>
            </div>
          </div>
        </div>
      `
    };

    console.log('Attempting to send email to:', mailOptions.to);
    console.log('Email data:', { userEmail, userName, eventTitle, eventDate, eventLocation });

    await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully');
    res.status(200).json({ 
      success: true, 
      message: 'Registration email sent successfully',
      recipient: 'naidunani1122.11@gmail.com'
    });
    
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      details: 'Failed to send registration notification email'
    });
  }
});