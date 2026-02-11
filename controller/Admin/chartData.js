const Order = require('../../models/orderSchema');
const user=require('../../models/userSchema')
const {Product}=require('../../models/productSchema')
const {endOfYear,subYears,startOfYear,endOfMonth,startOfMonth,subMonths, startOfWeek, subDays, endOfDay, subWeeks, endOfWeek, format, startOfDay, isWithinInterval } = require('date-fns');

const chartData = async (req, res) => {
    try {
        const filter = req.query.filter;

        let data;
        

        switch (filter) {
            case 'Weekly':
                data = await getWeeklyData();
                break;
            case 'Monthly':
                data = await getMonthlyData();
                break;
            case 'Yearly':
                data = await getYearlyData();
                break;
            default:
                data = await getWeeklyData();
                break;
        }
      
        res.json(data);

    } catch (error) {
        console.error(error);
    }
}

async function getWeeklyData() {
    const today = new Date();
    const startDate = startOfWeek(subDays(today, 7)); 
    const endDate = endOfDay(today); 

    const orderlist = await Order.find({
        'OrderedProducts.orderDate': {
            $gte: startDate,
            $lte: endDate
        }
    });
    const userlist = await user.userRegister.find({
        createdate: {
            $gte: startDate,
            $lte: endDate
        }
    })
    const productlist = await Product.find({
        updatedAt: {
            $gte: startDate,
            $lte: endDate
        }
    });
   

    
    // sale session  =======================
    let orderData = [];
    let deliveredProductCount = 0;

    orderlist.forEach(order => {
        order.OrderedProducts.forEach(product => {
            if (product.orderStatus === 'Delivered') {
                orderData.push(product);
            }
        });
    });
    const labels = Array.from({ length: 4 }, (_, index) => {
        const startOfWeekDate = startOfWeek(subWeeks(today, 3 - index));
        const endOfWeekDate = endOfWeek(startOfWeekDate);

        return `${format(startOfWeekDate, 'MMM d')} - ${format(endOfWeekDate, 'MMM d')}`;
    });

    // console.log(`Labels: ${labels}`);

    const sales = labels.map((weekLabel, index) => {
        const startOfWeekDate = startOfWeek(subWeeks(today, 3 - index))
        const endOfWeekDate = endOfWeek(startOfWeekDate);

        const filteredOrders = orderData.filter(product => {
            const orderDate = startOfDay(new Date(product.orderDate));
            return isWithinInterval(orderDate, { start: startOfWeekDate, end: endOfWeekDate });
        });
        return filteredOrders.length;
    });
        // sale session ends hereconst newUsers = labels.map((weekLabel, index) => {
       


        //  new users session

        const newUsers = labels.map((weekLabel, index) => {
            const startOfWeekDate = startOfWeek(subWeeks(today, 3 - index));
            const endOfWeekDate = endOfWeek(startOfWeekDate);

            const filteredUsers = userlist.filter(user => {
                const joinDate = startOfDay(new Date(user.createdate))
                return isWithinInterval(joinDate, { start: startOfWeekDate, end: endOfWeekDate })
            });
            return filteredUsers.length;
        });
        //  new users session end

        // new product session========
        const newProducts = labels.map((weekLabel, index) => {
            const startOfWeekDate = startOfWeek(subWeeks(today, 3 - index));
            const endOfWeekDate = endOfWeek(startOfWeekDate);
    
            const filteredProducts = productlist.filter(product => {
                const addedDate = startOfDay(new Date(product.updatedAt));
                return isWithinInterval(addedDate, { start: startOfWeekDate, end: endOfWeekDate });
            });
            return filteredProducts.length;
        });


        // prodct session ends here
       
 

    

    return { labels, sales,newUsers,newProducts};
};

async function getMonthlyData() {
    const today = new Date();
    const startDate = startOfMonth(subMonths(today, 11)); // Data for the last 12 months
    const endDate = endOfDay(today);

    // console.log(`Start Date: ${startDate}`);
    // console.log(`End Date: ${endDate}`);

    const orderlist = await Order.find({
        'OrderedProducts.orderDate': {
            $gte: startDate,
            $lte: endDate
        }
    });
    const userlist = await user.userRegister.find({
        createdate: {
            $gte: startDate,
            $lte: endDate
        }
    })
    const productlist = await product.add_pro_model.find({
        updatedAt: {
            $gte: startDate,
            $lte: endDate
        }
    });
   
   

    
    // sale session  =======================
    let orderData = [];
    let deliveredProductCount = 0;

    orderlist.forEach(order => {
        order.OrderedProducts.forEach(product => {
            if (product.orderStatus === 'Delivered') {
                orderData.push(product);
            }
        });
    });
    const labels = Array.from({ length: 12 }, (_, index) => {
        const startOfMonthDate = startOfMonth(subMonths(today, 11 - index));
       

        return `${format(startOfMonthDate, 'MMM yyyy')}`;
    });

    // console.log(`Labels: ${labels}`);

    const sales = labels.map((monthLabel, index) => {
        const startOfMonthDate = startOfMonth(subMonths(today, 11 - index));
        const endOfMonthDate = endOfMonth(startOfMonthDate);

        const filteredOrders = orderData.filter(product => {
            const orderDate = startOfDay(new Date(product.orderDate));
            return isWithinInterval(orderDate, { start: startOfMonthDate, end: endOfMonthDate });
        });
        return filteredOrders.length;
    });
        // sale session ends hereconst newUsers = labels.map((weekLabel, index) => {
       


        //  new users session

        const newUsers = labels.map((monthLabel, index) => {
            const startOfMonthDate = startOfMonth(subMonths(today, 11 - index));
            const endOfMonthDate = endOfMonth(startOfMonthDate);

            const filteredUsers = userlist.filter(user => {
                const joinDate = startOfDay(new Date(user.createdate))
                return isWithinInterval(joinDate, { start: startOfMonthDate, end: endOfMonthDate })
            });
            return filteredUsers.length;
        });
        //  new users session end

        // new product session========
        const newProducts = labels.map((monthLabel, index) => {
            const startOfWeekDate = startOfMonth(subMonths(today, 11 - index));
            const endOfWeekDate = endOfWeek(startOfWeekDate);
    
            const filteredProducts = productlist.filter(product => {
               
                const addedDate = startOfDay(new Date(product.updatedAt));
                
                return isWithinInterval(addedDate, { start: startOfWeekDate, end: endOfWeekDate });
            });
            return filteredProducts.length;
        });


        // prodct session ends here
       


    // console.log(newUsers,newProducts)

    return { labels, sales,newUsers,newProducts};
};

