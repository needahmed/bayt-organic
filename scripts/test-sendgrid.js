// Load environment variables
require('dotenv').config();

const sgMail = require('@sendgrid/mail');

// Initialize SendGrid with API key
if (!process.env.SENDGRID_API_KEY) {
  console.error('SENDGRID_API_KEY is not set in environment variables');
  process.exit(1);
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const fromEmail = process.env.EMAIL_FROM || 'support@baytorganic.com';
const from = `Bayt Organic <${fromEmail}>`;
const to = process.env.TEST_EMAIL || fromEmail; // Use the EMAIL_FROM as a fallback test recipient

console.log('Sending test email from:', from);
console.log('Sending test email to:', to);

const msg = {
  to,
  from,
  subject: 'SendGrid Test Email from Bayt Organic',
  text: 'This is a test email to verify that SendGrid is properly configured.',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #4caf50; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Bayt Organic</h1>
      </div>
      <div style="padding: 20px; border: 1px solid #eee;">
        <h2>Test Email</h2>
        <p>This is a test email to verify that SendGrid is properly configured.</p>
        <p>If you're seeing this, the configuration appears to be working!</p>
      </div>
    </div>
  `,
};

sgMail
  .send(msg)
  .then((response) => {
    console.log('Email sent successfully!');
    console.log('Response:', response);
  })
  .catch((error) => {
    console.error('Error sending email:');
    console.error(error);
    
    if (error.response) {
      console.error('Error response body:');
      console.error(error.response.body);
    }
  }); 