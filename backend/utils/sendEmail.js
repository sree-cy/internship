const nodemailer = require("nodemailer");

/**
 * Singleton pooled Nodemailer transporter using Gmail SMTP credentials.
 * Using pool: true keeps open connections alive to eliminate TLS & auth handshakes on every mail.
 */
let pooledTransporter = null;

const getTransporter = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    return null;
  }

  if (!pooledTransporter) {
    const tInit = Date.now();
    pooledTransporter = nodemailer.createTransport({
      service: "gmail",
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      rateDelta: 1000,
      rateLimit: 5,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });
    console.log(`[PERF] [Mailer] Initialized persistent pooled Nodemailer transporter in ${Date.now() - tInit}ms`);
  }

  return pooledTransporter;
};

/**
 * Send Email Verification OTP
 * @param {string} email - Recipient email
 * @param {string} name - Recipient name
 * @param {string} otp - 6-digit OTP code
 */
const sendVerificationEmail = async (email, name, otp) => {
  const recipientName = name || "Candidate";
  const tStart = Date.now();
  const transporter = getTransporter();
  const tTransporter = Date.now();

  const textBody = `Hello ${recipientName},

Your PrepGo verification code is:

${otp}

This OTP is valid for 10 minutes.

Regards,
PrepGo Team`;

  const htmlBody = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 520px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
      <div style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); padding: 32px 24px; text-align: center;">
        <div style="display: inline-block; width: 44px; height: 44px; line-height: 44px; background: rgba(255,255,255,0.2); border-radius: 12px; color: #ffffff; font-weight: 800; font-size: 18px; margin-bottom: 12px;">PG</div>
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">PrepGo Email Verification</h1>
      </div>
      <div style="padding: 32px 28px; color: #1e293b;">
        <p style="font-size: 16px; margin: 0 0 16px 0;">Hello <strong>${recipientName}</strong>,</p>
        <p style="font-size: 15px; color: #475569; margin: 0 0 24px 0; line-height: 1.6;">Thank you for registering on PrepGo. Please enter the following 6-digit verification code to activate your account:</p>
        
        <div style="background: #f0fdf4; border-radius: 12px; padding: 20px; text-align: center; margin: 0 0 24px 0; border: 1.5px dashed #86efac;">
          <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #15803d; font-family: monospace;">${otp}</span>
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
    console.log(`Verification OTP: [6-digit code masked]`);
    console.log("--------------------------------------------------");
    return { success: true, simulated: true, durationMs: Date.now() - tStart };
  }

  try {
    console.log(`[PERF] [sendVerificationEmail] Nodemailer sendMail started for recipient: ${email}`);
    const tSendStart = Date.now();

    const info = await transporter.sendMail({
      from: `"PrepGo" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "PrepGo Email Verification",
      text: textBody,
      html: htmlBody,
    });

    const tSendDuration = Date.now() - tSendStart;
    const tTotalDuration = Date.now() - tStart;
    console.log(`[PERF] [sendVerificationEmail] Nodemailer sendMail completed in ${tSendDuration}ms (Total Mailer: ${tTotalDuration}ms, messageId: ${info.messageId})`);

    return { success: true, messageId: info.messageId, durationMs: tTotalDuration };
  } catch (error) {
    console.error(`[PrepGo Mailer Error] Failed sending verification email to ${email}:`, error.message);
    console.log(`[PrepGo Mailer] OTP for ${email}: [6-digit code generated and stored]`);
    return { success: false, error: error.message, durationMs: Date.now() - tStart };
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
  const tStart = Date.now();
  const transporter = getTransporter();

  const textBody = `Hello ${recipientName},

Your PrepGo password reset code is:

${otp}

This OTP is valid for 10 minutes.

If you did not request a password reset, please ignore this email.

Regards,
PrepGo Team`;

  const htmlBody = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 520px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
      <div style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); padding: 32px 24px; text-align: center;">
        <div style="display: inline-block; width: 44px; height: 44px; line-height: 44px; background: rgba(255,255,255,0.2); border-radius: 12px; color: #ffffff; font-weight: 800; font-size: 18px; margin-bottom: 12px;">PG</div>
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">PrepGo Password Reset</h1>
      </div>
      <div style="padding: 32px 28px; color: #1e293b;">
        <p style="font-size: 16px; margin: 0 0 16px 0;">Hello <strong>${recipientName}</strong>,</p>
        <p style="font-size: 15px; color: #475569; margin: 0 0 24px 0; line-height: 1.6;">We received a request to reset your PrepGo account password. Enter this 6-digit OTP code to proceed:</p>
        
        <div style="background: #f0fdf4; border-radius: 12px; padding: 20px; text-align: center; margin: 0 0 24px 0; border: 1.5px dashed #86efac;">
          <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #15803d; font-family: monospace;">${otp}</span>
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
    console.log(`Reset OTP: [6-digit code masked]`);
    console.log("--------------------------------------------------");
    return { success: true, simulated: true, durationMs: Date.now() - tStart };
  }

  try {
    console.log(`[PERF] [sendPasswordResetEmail] Nodemailer sendMail started for recipient: ${email}`);
    const tSendStart = Date.now();

    const info = await transporter.sendMail({
      from: `"PrepGo" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "PrepGo Password Reset Code",
      text: textBody,
      html: htmlBody,
    });

    const tSendDuration = Date.now() - tSendStart;
    const tTotalDuration = Date.now() - tStart;
    console.log(`[PERF] [sendPasswordResetEmail] Nodemailer sendMail completed in ${tSendDuration}ms (Total Mailer: ${tTotalDuration}ms, messageId: ${info.messageId})`);

    return { success: true, messageId: info.messageId, durationMs: tTotalDuration };
  } catch (error) {
    console.error(`[PrepGo Mailer Error] Failed sending reset email to ${email}:`, error.message);
    console.log(`[PrepGo Mailer] Reset OTP for ${email}: [6-digit code generated and stored]`);
    return { success: false, error: error.message, durationMs: Date.now() - tStart };
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
};
