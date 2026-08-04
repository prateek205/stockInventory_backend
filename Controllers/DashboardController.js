import Customers from "../Models/CustomerModal.js";
import Dealers from "../Models/DealerModal.js";
import Products from "../Models/ProductModal.js";
import Purchases from "../Models/PurchaseModal.js";
import Sales from "../Models/SalesModal.js";

export const dashboard = async (req, res) => {
  try {
    const totalProducts = await Products.countDocuments();
    const totalDealers = await Dealers.countDocuments();
    const totalPurchase = await Purchases.countDocuments();
    const totalSales = await Sales.countDocuments();
    const totalCustomer = await Customers.countDocuments();

    const purchaseAmount = await Purchases.aggregate([
      {
        $group: {
          _id: null,
          totalPurchaseAmount: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    const totalPurchaseAmount =
      purchaseAmount.length > 0 ? purchaseAmount[0].totalPurchaseAmount : 0;

    const salesAmount = await Sales.aggregate([
      {
        $group: {
          _id: null,
          totalSalesAmount: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    const totalSalesAmount =
      salesAmount.length > 0 ? salesAmount[0].totalSalesAmount : 0;

    const totalProfit = totalPurchaseAmount - totalSalesAmount;

    const stock = await Products.aggregate([
      {
        $group: {
          _id: null,
          availableStock: {
            $sum: "$currentStock",
          },
        },
      },
    ]);

    const availableStock = stock.length > 0 ? stock[0].availableStock : 0;

    const lowStockProducts = await Products.countDocuments({
      $expr: {
        $lte: ["$currentStock", "$minStock"],
      },
    });

    const outOfStock = await Products.countDocuments({
      currentStock: 0,
    });

    const todaysDate = new Date();

    todaysDate.setHours(0, 0, 0);

    const todaysPurchase = await Purchases.aggregate([
      {
        $match: {
          createdAt: {
            $gte: todaysDate,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    const todaysPurchaseAmount =
      todaysPurchase.length > 0 ? todaysPurchase[0].total : 0;

    const todaysSales = await Sales.aggregate([
      {
        $match: {
          createdAt: {
            $gte: todaysDate,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    const todaysSalesAmount = todaysSales.length > 0 ? todaysSales[0].total : 0;

    const monthlyPurchase = await Purchases.aggregate([
      {
        $group: {
          _id: {
            month: {
              $month: "$createdAt",
            },
          },
          total: {
            $sum: "$totalAmount",
          },
        },
      },
      {
        $sort: {
          "_id.month": 1,
        },
      },
    ]);

    const monthlySales = await Sales.aggregate([
      {
        $group: {
          _id: {
            month: {
              $month: "$createdAt",
            },
          },
          total: {
            $sum: "$totalAmount",
          },
        },
      },
      {
        $sort: {
          "_id.month": 1,
        },
      },
    ]);

    const recentPurchase = await Purchases.find()
      .populate("dealer", "dealerName")
      .sort({
        createdAt: -1,
      })
      .limit(5);

    const recentSales = await Sales.find()
      .populate("customer", "customerName")
      .sort({
        createdAt: -1,
      })
      .limit(5);

    res.status(200).json({
      success: true,
      dashboard: {
        totalProducts,
        totalDealers,
        totalProducts,
        totalPurchase,
        totalSales,

        purchaseAmount,
        salesAmount,
        totalProfit,

        availableStock,
        lowStockProducts,
        outOfStock,

        todaysDate,
        todaysPurchaseAmount,
        todaysSalesAmount,

        monthlyPurchase,
        monthlySales,

        recentPurchase,
        recentSales,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
