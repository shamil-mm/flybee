const PDFDocument = require('pdfkit');

async function pdfGenerate(deliveredOrders) {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 30 });

            let totalSalesCount = 0;
            let totalOrderAmount = 0;
            let totalOfferDiscount = 0;
            let totalCouponDiscount = 0;

            const tableRows = [];

            deliveredOrders.forEach(value => {
                value.OrderedProducts.forEach(order => {

                    totalSalesCount++;
                    totalOrderAmount += value.TotalAmount;

                    const offerDiscount =
                        order.productId.offerPercentage === 0
                            ? 0
                            : (order.price * order.productId.offerPercentage) / 100;

                    const couponDiscount =
                        value.couponPercentage === 0
                            ? 0
                            : (order.price * value.couponPercentage) / 100;

                    totalOfferDiscount += offerDiscount;
                    totalCouponDiscount += couponDiscount;

                    const orderDate = new Date(value.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    });

                    tableRows.push([
                        order._id.toString().slice(-4),
                        orderDate,
                        order.productId.product_name,
                        `${value.shippingAddress.name},`,
                        value.paymentMethod,
                        order.productId.offerPercentage === 0
                            ? 'Not Applied'
                            : offerDiscount.toFixed(2),
                        value.couponPercentage === 0
                            ? 'Not Applied'
                            : couponDiscount.toFixed(2),
                        value.TotalAmount.toFixed(2)
                    ]);
                });
            });

            // ===== TITLE =====
            doc.fontSize(20).text('Sales Report', { align: 'center' });
            doc.moveDown(2);

            // ===== TABLE CONFIG =====
            const headers = [
                'Order ID',
                'Order Date',
                'Product',
                'Customer',
                'Payment Method',
                'Offer Discount',
                'Coupon Discount',
                'Final Cart Price'
            ];

            const columnWidth = (doc.page.width - 60) / headers.length;
            const startX = 30;
            let y = doc.y;

            // ===== TABLE HEADERS =====
            doc.fontSize(10).font('Helvetica-Bold');
            headers.forEach((h, i) => {
                doc.text(h, startX + i * columnWidth, y, {
                    width: columnWidth,
                    align: 'center'
                });
            });

            y += 30;
            doc.font('Helvetica');

            // ===== TABLE ROWS =====
            tableRows.forEach(row => {
                row.forEach((cell, i) => {
                    doc.text(String(cell), startX + i * columnWidth, y, {
                        width: columnWidth,
                        align: 'center'
                    });
                });

                y += 25;

                if (y > doc.page.height - 80) {
                    doc.addPage();
                    y = 50;
                }
            });

            // ===== TOTALS ROW =====
            y += 20;
            doc.font('Helvetica-Bold');

            doc.text('Totals', startX, y, {
                width: columnWidth * 5,
                align: 'center'
            });

            doc.text(totalOfferDiscount.toFixed(2), startX + 5 * columnWidth, y, {
                width: columnWidth,
                align: 'center'
            });

            doc.text(totalCouponDiscount.toFixed(2), startX + 6 * columnWidth, y, {
                width: columnWidth,
                align: 'center'
            });

            doc.text(totalOrderAmount.toFixed(2), startX + 7 * columnWidth, y, {
                width: columnWidth,
                align: 'center'
            });

            // ===== SALES COUNT ROW =====
            y += 30;
            doc.text(
                `Overall Sales Count: ${totalSalesCount}`,
                startX + 6 * columnWidth,
                y,
                { width: columnWidth * 2, align: 'center' }
            );

            // ===== FINALIZE =====
            doc.end();

            const buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => resolve(Buffer.concat(buffers)));

        } catch (err) {
            reject(err);
        }
    });
}

module.exports = pdfGenerate;
