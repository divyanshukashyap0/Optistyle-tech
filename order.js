
import { collection, addDoc, serverTimestamp, doc, runTransaction } from "firebase/firestore";
import { db } from "./firebase.js";

/**
 * Generates a unique, sequential invoice number on the client-side using Firestore transactions.
 */
export const generateInvoiceNumber = async () => {
  const year = new Date().getFullYear();
  const counterRef = doc(db, 'counters', 'invoice_counter');

  return await runTransaction(db, async (transaction) => {
    const counterDoc = await transaction.get(counterRef);
    let nextNumber = 1;

    if (counterDoc.exists()) {
      const data = counterDoc.data();
      if (data.year === year) {
        nextNumber = data.count + 1;
      }
    }

    transaction.set(counterRef, { count: nextNumber, year: year }, { merge: true });

    const sequence = nextNumber.toString().padStart(4, '0');
    return `OPTI-INV-${year}-${sequence}`;
  });
};

/**
 * Creates an order in Firestore and handles metadata enrichment.
 */
export const createCloudOrder = async (orderData) => {
  try {
    const invoiceNumber = await generateInvoiceNumber();
    const docRef = await addDoc(collection(db, "order"), {
      ...orderData,
      invoiceNumber,
      createdAt: serverTimestamp(),
      paymentStatus: 'Paid',
      orderstatus: 'Processing'
    });
    return { success: true, id: docRef.id, invoiceNumber };
  } catch (error) {
    console.error("Cloud Order Sync Failed:", error);
    
    if (error.code === 'not-found' || error.message.toLowerCase().includes('database')) {
      return { 
        success: false, 
        error: "CRITICAL: Firestore database configuration missing. Please ensure the Firestore (default) database is created in your Firebase Console." 
      };
    }
    
    return { success: false, error: error.message };
  }
};
