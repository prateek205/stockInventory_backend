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

    const totalProfit = totalPurchaseAmount - totalSalesAmount ;

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
