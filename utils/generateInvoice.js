const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");

const logoPath = path.join(__dirname, "../assets/OMLogo.png");

const PAGE_BOTTOM = 740; // keep content above this y
const PAYMENT_LABELS = {
  card: "Card",
  upi: "UPI",
  wallet: "Wallet",
  netBanking: "Net Banking",
  cod: "Cash on Delivery",
};

const money = (n) =>
  `Rs. ${Number(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const capitalize = (s = "") => s.charAt(0).toUpperCase() + s.slice(1);

const formatAddress = (a = {}) =>
  [a.line1, a.line2, a.city, a.state, a.pincode].filter(Boolean).join(", ") ||
  "N/A";

const formatVariant = (v = {}) => {
  const parts = [];
  if (v.size) parts.push(`Size: ${v.size}`);
  if (v.color) parts.push(`Color: ${v.color}`);
  return parts.join("  |  ");
};

const generateInvoice = (order) =>
  new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });

    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    try {
      // ---------- helpers ----------
      const drawWatermark = () => {
        const prevX = doc.x;
        const prevY = doc.y;

        doc.save();
        doc
          .font("Helvetica-Bold")
          .fontSize(120)
          .fillColor("#D3D3D3")
          .fillOpacity(0.5)
          .rotate(-55, { origin: [400, 660] })
          .text("OmniMall", 200, 400, {
            width: 650,
            align: "center",
            lineBreak: false,
          });
        doc.restore();

        doc.x = prevX;
        doc.y = prevY;
      };

      const drawHeader = () => {
        if (fs.existsSync(logoPath)) {
          doc.image(logoPath, 50, 35, { fit: [100, 40] });
        } else {
          doc
            .font("Helvetica-Bold")
            .fontSize(40)
            .fillColor("#000000")
            .text("OmniMall", 50, 45);
        }
      };

      // watermark on every page (pageAdded does not fire for the first page)
      doc.on("pageAdded", drawWatermark);
      drawWatermark();
      drawHeader();

      const ensureSpace = (y, needed = 20) => {
        if (y + needed > PAGE_BOTTOM) {
          doc.addPage();
          return 60;
        }
        return y;
      };

      const line = (y) =>
        doc
          .moveTo(50, y)
          .lineTo(545, y)
          .strokeColor("#999999")
          .lineWidth(0.5)
          .stroke();

      // ---------- data ----------
      const user =
        order.userId && typeof order.userId === "object" ? order.userId : {};
      const addr = order.shippingAddress || {};

      // ---------- title + order info ----------
      doc.x = 50;
      doc.y = 110;

      doc
        .font("Helvetica-Bold")
        .fontSize(16)
        .fillColor("#222222")
        .text("ORDER INVOICE");
      doc.moveDown(0.5);

      doc.font("Helvetica").fontSize(11);
      doc.text(`Invoice No: ${order.orderId}`);
      doc.text(`Order Date: ${formatDate(order.createdAt)}`);
      doc.text(
        `Payment Method: ${PAYMENT_LABELS[order.paymentMethod] || "N/A"}`,
      );
      doc.text(`Payment Status: ${capitalize(order.paymentStatus)}`);
      doc.text(`Order Status: ${capitalize(order.status)}`);
      doc.moveDown();

      // ---------- billing / shipping ----------
      doc.font("Helvetica-Bold").fontSize(14).text("Billing Information");
      doc.font("Helvetica").fontSize(11);
      doc.text(`Name: ${addr.name || user.name || "N/A"}`);
      if (user.email) doc.text(`Email: ${user.email}`);
      if (addr.phone) doc.text(`Phone: ${addr.phone}`);
      doc.text(`Address: ${formatAddress(addr)}`, { width: 495 });
      doc.moveDown();

      // ---------- items table ----------
      doc.font("Helvetica-Bold").fontSize(14).text("Order Items");
      doc.moveDown(0.5);

      const col = { name: 50, qty: 320, price: 380, total: 470 };

      const drawRow = (y, cells, bold = false) => {
        doc
          .font(bold ? "Helvetica-Bold" : "Helvetica")
          .fontSize(11)
          .fillColor("#222222");
        doc.text(cells[0], col.name, y, {
          width: 260,
          lineBreak: false,
          ellipsis: true,
        });
        doc.text(cells[1], col.qty, y, {
          width: 50,
          align: "right",
          lineBreak: false,
        });
        doc.text(cells[2], col.price, y, {
          width: 80,
          align: "right",
          lineBreak: false,
        });
        doc.text(cells[3], col.total, y, {
          width: 75,
          align: "right",
          lineBreak: false,
        });
      };

      let y = doc.y;
      drawRow(y, ["Item", "Qty", "Price", "Total"], true);
      y += 18;
      line(y - 3);

      (order.items || []).forEach((item) => {
        const variant = formatVariant(item.variant);
        const rowHeight = variant ? 32 : 20;

        y = ensureSpace(y, rowHeight);

        drawRow(y, [
          item.name || "Item",
          String(item.quantity),
          money(item.price),
          money(item.price * item.quantity),
        ]);

        if (variant) {
          doc
            .font("Helvetica")
            .fontSize(9)
            .fillColor("#666666")
            .text(variant, col.name, y + 14, {
              width: 260,
              lineBreak: false,
              ellipsis: true,
            });
        }

        y += rowHeight;
      });

      line(y);
      y += 14;

      // ---------- price summary ----------
      const summaryRows = [["MRP Total", money(order.mrpTotal)]];

      if (order.productDiscount > 0) {
        summaryRows.push([
          "Product Discount",
          `- ${money(order.productDiscount)}`,
        ]);
      }
      if (order.couponDiscount > 0) {
        summaryRows.push([
          order.couponCode ? `Coupon (${order.couponCode})` : "Coupon Discount",
          `- ${money(order.couponDiscount)}`,
        ]);
      }
      summaryRows.push([
        "Delivery Fee",
        order.deliveryFee > 0 ? money(order.deliveryFee) : "Free",
      ]);
      if (order.codFee > 0) {
        summaryRows.push(["COD Fee", money(order.codFee)]);
      }
      if (order.gstIncluded > 0) {
        summaryRows.push(["GST (included in price)", money(order.gstIncluded)]);
      }

      summaryRows.forEach(([label, value]) => {
        y = ensureSpace(y, 18);
        doc.font("Helvetica").fontSize(11).fillColor("#222222");
        doc.text(label, 300, y, { width: 150, lineBreak: false });
        doc.text(value, 450, y, {
          width: 95,
          align: "right",
          lineBreak: false,
        });
        y += 18;
      });

      y = ensureSpace(y, 40);
      line(y);
      y += 8;

      doc.font("Helvetica-Bold").fontSize(14).fillColor("#222222");
      doc.text("Grand Total", 300, y, { width: 150, lineBreak: false });
      doc.text(money(order.total), 430, y, {
        width: 115,
        align: "right",
        lineBreak: false,
      });
      y += 40;

      // ---------- footer (pinned to bottom of the page) ----------
      const footerY = doc.page.height - doc.page.margins.bottom - 20; // about 772 on A4

      doc.font("Helvetica").fontSize(8).fillColor("#555555");
      doc.text(
        "Thank you for shopping with OmniMall! If the product have any defects you can return it within 10 days with following our guidelines. For any help contact us.",
        50,
        footerY,
        {
          width: 495,
          align: "center",
          lineBreak: false,
        },
      );

      doc.end();
    } catch (err) {
      reject(err);
    }
  });

module.exports = generateInvoice;