async function getYearlyData() {
    const today = new Date();
    const startDate = startOfYear(subYears(today, 4)); // Data for the last 12 months
    const endDate = endOfDay(today);

    // console.log(`Start Date: ${startDate}`);
    // console.log(`End Date: ${endDate}`);

    const orderlist = await Order.find({
        'OrderedProducts.orderDate': {
            $gte: startDate,
            $lte: endDate
        }
    });
    const userlist = await user.userRegister.find({
        createdate: {
            $gte: startDate,
            $lte: endDate
        }
    })
    const productlist = await product.add_pro_model.find({
        updatedAt: {
            $gte: startDate,
            $lte: endDate
        }
    });
   

    
    // sale session  =======================
    let orderData = [];
    let deliveredProductCount = 0;

    orderlist.forEach(order => {
        order.OrderedProducts.forEach(product => {
            if (product.orderStatus === 'Delivered') {
                orderData.push(product);
            }
        });
    });
    const labels = Array.from({ length: 5 }, (_, index) => {
        const startOfYearDate = startOfYear(subYears(today, 4 - index));
        const endOfYearDate = endOfYear(startOfYearDate);

        return `${format(startOfYearDate, 'yyyy')}`;
    });

    // console.log(`Labels: ${labels}`);

    const sales = labels.map((yearLabel, index) => {
        const startOfYearDate = startOfYear(subYears(today, 4 - index));
        const endOfYearDate = endOfYear(startOfYearDate);

        const filteredOrders = orderData.filter(product => {
            const orderDate = startOfDay(new Date(product.orderDate));
            return isWithinInterval(orderDate, { start: startOfYearDate, end: endOfYearDate });
        });
        return filteredOrders.length;
    });
        // sale session ends hereconst newUsers = labels.map((weekLabel, index) => {
       


        //  new users session

        const newUsers = labels.map((yearLabel, index) => {

            const startOfYearDate = startOfYear(subYears(today, 4 - index));
            const endOfYearDate = endOfYear(startOfYearDate);

            const filteredUsers = userlist.filter(user => {
                const joinDate = startOfDay(new Date(user.createdate))
                return isWithinInterval(joinDate, { start: startOfYearDate, end: endOfYearDate })
            });
            return filteredUsers.length;
        });
        //  new users session end

        // new product session========
        const newProducts = labels.map((yearLabel, index) => {
            const startOfYearDate = startOfYear(subYears(today, 4 - index));
            const endOfYearDate = endOfYear(startOfYearDate);
    
            const filteredProducts = productlist.filter(product => {
                const addedDate = startOfDay(new Date(product.updatedAt));
                return isWithinInterval(addedDate, { start: startOfYearDate, end: endOfYearDate });
            });
            return filteredProducts.length;
        });


        // prodct session ends here
       
 

    

    return { labels, sales,newUsers,newProducts};
};

const chartDataTwo = async (req, res) => {
    try {
        const topProducts = await Order.aggregate([
            {
                $match: {
                    'OrderedProducts.orderStatus': "Delivered"
                }
            },
            {
                $unwind: '$OrderedProducts'
            },
            {
                $group: {
                    _id: '$OrderedProducts.productId',
                    totalOrdered: { $sum: 1 }
                }
            },
            {
                $sort: { totalOrdered: -1 }
            },
            {
                $limit: 5
            },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            {
                $project: {
                    _id: 0,
                    productId: '$_id',
                    totalOrdered: 1,
                    productDetails: { $arrayElemAt: ['$productDetails', 0] }
                }
            }
        ])
       
        const labels = topProducts.map(product => product.productDetails.product_name);
        const data = topProducts.map(product => product.totalOrdered);
        res.json({ labels, data });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};









module.exports = { chartData ,chartDataTwo};
