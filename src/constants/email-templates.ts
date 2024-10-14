export const EMAIL_TEMPLATES = {
  PASSWORD_RESET: ({ name, link }: { name: string; link: string }) => `
      <div>
        <p>Hello <strong>${name}</strong>,</p>
        <p>We received a request to reset your password. Click the link below to reset your password:</p>
        <p>
          <a href="${link}" target="_blank" rel="noopener noreferrer">Reset password</a>
        </p>
        <p>This code will expire in 24 hours.</p>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <p>— nmovies</p>
      </div>
      `,
  EMAIL_VERIFICATION: ({ name, link }: { name: string; link: string }) => `
      <div>
        <p>Hello <strong>${name}</strong>,</p>
        <p>Thank you for signing up with <strong>nmovies</strong>. To complete your registration, please verify your email address:</p>
        <p>
          <a href="${link}" target="_blank" rel="noopener noreferrer">Verify email</a>
        </p>
        <p>This code will expire in 24 hours.</p>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <p>— nmovies</p>
      </div>
      `,
}
