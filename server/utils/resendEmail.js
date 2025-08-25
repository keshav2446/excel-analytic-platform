const { Resend } = require('resend');

// Initialize Resend with API key (will be set when functions are called)
let resend;

const sendVerificationEmail = async (to, verificationToken) => {
  try {
    // Initialize Resend if not already done
    if (!resend) {
      resend = new Resend(process.env.RESEND_API_KEY);
    }
    
    const verificationUrl = `${process.env.BACKEND_URL || 'http://localhost:5001'}/api/auth/verify?token=${verificationToken}`;
    
    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: to,
      subject: 'Verify Your Email - Excel Analytics Platform',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: #333; margin-bottom: 20px;">Welcome to Excel Analytics Platform!</h1>
            <p style="color: #666; font-size: 16px; margin-bottom: 30px;">
              Thank you for registering. Please verify your email address to complete your account setup.
            </p>
            <a href="${verificationUrl}" 
               style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Verify Email Address
            </a>
            <p style="color: #999; font-size: 14px; margin-top: 30px;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${verificationUrl}" style="color: #007bff;">${verificationUrl}</a>
            </p>
            <p style="color: #999; font-size: 12px; margin-top: 20px;">
              This link will expire in 24 hours for security reasons.
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Resend API Error:', error);
      throw new Error('Failed to send verification email');
    }

    console.log('Verification email sent successfully:', data.id);
    return data;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

const sendWelcomeEmail = async (to, firstName) => {
  try {
    // Initialize Resend if not already done
    if (!resend) {
      resend = new Resend(process.env.RESEND_API_KEY);
    }
    
    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: to,
      subject: 'Welcome to Excel Analytics Platform!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
            <h1 style="color: #333; margin-bottom: 20px;">Welcome ${firstName}!</h1>
            <p style="color: #666; font-size: 16px; margin-bottom: 20px;">
              Your email has been successfully verified. You can now access all features of the Excel Analytics Platform.
            </p>
            <div style="background-color: #e9ecef; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #333; margin-bottom: 15px;">What you can do now:</h3>
              <ul style="color: #666; padding-left: 20px;">
                <li>Upload and analyze Excel files</li>
                <li>Create interactive data visualizations</li>
                <li>Generate comprehensive reports</li>
                <li>Share insights with your team</li>
              </ul>
            </div>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" 
               style="background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Go to Dashboard
            </a>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Resend API Error:', error);
      throw new Error('Failed to send welcome email');
    }

    console.log('Welcome email sent successfully:', data.id);
    return data;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};

const sendPasswordResetEmail = async (to, resetToken) => {
  try {
    // Initialize Resend if not already done
    if (!resend) {
      resend = new Resend(process.env.RESEND_API_KEY);
    }
    
    const resetUrl = `${process.env.BACKEND_URL || 'http://localhost:5001'}/api/auth/reset-password?token=${resetToken}`;
    
    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: to,
      subject: 'Password Reset - Excel Analytics Platform',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: #333; margin-bottom: 20px;">Password Reset Request</h1>
            <p style="color: #666; font-size: 16px; margin-bottom: 30px;">
              You requested a password reset for your Excel Analytics Platform account.
            </p>
            <a href="${resetUrl}" 
               style="background-color: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Reset Password
            </a>
            <p style="color: #999; font-size: 14px; margin-top: 30px;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${resetUrl}" style="color: #dc3545;">${resetUrl}</a>
            </p>
            <p style="color: #999; font-size: 12px; margin-top: 20px;">
              This link will expire in 1 hour for security reasons.<br>
              If you didn't request this reset, please ignore this email.
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Resend API Error:', error);
      throw new Error('Failed to send password reset email');
    }

    console.log('Password reset email sent successfully:', data.id);
    return data;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail
};
