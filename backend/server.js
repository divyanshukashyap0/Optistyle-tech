/* ===================== ENV SETUP ===================== */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import dotenv from "dotenv";
dotenv.config();

console.log("groq KEY:", process.env.GROQ_API_KEY);

/* ===================== IMPORTS ===================== */
import express from "express";
import cors from "cors";
import admin from "firebase-admin";
import PDFDocument from "pdfkit";

/* ===== Local Imports ===== */
import { chatWithgroq } from "./groqChat.js";
import { sendAdminMail, sendUserMail } from "./mailer.js";
import { generateInvoiceNumber } from "./invoiceNumber.js";
import { generateInvoicePDF } from "./pdfInvoice.js";
import { uploadInvoiceToStorage } from "./storage.js";

/* ===== Firebase Service Account ===== */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccount = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "serviceAccountKey.json"),
    "utf8"
  )
);

/* ===================== APP INIT ===================== */
const app = express();

/* ===================== MIDDLEWARE ===================== */
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

/* ===================== FIREBASE INIT ===================== */
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "optistyle-c4c81.firebasestorage.app",
});

console.log("[FIREBASE] ✅ Firebase Admin Initialized");

/* ===================== HEALTH CHECK ===================== */
app.get("/api/status", (req, res) => {
  res.status(200).json({
    status: "Online",
    timestamp: new Date().toISOString(),
    service: "OptiStyle Core Engine",
  });
});

/* ===================== EYE TEST PDF ===================== */
app.post("/api/eye-test-pdf", (req, res) => {
  try {
    const { name, age, nearVision, farVision } = req.body;

    const doc = new PDFDocument({ size: "A4", margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=OptiStyle_Eye_Test_Report.pdf"
    );

    doc.pipe(res);

    doc.fontSize(20).text("OptiStyle Eye Test Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Name: ${name}`);
    doc.text(`Age: ${age}`);
    doc.moveDown();
    doc.text(`Near Vision Result: ${nearVision}`);
    doc.text(`Far Vision Result: ${farVision}`);
    doc.moveDown();
    doc
      .fontSize(10)
      .fillColor("gray")
      .text(
        "Disclaimer: This eye test is indicative only and not a medical diagnosis.",
        { align: "center" }
      );

    doc.end();
  } catch (err) {
    console.error("Eye Test PDF Error:", err.message);
    res.status(500).end();
  }
});

/* ===================== ORDER API ===================== */
app.post("/api/orders", async (req, res) => {
  console.log(`  [ORDER] 📨 Incoming request from: ${req.body.userEmail}`);

  try {
    const orderData = req.body;

    // 1️⃣ Invoice number
    const invoiceNumber = await generateInvoiceNumber();

    // 2️⃣ Enrich order
    const enrichedOrder = {
      ...orderData,
      invoiceNumber,
      orderStatus: "Processing",
      paymentStatus: "Paid",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // 3️⃣ Generate PDF
    const pdfBuffer = await generateInvoicePDF(enrichedOrder);

    // 4️⃣ Upload PDF
    try {
      const invoiceUrl = await uploadInvoiceToStorage(
        pdfBuffer,
        `invoice_${invoiceNumber}.pdf`
      );
      enrichedOrder.invoiceUrl = invoiceUrl;
    } catch {
      console.warn("  [STORAGE] ⚠️ Upload failed, continuing...");
    }

    // 5️⃣ Save to Firestore
    const db = admin.firestore();
    const docRef = await db.collection("orders").add(enrichedOrder);

    // 6️⃣ Send emails (non-blocking)
    sendAdminMail(enrichedOrder, pdfBuffer).catch(err =>
      console.error("  [MAILER] ❌ Admin mail failed:", err.message)
    );

    sendUserMail(enrichedOrder, pdfBuffer).catch(err =>
      console.error("  [MAILER] ❌ User mail failed:", err.message)
    );

    res.status(201).json({
      success: true,
      orderId: docRef.id,
      invoiceNumber,
      invoiceUrl: enrichedOrder.invoiceUrl || "",
    });

    console.log(`  [ORDER] ✅ Dispatch Successful: ${invoiceNumber}`);
  } catch (error) {
    console.error("  [SERVER] ❌ Order Error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

/* ===================== AI CHAT (GROQ) ===================== */
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message required" });
    }

    const reply = await chatWithgroq(message);
    res.json({ reply });
  } catch (err) {
    console.error("groq Error:", err.message);
    res.status(500).json({ error: "AI unavailable" });
  }
});

/* ===================== SERVER START ===================== */
const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`
========================================
🚀 OPTISTYLE BACKEND CORE IS NOW ONLINE
📡 Listening on: http://${HOST}:${PORT}
🏥 Health Check: http://${HOST}:${PORT}/api/status
========================================
`);
});
