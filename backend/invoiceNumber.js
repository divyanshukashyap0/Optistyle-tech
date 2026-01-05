
const admin = require('firebase-admin');

/**
 * Generates a unique, sequential invoice number in the format OPTI-INV-YYYY-XXXX
 * @returns {Promise<string>}
 */
const generateInvoiceNumber = async () => {
  const db = admin.firestore();
  const year = new Date().getFullYear();
  const counterRef = db.collection('counters').doc('invoice_counter');

  return await db.runTransaction(async (transaction) => {
    const counterDoc = await transaction.get(counterRef);
    let nextNumber = 1;

    if (counterDoc.exists) {
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

module.exports = { generateInvoiceNumber };
