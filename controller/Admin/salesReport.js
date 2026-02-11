const Order=require('../../models/orderSchema')
const pdfGenerate=require('../../functions/pdfGenerator')
const fs=require('fs')

const salesReporst=async(req,res)=>{
    try {
    const orders = await Order.find({}).populate('OrderedProducts.productId');
    const deliveredOrders = orders.filter(order => 
        order.OrderedProducts.every(product => product.orderStatus === 'Delivered')
    );
    res.render('salesReport',{deliveredOrders})
    } catch (error) {
        console.log(error)
    }
}
const sortListOfOrder=async(req,res)=>{
    try {
        console.log('sort list of order is working')
        const type=req.query.value
      

        let startDate;
        let endDate = new Date(); 

       
        if (type === 'daily') {
            startDate = new Date();
            startDate.setHours(0, 0, 0, 0); 
        } else if (type === 'monthly') {
            startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1); 
        } else if (type === 'yearly') {
            startDate = new Date(endDate.getFullYear(), 0, 1); 
            console.log(startDate)
        } else if (type== 'Custom' && req.query.startDate && req.query.endDate){     
            startDate = new Date(req.query.startDate)
            endDate= new Date(req.query.endDate)
            endDate.setHours(23, 59, 59, 999);
        }else{
            startDate = new Date(0);    
        }


         const orders = await Order.find({createdAt:{ $gte: startDate, $lte: endDate }
        })
         .populate('OrderedProducts.productId')
         .populate('OrderedProducts.category')
         .lean();
       
        
        const deliveredOrders = orders.filter(order =>
            order.OrderedProducts.every(product => product.orderStatus === 'Delivered')
        );
        

        if(req.query.downloadPDF){

            
            const pdfBuffer = await pdfGenerate(deliveredOrders);
            const filePath = 'sales_report.pdf';
            fs.writeFileSync(filePath, pdfBuffer);
            res.download(filePath, 'sales_report.pdf', (err) => {
                if (err) {
                    console.error('Error sending PDF:', err);
                } else {
                    fs.unlinkSync(filePath);
                }
            });

        }else{
            return res.json({ deliveredOrders });
        }
      


    } catch (error) {
        console.log(error)
    }
}
module.exports={salesReporst,sortListOfOrder}