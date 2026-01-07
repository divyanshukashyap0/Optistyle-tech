import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  doc, 
  runTransaction 
} from "firebase/firestore";
import { db } from "./firebase.js";

/**
 * Generates a unique, sequential invoice number
 */
export const generateInvoiceNumber = async () => {
  const year = new Date().getFullYear();
  const counterRef = doc(db, "counters", "invoice_counter");

  return await runTransaction(db, async (transaction) => {
    const counterDoc = await transaction.get(counterRef);
    let nextNumber = 1;

    if (counterDoc.exists()) {
      const data = counterDoc.data();
      if (data.year === year) {
        nextNumber = data.count + 1;
      }
    }

    transaction.set(
      counterRef,
      { count: nextNumber, year },
      { merge: true }
    );

    return `OPTI-INV-${year}-${nextNumber.toString().padStart(4, "0")}`;
  });
};

/**
 * Creates an order in Firestore (FIXED)
 */
export const createCloudOrder = async (orderData, user) => {
  try {
    if (!user || !user.uid) {
      throw new Error("User not authenticated");
    }

    const invoiceNumber = await generateInvoiceNumber();

    const finalOrder = {
      ...orderData,
      userId: user.uid,              // ✅ CRITICAL FIX
      userEmail: user.email,
      invoiceNumber,
      paymentStatus: "Paid",
      orderStatus: "Processing",     // ✅ typo fixed
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(
      collection(db, "orders"),      // ✅ collection fixed
      finalOrder
    );

    return {
      success: true,
      id: docRef.id,
      invoiceNumber
    };
  } catch (error) {
    console.error("Cloud Order Sync Failed:", error);
    return { success: false, error: error.message };
  }
};
