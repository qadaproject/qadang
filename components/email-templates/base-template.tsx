import type React from "react"

interface EmailTemplateProps {
  children: React.ReactNode
  title?: string
}

export function BaseEmailTemplate({ children, title }: EmailTemplateProps) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title || "QADA.ng"}</title>
        <style>{`
          body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f8fafc;
            line-height: 1.6;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #003087 0%, #0052d4 100%);
            padding: 30px 20px;
            text-align: center;
          }
          .logo {
            color: #ffffff;
            font-size: 32px;
            font-weight: bold;
            margin: 0;
            text-decoration: none;
          }
          .content {
            padding: 40px 30px;
            background-color: #ffffff;
          }
          .footer {
            background-color: #003087;
            color: #ffffff;
            padding: 30px 20px;
            text-align: center;
          }
          .footer-company {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 20px;
          }
          .footer-info {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 20px;
            margin-bottom: 20px;
            font-size: 14px;
          }
          .footer-item {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .social-links {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-bottom: 20px;
          }
          .social-link {
            display: inline-block;
            width: 40px;
            height: 40px;
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            text-align: center;
            line-height: 40px;
            color: #ffffff;
            text-decoration: none;
            transition: background-color 0.3s;
          }
          .social-link:hover {
            background-color: rgba(255, 255, 255, 0.2);
          }
          .copyright {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.8);
          }
          .btn {
            display: inline-block;
            padding: 12px 30px;
            background-color: #0071c2;
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 20px 0;
          }
          .btn:hover {
            background-color: #005999;
          }
          .highlight-box {
            background-color: #f0f9ff;
            border: 2px dashed #0071c2;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 20px 0;
          }
          .otp-code {
            font-size: 36px;
            font-weight: bold;
            color: #0071c2;
            letter-spacing: 4px;
            margin: 10px 0;
          }
          @media (max-width: 600px) {
            .container {
              margin: 0;
              box-shadow: none;
            }
            .content {
              padding: 20px 15px;
            }
            .footer-info {
              flex-direction: column;
              gap: 10px;
            }
            .social-links {
              gap: 10px;
            }
          }
        `}</style>
      </head>
      <body>
        <div className="container">
          {/* Header */}
          <div className="header">
            <h1 className="logo">QADA.ng</h1>
          </div>

          {/* Content */}
          <div className="content">{children}</div>

          {/* Footer */}
          <div className="footer">
            <div className="footer-company">Qada Services Ltd</div>

            <div className="footer-info">
              <div className="footer-item">
                <span>📍</span>
                <span>3, Abubakar Koko Crescent, Asokoro, Abuja</span>
              </div>
              <div className="footer-item">
                <span>📞</span>
                <span>+2349099996424, +2349044642424</span>
              </div>
              <div className="footer-item">
                <span>✉️</span>
                <span>support@qada.ng</span>
              </div>
            </div>

            <div className="social-links">
              <a href="#" className="social-link">
                f
              </a>
              <a href="#" className="social-link">
                𝕏
              </a>
              <a href="#" className="social-link">
                📱
              </a>
              <a href="#" className="social-link">
                📷
              </a>
            </div>

            <div className="copyright">Copyright © 2025. Qada Services Ltd.</div>
          </div>
        </div>
      </body>
    </html>
  )
}
