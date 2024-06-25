const PDFDocument = require('pdfkit');
const fs = require('fs');

async function pdfGenerate(deliveredOrders) {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument();

            const overallMetrics = {
                salesCount: deliveredOrders.length,
                orderAmount: 0,
                discountAmount: 0
            };

            const tableRows = [];
            
            deliveredOrders.forEach((order) => {
                order.OrderedProducts.forEach((product) => {
                    overallMetrics.orderAmount += order.TotalAmount;
                    const productPrice = product.productId.price;
                    const offerDiscount = product.productId.offerPercentage ? (productPrice * product.productId.offerPercentage / 100) : 0;
                    const couponDiscount = order.couponPercentage ? (productPrice * order.couponPercentage / 100) : 0;
                    overallMetrics.discountAmount += offerDiscount + couponDiscount;
                    
                    tableRows.push([
                        product._id.toString().slice(-4),
                        new Date(product.orderDate).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                        }),
                        product.productId.product_name,
                        `${product.shippingAddress?.name}, ${product.shippingAddress?.address}`,
                        product.paymentMethod,
                        product.productId.offerPercentage === 0 ? 'No Offer Applied' : (productPrice * product.productId.offerPercentage / 100).toFixed(2),
                        order.couponPercentage === 0 ? 'No Coupon Applied' : (productPrice * order.couponPercentage / 100).toFixed(2),
                        order.TotalAmount.toFixed(2)
                    ]);
                });
            });

            // Title
            doc.fontSize(20).text('Sales Report', { align: 'center' }).fontSize(12);
            doc.moveDown();
            doc.moveDown();
            doc.moveDown();

            // Table Headers
            const tableHeaders = ['Order ID', 'Order Date', 'Product', 'Customer', 'Payment Method', 'Offer Discount', 'Coupon Discount', 'Final Cart Price'];
            const columnWidth = (doc.page.width - 20) / tableHeaders.length; // Adjust width based on page width
            const tableWidth = columnWidth * tableHeaders.length;
            const startX = (doc.page.width - tableWidth) / 2; // Calculate startX to center the table

            let y = doc.y;
            tableHeaders.forEach((header, i) => {
                doc.text(header, startX + i * columnWidth, y, { width: columnWidth, align: 'center' });
            });
            
            // Increase y to create a distance between table headers and rows
            y += 50;

            // Table Rows
            tableRows.forEach(row => {
                row.forEach((cell, i) => {
                    doc.text(cell, startX + i * columnWidth, y, { width: columnWidth, align: 'center' });
                });
                y += 75;

                // Add a new page if the table goes beyond the current page height
                if (y > doc.page.height - 50) {
                    doc.addPage();
                    y = 50; // Reset y to the top of the new page
                }
            });

            // Horizontal Metrics
            const metricsY = y + 30; // Position below the table with some space
            const metricsXStart = startX+50; // Align metrics start with the table
            const metricsSpacing = tableWidth / 3; // Space between each metric, dividing the table width by the number of metrics

            doc.text(`Overall Sales Count: ${overallMetrics.salesCount}`, metricsXStart, metricsY);
            doc.text(`Overall Discount: ${overallMetrics.discountAmount}`, metricsXStart + metricsSpacing, metricsY);
            doc.text(`Overall Order Amount: ${overallMetrics.orderAmount}`, metricsXStart + 2 * metricsSpacing, metricsY);

            doc.end();
            const buffer = [];
            doc.on('data', buffer.push.bind(buffer));
            doc.on('end', () => resolve(Buffer.concat(buffer)));
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = pdfGenerate;
