import { BaseEmailTemplate } from "./base-template"

interface PasswordResetProps {
  firstName: string
  resetLink: string
  expiryHours?: number
}

export function PasswordResetTemplate({ firstName, resetLink, expiryHours = 1 }: PasswordResetProps) {
  return (
    <BaseEmailTemplate title="Reset Your Password - QADA.ng">
      <h2 style={{ color: "#003087", marginBottom: "20px" }}>Password Reset Request</h2>

      <p>Hello {firstName},</p>

      <p>
        We received a request to reset your password for your QADA.ng account. Click the button below to create a new
        password:
      </p>

      <div style={{ textAlign: "center", margin: "30px 0" }}>
        <a href={resetLink} className="btn">
          Reset Password
        </a>
      </div>

      <div className="highlight-box">
        <p style={{ margin: "0", fontSize: "14px" }}>
          <strong>Security Notice:</strong> This link will expire in {expiryHours} hour(s) for your security.
        </p>
      </div>

      <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>

      <p>
        For security reasons, if you continue to receive these emails without requesting them, please contact our
        support team immediately at support@qada.ng.
      </p>

      <p style={{ marginTop: "30px" }}>
        Best regards,
        <br />
        QADA.ng Security Team
      </p>
    </BaseEmailTemplate>
  )
}
