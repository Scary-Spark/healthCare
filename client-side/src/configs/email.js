// src/config/email.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Configure transporter using cPanel SMTP credentials
export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "domain.com", // e.g., mail.novalife.com
  port: process.env.EMAIL_PORT || 465,
  secure: true, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER || "noreply@domain.com",
    pass: process.env.EMAIL_PASS || "email-password",
  },
});

// Function to send OTP
export const sendOTPEmail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: `"NovaLife Medical Center" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email - NovaLife",
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Email Verification - NovaLife</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: Arial, Helvetica, sans-serif;">
  
  <!-- Outer Container -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f6f8; padding: 20px;">
    <tr>
      <td align="center">
        
        <!-- Email Card -->
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0"
               style="background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td align="center" style="background: linear-gradient(135deg, #0c6e5f, #0a8f7a); padding: 25px;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">
                NovaLife Medical Center
              </h1>
              <p style="color: #e0f2ef; margin: 5px 0 0; font-size: 14px;">
                Compassion • Innovation • Excellence
              </p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 30px;">
              <h2 style="color: #0c6e5f; margin-top: 0;">Verify Your Email</h2>
              
              <p style="color: #555; font-size: 16px; line-height: 1.6;">
                Hello,
              </p>
              
              <p style="color: #555; font-size: 16px; line-height: 1.6;">
                Thank you for registering with <strong>NovaLife Medical Center</strong>.
                Please use the verification code below to complete your registration.
              </p>

              <!-- OTP Box -->
              <div style="text-align: center; margin: 30px 0;">
                <span style="
                  display: inline-block;
                  font-size: 32px;
                  font-weight: bold;
                  letter-spacing: 8px;
                  color: #0c6e5f;
                  background: #f0f7f6;
                  padding: 15px 30px;
                  border-radius: 10px;
                  border: 2px dashed #0c6e5f;">
                  ${otp}
                </span>
              </div>

              <p style="color: #555; font-size: 15px;">
                This code is valid for <strong>15 minutes</strong>. Do not share it with anyone for security reasons.
              </p>

              <p style="color: #555; font-size: 15px;">
                If you did not request this email, please ignore it.
              </p>

              <p style="color: #555; font-size: 15px; margin-top: 30px;">
                Regards,<br>
                <strong>NovaLife Team</strong>
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td>
              <hr style="border: none; border-top: 1px solid #eeeeee;">
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 20px; font-size: 12px; color: #888;">
              <p style="margin: 0;">
                © ${new Date().getFullYear()} NovaLife Medical Center. All rights reserved.
              </p>
              <p style="margin: 5px 0 0;">
                This is an automated message. Please do not reply.
              </p>
            </td>
          </tr>

        </table>
        <!-- End Email Card -->

      </td>
    </tr>
  </table>

</body>
</html>
`,
    });
    return { success: true };
  } catch (error) {
    console.error("Email error:", error);
    return { success: false, error: error.message };
  }
};
