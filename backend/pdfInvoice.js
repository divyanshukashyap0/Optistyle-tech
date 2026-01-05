
const PDFDocument = require('pdfkit');

/**
 * Generates a professional Tax Invoice PDF buffer
 * @param {Object} order - Order and Invoice details
 * @returns {Promise<Buffer>}
 */
const generateInvoicePDF = (order) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));

    const primaryColor = '#0EA5E9';
    const accentColor = '#06B6D4';
    const darkColor = '#020617';

    // --- PAGE 1: TAX INVOICE ---
    // Header
    doc.rect(0, 0, 600, 120).fill(darkColor);
    doc.fillColor('#FFFFFF').fontSize(24).font('Helvetica-Bold').text('OptiStyle', 50, 45);
    doc.fontSize(10).font('Helvetica').text('Premium Eye Care & Eyewear', 50, 75);
    
    doc.fontSize(20).font('Helvetica-Bold').text('TAX INVOICE', 350, 55, { align: 'right', width: 200 });
    
    // Seller & Customer Details
    doc.fillColor(darkColor).fontSize(10).font('Helvetica-Bold').text('SELLER DETAILS', 50, 150);
    doc.font('Helvetica').text('OptiStyle Optical Hub', 50, 165);
    doc.text('Gahoi Colony, Near Vatika', 50, 178);
    doc.text('Datia, MP - 475661, India', 50, 191);
    doc.text('Email: support@optistyle.in', 50, 204);

    doc.font('Helvetica-Bold').text('BILL TO', 350, 150);
    doc.font('Helvetica').text(order.customerName || 'Valued Customer', 350, 165);
    doc.text(order.userEmail, 350, 178);
    doc.text(order.address || 'Online Order', 350, 191);

    // Invoice Metadata
    doc.rect(50, 240, 500, 40).fill('#F8FAFC');
    doc.fillColor(darkColor).font('Helvetica-Bold').fontSize(9);
    doc.text('INVOICE NO', 65, 250);
    doc.text('ORDER ID', 200, 250);
    doc.text('DATE', 450, 250);
    
    doc.font('Helvetica').fillColor(primaryColor);
    doc.text(order.invoiceNumber, 65, 262);
    doc.fillColor(darkColor);
    doc.text(order.orderId, 200, 262);
    doc.text(new Date().toLocaleDateString(), 450, 262);

    // Table Header
    let y = 300;
    doc.rect(50, y, 500, 25).fill(primaryColor);
    doc.fillColor('#FFFFFF').font('Helvetica-Bold').text('PRODUCT', 60, y + 8);
    doc.text('QTY', 350, y + 8, { width: 30, align: 'center' });
    doc.text('UNIT PRICE', 400, y + 8, { width: 70, align: 'right' });
    doc.text('TOTAL', 480, y + 8, { width: 60, align: 'right' });

    // Table Rows
    y += 35;
    doc.fillColor(darkColor).font('Helvetica');
    order.products.forEach(item => {
      doc.text(item.name, 60, y);
      doc.fontSize(8).fillColor('#64748B').text(`Frame: ${item.color || 'Standard'} | Lens: Blue-Cut Digital`, 60, y + 12);
      doc.fontSize(10).fillColor(darkColor).text(item.quantity.toString(), 350, y, { width: 30, align: 'center' });
      doc.text(`INR ${item.price.toLocaleString()}`, 400, y, { width: 70, align: 'right' });
      doc.text(`INR ${(item.price * item.quantity).toLocaleString()}`, 480, y, { width: 60, align: 'right' });
      y += 40;
    });

    // Totals
    y += 10;
    doc.moveTo(50, y).lineTo(550, y).stroke('#E2E8F0');
    y += 20;
    const subtotal = order.totalAmount / 1.18;
    const gst = order.totalAmount - subtotal;

    doc.font('Helvetica').text('Subtotal:', 350, y, { width: 100, align: 'right' });
    doc.text(`INR ${subtotal.toFixed(2)}`, 450, y, { width: 100, align: 'right' });
    y += 20;
    doc.text('GST (18%):', 350, y, { width: 100, align: 'right' });
    doc.text(`INR ${gst.toFixed(2)}`, 450, y, { width: 100, align: 'right' });
    y += 30;
    doc.rect(340, y - 10, 210, 40).fill(accentColor);
    doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(14).text('Grand Total:', 350, y);
    doc.text(`INR ${order.totalAmount.toLocaleString()}`, 450, y, { width: 100, align: 'right' });

    // Footer
    doc.fillColor('#94A3B8').fontSize(8).text('This is a system-generated tax invoice and does not require a physical signature.', 50, 750, { align: 'center', width: 500 });
    doc.text('Thank you for choosing OptiStyle - Your Vision, Our Commitment.', 50, 765, { align: 'center', width: 500 });

    // --- PAGE 2: TERMS & CONDITIONS ---
    doc.addPage();
    doc.fillColor(darkColor).fontSize(18).font('Helvetica-Bold').text('Terms & Conditions', 50, 50);
    doc.rect(50, 75, 40, 3).fill(primaryColor);

    const terms = [
      '1. Goods once sold cannot be returned or exchanged unless a manufacturing defect is identified within 7 days of delivery.',
      '2. Prescription accuracy is the sole responsibility of the customer. OptiStyle is not liable for issues arising from incorrect user-provided data.',
      '3. Standard warranty of 6 months applies to frames against plating peel-off and manufacturing flaws.',
      '4. Lens scratches occurring after 24 hours of delivery are not covered under warranty.',
      '5. All taxes are applied as per the prevalent GST rules of the Government of India.',
      '6. Any disputes are subject to the exclusive jurisdiction of the courts in Datia, MP.',
      '7. Delivery timelines are estimates and may vary based on courier availability and regional restrictions.'
    ];

    let termY = 110;
    doc.fillColor('#475569').fontSize(11).font('Helvetica');
    terms.forEach(term => {
      doc.text(term, 50, termY, { width: 500, lineGap: 8 });
      termY += doc.heightOfString(term, { width: 500 }) + 15;
    });

    doc.end();
  });
};

module.exports = { generateInvoicePDF };
