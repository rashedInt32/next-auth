export const emailBody = (resetUrl: string) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2>Reset Your Password</h2>
    <p>Hi there,</p>
    <p>You requested to reset your password. Click the button below:</p>
    <a href="${resetUrl}" target="_blank" 
       style="background: #007cba; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0;">
      Reset Password
    </a>
    <p><strong>This link expires in 1 hour.</strong></p>
    <p>If you didn't request this, please ignore this email.</p>
  </div>
`;
