const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
require("dotenv").config();

/* ================= LOAD GOOGLE CREDS ================= */

const credentials = JSON.parse(
  fs.readFileSync(path.join(__dirname, "credentials.json"))
);

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  credentials.web.client_id,
  credentials.web.client_secret,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN,
});

const gmail = google.gmail({ version: "v1", auth: oauth2Client });

/* ================= BASE64 HELPER ================= */

const base64UrlEncode = (str) =>
  Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

/* ================= EMAIL BUILDER ================= */

function buildEmail({
  to,
  subject,
  html,
  attachments = [],
}) {
  const boundary = "__OPTISTYLE_BOUNDARY__";

  let message = [
    `From: OptiStyle <${process.env.GMAIL_SENDER}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    "Content-Type: text/html; charset=UTF-8",
    "Content-Transfer-Encoding: 7bit",
    "",
    html,
    "",
  ];

  attachments.forEach((att) => {
    message.push(
      `--${boundary}`,
      `Content-Type: ${att.contentType}`,
      "Content-Transfer-Encoding: base64",
      `Content-Disposition: attachment; filename="${att.filename}"`,
      "",
      att.content.toString("base64"),
      ""
    );
  });

  message.push(`--${boundary}--`);

  return base64UrlEncode(message.join("\n"));
}

/* ================= ADMIN TEMPLATE ================= */

function adminTemplate(order) {
  const rows = order.products
    .map(
      (p) => `
      <tr>
        <td>${p.name}</td>
        <td>${p.quantity}</td>
        <td>₹${p.price}</td>
      </tr>`
    )
    .join("");

  return `
    <h2>🧾 New Order Received</h2>
    <p><strong>Invoice:</strong> ${order.invoiceNumber}</p>
    <table border="1" cellpadding="6" cellspacing="0">
      <tr><th>Item</th><th>Qty</th><th>Price</th></tr>
      ${rows}
    </table>
    <h3>Total: ₹${order.totalAmount}</h3>
    <p>Customer: ${order.userEmail}</p>
  `;
}

/* ================= USER TEMPLATE ================= */

function userTemplate(order) {
  return `
    <h2>Thank you for your order 🎉</h2>
    <p>Your order <strong>${order.invoiceNumber}</strong> has been confirmed.</p>
    <p>Total Amount: <strong>₹${order.totalAmount}</strong></p>
    <p>Your invoice is attached as a PDF.</p>
    <p>– Team OptiStyle</p>
  `;
}

/* ================= SEND EMAIL ================= */

async function sendEmail({
  to,
  subject,
  html,
  attachments = [],
}) {
  const raw = buildEmail({ to, subject, html, attachments });

  const res = await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw },
  });

  console.log("[MAILER] ✅ Email sent:", res.data.id);
  return res.data;
}

/* ================= PUBLIC FUNCTIONS ================= */

async function sendAdminMail(order, pdfBuffer) {
  return sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject: `🛒 New Order ${order.invoiceNumber}`,
    html: adminTemplate(order),
    attachments: [
      {
        filename: `Invoice_${order.invoiceNumber}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });
}

async function sendUserMail(order, pdfBuffer) {
  return sendEmail({
    to: order.userEmail,
    subject: `Your Order ${order.invoiceNumber}  OptiStyle`,
    html: userTemplate(order),
    attachments: [
      {
        filename: `Invoice_${order.invoiceNumber}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });
}

module.exports = {
  sendAdminMail,
  sendUserMail,
};
