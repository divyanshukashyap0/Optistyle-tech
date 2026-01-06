/* ===================== ENV SETUP ===================== */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

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

/* ===================== PATH SETUP ===================== */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ===================== FIREBASE INIT ===================== */
const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "optistyle-c4c81.firebasestorage.app",
});

console.log("[FIREBASE] ✅ Firebase Admin Initialized");

/* ===================== APP INIT ===================== */
const app = express();
const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0";

/* ===================== MIDDLEWARE ===================== */
app.use(cors({ origin: "*" }));
app.use(express.json());

/* ===================== HEALTH ===================== */
app.get("/", (req, res) => {
  res.json({
    status: "Online",
    service: "OptiStyle Core Engine",
  });
});

app.get("/api/status", (req, res) => {
  res.json({
    status: "Online",
    timestamp: new Date().toISOString(),
  });
});

/* ===================== EYE TEST PDF ===================== */
app.post("/api/eye-test-pdf", (req, res) => {
  try {
    const { name, age, nearVision, farVision } = req.body;
    const doc = new PDFDocument({ size: "A4", margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment");

    doc.pipe(res);
    doc.fontSize(20).text("OptiStyle Eye Test Report", { align: "center" });
    doc.moveDown();
    doc.text(`Name: ${name}`);
    doc.text(`Age: ${age}`);
    doc.text(`Near Vision: ${nearVision}`);
    doc.text(`Far Vision: ${farVision}`);
    doc.end();
  } catch (err) {
    res.status(500).end();
  }
});

/* ===================== ORDER API (FIXED) ===================== */
app.post("/api/order", async (req, res) => {
  try {
    const orderData = req.body;

    const invoiceNumber = await generateInvoiceNumber();

    const enrichedOrder = {
      ...orderData,
      invoiceNumber,
      orderStatus: "Processing",
      paymentStatus: "Paid",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const pdfBuffer = await generateInvoicePDF(enrichedOrder);

    try {
      enrichedOrder.invoiceUrl = await uploadInvoiceToStorage(
        pdfBuffer,
        `invoice_${invoiceNumber}.pdf`
      );
    } catch {
      console.warn("Invoice upload failed");
    }

    const db = admin.firestore();
    const docRef = await db.collection("orders").add(enrichedOrder);

    sendAdminMail(enrichedOrder, pdfBuffer).catch(() => {});
    sendUserMail(enrichedOrder, pdfBuffer).catch(() => {});

    res.status(201).json({
      success: true,
      orderId: docRef.id,
      invoiceNumber,
      invoiceUrl: enrichedOrder.invoiceUrl || "",
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* ===================== AI CHAT ===================== */
app.post("/api/chat", async (req, res) => {
  try {
    const reply = await chatWithgroq(req.body.message);
    res.json({ reply });
  } catch {
    res.status(500).json({ error: "AI unavailable" });
  }
});

/* ===================== SERVER START ===================== */
app.listen(PORT, HOST, () => {
  console.log(`
========================================
🚀 OPTISTYLE BACKEND ONLINE
📡 http://${HOST}:${PORT}
========================================
`);
});


// 🔁 Common order handler
const orderHandler = async (req, res) => {
  try {
    const orderData = req.body;

    res.status(201).json({
      success: true,
      orderId: "TEST123",
      invoiceNumber: "INV-TEST",
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ Support BOTH routes
app.post("/api/order", orderHandler);
app.post("/api/orders", orderHandler);
