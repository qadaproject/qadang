import { BaseEmailTemplate } from "./base-template"

interface SupportConfirmationProps {
  firstName: string
  ticketId: string
  subject: string
  message: string
}

export function SupportConfirmationTemplate({ firstName, ticketId, subject, message }: SupportConfirmationProps) {
  return (
    <BaseEmailTemplate title="Support Request Received - QADA.ng">
      <h2 style={{ color: "#003087", marginBottom: "20px" }}>Support Request Received</h2>

      <p>Hello {firstName},</p>

      <p>
        Thank you for contacting QADA.ng support. We have received your request and our team will get back to you within
        24 hours.
      </p>

      <div className="highlight-box">
        <h3 style={{ color: "#0071c2", margin: "0 0 15px 0" }}>Ticket Details</h3>
        <p style={{ margin: "5px 0" }}>
          <strong>Ticket ID:</strong> {ticketId}
        </p>
        <p style={{ margin: "5px 0" }}>
          <strong>Subject:</strong> {subject}
        </p>
        <p style={{ margin: "15px 0 0 0" }}>
          <strong>Your Message:</strong>
        </p>
        <div
          style={{
            backgroundColor: "#f8f9fa",
            padding: "15px",
            borderRadius: "4px",
            marginTop: "10px",
            fontSize: "14px",
            fontStyle: "italic",
          }}
        >
          {message}
        </div>
      </div>

      <p>In the meantime, you can also reach us through these channels for immediate assistance:</p>

      <ul style={{ paddingLeft: "20px" }}>
        <li>
          <strong>WhatsApp:</strong> +2349099996424
        </li>
        <li>
          <strong>Phone:</strong> +2349099996424, +2349044642424
        </li>
        <li>
          <strong>Email:</strong> support@qada.ng
        </li>
      </ul>

      <p>Please keep your ticket ID ({ticketId}) for reference when following up on this request.</p>

      <p style={{ marginTop: "30px" }}>
        Best regards,
        <br />
        QADA.ng Support Team
      </p>
    </BaseEmailTemplate>
  )
}
