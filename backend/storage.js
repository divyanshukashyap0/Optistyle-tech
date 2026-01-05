
const admin = require('firebase-admin');

/**
 * Uploads a PDF buffer to Firebase Storage and returns the public URL
 * @param {Buffer} buffer - PDF binary data
 * @param {string} filename - Desired filename
 * @returns {Promise<string>}
 */
const uploadInvoiceToStorage = async (buffer, filename) => {
  const bucket = admin.storage().bucket();
  const file = bucket.file(`invoices/${filename}`);

  await file.save(buffer, {
    metadata: { contentType: 'application/pdf' },
    public: true
  });

  // Returns the public URL
  return `https://storage.googleapis.com/${bucket.name}/invoices/${filename}`;
};

module.exports = { uploadInvoiceToStorage };
