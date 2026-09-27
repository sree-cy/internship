const nodemailer = require("nodemailer");

/**
 * Creates Nodemailer transporter using Gmail SMTP credentials from environment variables.
 */
const createTransporter = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  
  console.log("EMAIL_USER:", emailUser);
  console.log("EMAIL_PASS:", emailPass ? "Loaded" : "Not Loaded");
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded" : "Not Loaded");

  if (!emailUser || !emailPass) {
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });
};

/**
 * Send Email Verification OTP
 * @param {string} email - Recipient email
 * @param {string} name - Recipient name
 * @param {string} otp - 6-digit OTP code
 */
const sendVerificationEmail = async (email, name, otp) => {
  const recipientName = name || "Candidate";
  const transporter = createTransporter();

  const textBody = `Hello ${recipientName},

Your PrepGo verification code is:

${otp}

This OTP is valid for 10 minutes.

Regards,
PrepGo Team`;

  const htmlBody = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 520px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
      <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 32px 24px; text-align: center;">
        <div style="display: inline-block; width: 44px; height: 44px; line-height: 44px; background: rgba(255,255,255,0.2); border-radius: 12px; color: #ffffff; font-weight: 800; font-size: 18px; margin-bottom: 12px;">PG</div>
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">PrepGo Email Verification</h1>
      </div>
      <div style="padding: 32px 28px; color: #1e293b;">
        <p style="font-size: 16px; margin: 0 0 16px 0;">Hello <strong>${recipientName}</strong>,</p>
        <p style="font-size: 15px; color: #475569; margin: 0 0 24px 0; line-height: 1.6;">Thank you for registering on PrepGo. Please enter the following 6-digit verification code to activate your account:</p>
        
        <div style="background: #f1f5f9; border-radius: 12px; padding: 20px; text-align: center; margin: 0 0 24px 0; border: 1px dashed #cbd5e1;">
          <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #4f46e5; font-family: monospace;">${otp}</span>
        </div>

        <p style="font-size: 13px; color: #64748b; margin: 0 0 24px 0;">This OTP is valid for <strong>10 minutes</strong>. For your security, do not share this code with anyone.</p>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="font-size: 14px; color: #334155; margin: 0;">Regards,<br><strong>PrepGo Team</strong></p>
      </div>
    </div>
  `;

  if (!transporter) {
    console.log("--------------------------------------------------");
    console.log(`[PrepGo Mailer - Dev/Local Mode] (EMAIL_USER / EMAIL_PASS not set)`);
    console.log(`To: ${email} (${recipientName})`);
    console.log(`Subject: PrepGo Email Verification`);
    console.log(`Verification OTP: ${otp}`);
    console.log("--------------------------------------------------");
    return { success: true, simulated: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"PrepGo" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "PrepGo Email Verification",
      text: textBody,
      html: htmlBody,
    });
    console.log(`[PrepGo Mailer] Verification OTP sent to ${email}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[PrepGo Mailer Error] Failed sending verification email to ${email}:`, error.message);
    // Log OTP fallback so verification is not blocked
    console.log(`[PrepGo Mailer Fallback] OTP for ${email}: ${otp}`);
    return { success: false, error: error.message };
  }
};

/**
 * Send Password Reset OTP
 * @param {string} email - Recipient email
 * @param {string} name - Recipient name
 * @param {string} otp - 6-digit OTP code
 */
const sendPasswordResetEmail = async (email, name, otp) => {
  const recipientName = name || "User";
  const transporter = createTransporter();

  const textBody = `Hello ${recipientName},

Your PrepGo password reset code is:

${otp}

This OTP is valid for 10 minutes.

If you did not request a password reset, please ignore this email.

Regards,
PrepGo Team`;

  const htmlBody = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 520px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
      <div style="background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%); padding: 32px 24px; text-align: center;">
        <div style="display: inline-block; width: 44px; height: 44px; line-height: 44px; background: rgba(255,255,255,0.2); border-radius: 12px; color: #ffffff; font-weight: 800; font-size: 18px; margin-bottom: 12px;">PG</div>
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">PrepGo Password Reset</h1>
      </div>
      <div style="padding: 32px 28px; color: #1e293b;">
        <p style="font-size: 16px; margin: 0 0 16px 0;">Hello <strong>${recipientName}</strong>,</p>
        <p style="font-size: 15px; color: #475569; margin: 0 0 24px 0; line-height: 1.6;">We received a request to reset your PrepGo account password. Enter this 6-digit OTP code to proceed:</p>
        
        <div style="background: #f1f5f9; border-radius: 12px; padding: 20px; text-align: center; margin: 0 0 24px 0; border: 1px dashed #cbd5e1;">
          <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #0284c7; font-family: monospace;">${otp}</span>
        </div>

        <p style="font-size: 13px; color: #64748b; margin: 0 0 24px 0;">This OTP is valid for <strong>10 minutes</strong>. If you did not request a password reset, you can safely ignore this message.</p>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="font-size: 14px; color: #334155; margin: 0;">Regards,<br><strong>PrepGo Team</strong></p>
      </div>
    </div>
  `;

  if (!transporter) {
    console.log("--------------------------------------------------");
    console.log(`[PrepGo Mailer - Dev/Local Mode] (EMAIL_USER / EMAIL_PASS not set)`);
    console.log(`To: ${email} (${recipientName})`);
    console.log(`Subject: PrepGo Password Reset Code`);
    console.log(`Reset OTP: ${otp}`);
    console.log("--------------------------------------------------");
    return { success: true, simulated: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"PrepGo" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "PrepGo Password Reset Code",
      text: textBody,
      html: htmlBody,
    });
    console.log(`[PrepGo Mailer] Password reset OTP sent to ${email}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[PrepGo Mailer Error] Failed sending reset email to ${email}:`, error.message);
    // Log OTP fallback so testing is not blocked
    console.log(`[PrepGo Mailer Fallback] Reset OTP for ${email}: ${otp}`);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
};
