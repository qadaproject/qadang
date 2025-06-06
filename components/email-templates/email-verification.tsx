import { BaseEmailTemplate } from "./base-template"

interface EmailVerificationProps {
  firstName: string
  verificationCode: string
  expiryMinutes?: number
}

export function EmailVerificationTemplate({ firstName, verificationCode, expiryMinutes = 15 }: EmailVerificationProps) {
  return (
    <BaseEmailTemplate title="Verify Your Email - QADA.ng">
      <h2 style={{ color: "#003087", marginBottom: "20px" }}>Hello {firstName},</h2>

      <p>Use this verification code to complete your account setup:</p>

      <div className="highlight-box">
        <div className="otp-code">{verificationCode}</div>
        <p style={{ margin: "10px 0 0 0", fontSize: "14px", color: "#666" }}>Code expires in {expiryMinutes} minutes</p>
      </div>

      <p>
        Enter this code on the verification page to activate your account and start enjoying our car rental services.
      </p>

      <div style={{ textAlign: "center", margin: "30px 0" }}>
        <a href="https://qada.ng/auth/verify-email" className="btn">
          Verify Email Now
        </a>
      </div>

      <p>
        If you did not create an account with QADA.ng, please ignore this email or contact our support team if you have
        concerns.
      </p>

      <p style={{ marginTop: "30px" }}>
        --
        <br />
        QADA.ng Support Team
      </p>
    </BaseEmailTemplate>
  )
}
