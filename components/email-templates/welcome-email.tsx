import { BaseEmailTemplate } from "./base-template"

interface WelcomeEmailProps {
  firstName: string
  email: string
}

export function WelcomeEmail({ firstName, email }: WelcomeEmailProps) {
  return (
    <BaseEmailTemplate title="Welcome to QADA.ng">
      <h2 style={{ color: "#003087", marginBottom: "20px" }}>Welcome to QADA.ng, {firstName}!</h2>

      <p>
        We're thrilled to have you join Nigeria's premier car rental marketplace. Your account has been successfully
        created and you're ready to start exploring our wide range of vehicles.
      </p>

      <div className="highlight-box">
        <h3 style={{ color: "#0071c2", margin: "0 0 10px 0" }}>What's Next?</h3>
        <p style={{ margin: "0" }}>Complete your profile, add funds to your wallet, and book your first car rental!</p>
      </div>

      <p>Here's what you can do with your QADA.ng account:</p>
      <ul style={{ paddingLeft: "20px" }}>
        <li>Browse and book from thousands of verified vehicles</li>
        <li>Choose between self-drive or with-driver options</li>
        <li>Earn reward points with every booking</li>
        <li>Refer friends and earn wallet credits</li>
        <li>24/7 customer support</li>
      </ul>

      <div style={{ textAlign: "center", margin: "30px 0" }}>
        <a href="https://qada.ng/dashboard" className="btn">
          Complete Your Profile
        </a>
      </div>

      <p>
        If you have any questions or need assistance, don't hesitate to reach out to our support team at support@qada.ng
        or call us at +2349099996424.
      </p>

      <p style={{ marginTop: "30px" }}>
        Best regards,
        <br />
        The QADA.ng Team
      </p>
    </BaseEmailTemplate>
  )
}
