import Dealers from "../Models/DealerModal.js";
import Products from "../Models/ProductModal.js";
import Purchases from "../Models/PurchaseModal.js";

export const createPurchase = async (req, res) => {
  try {
    const {
      invoiceNumber,
      dealer,
      purchaseDate,
      items,
      paymentMethod,
      remark,
    } = req.body;

    if (!invoiceNumber || !dealer || !items || items.length === 0) {
      return res
        .status(409)
        .json({ success: false, message: "All required fields are mandatory" });
    }

    const existInvoice = await Purchases.findOne({ invoiceNumber });

    if (existInvoice) {
      return res
        .status(409)
        .json({ success: false, message: "Invoice Number is already exists" });
    }

    const existDealer = await Dealers.findById(dealer);

    if (!existDealer) {
      return res
        .status(404)
        .json({ success: false, message: "Dealer not found" });
    }

    let totalAmount = 0;
    const purchaseItem = [];

    for (const item of items) {
      const existProduct = await Products.findById(item.product);

      if (!existProduct) {
        return res
          .status(404)
          .json({ success: false, message: "Item not found" });
      }

      const total = item.quantity * item.buyPrice;

      totalAmount += total;

      existProduct.currentStock += item.quantity;

      await existProduct.save();

      purchaseItem.push({
        product: item.product,
        quantity: item.quantity,
        buyPrice: item.buyPrice,
        total,
      });
    }

    const purchase = await Purchases.create({
      invoiceNumber,
      dealer,
      purchaseDate,
      items: purchaseItem,
      totalAmount,
      paymentMethod,
      remark,
    });

    res.status(201).json({
      success: true,
      message: "Purchase Created Successfully...",
      purchase,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getPurchases = async (req, res) => {
  try {
    const {
      search = "",
      dealer = "",
      paymentMethod = "",
      sort = "",
      page = 1,
      limit = 10,
    } = req.query;

    let query = {};

    if (search) {
      query.invoiceNumber = {
        $regex: search,
        $options: "i",
      };
    }

    if (dealer) {
      query.dealer = dealer;
    }

    if (paymentMethod) {
      query.paymentMethod = paymentMethod;
    }

    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      invoice_asc: { invoiceNumber: -1 },
      invoice_desc: { invoiceNumber: 1 },
      amount_high: { totalAmount: -1 },
      amount_low: { totalAmount: 1 },
    };

    const sortOption = sortOptions[sort] || sortOptions.newest;

    const skip = (Number(page) - 1) * Number(limit);

    const purchases = await Purchases.find(query)
      .populate("dealer")
      .populate("items.product")
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const totalPurchases = await Purchases.countDocuments(query);

    res.status(200).json({
      success: true,
      count: purchases.length,
      purchases,
      totalPurchases,
      totalPages: Math.ceil(totalPurchases / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getPurchase = async (req, res) => {
  try {
    const { id } = req.params;

    const purchases = await Purchases.findById(id)
      .populate("dealer")
      .populate("items.product");

    if (!purchases) {
      return res
        .status(404)
        .json({ success: false, message: "Purchase not found" });
    }

    res.status(200).json({ success: true, purchases });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const updatePurchase = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      invoiceNumber,
      dealer,
      purchaseDate,
      paymentMethod,
      remark,
      items,
    } = req.body;

    if (!invoiceNumber || !dealer || !items || items.length === 0) {
      return res
        .status(409)
        .json({ success: false, message: "All required fields are mandatory" });
    }

    const existPurchase = await Purchases.findById(id);

    if (!existPurchase) {
      return res
        .status(404)
        .json({ success: false, message: "Purchase not found" });
    }

    const existDealer = await Dealers.findById(dealer);

    if (!existDealer) {
      return res
        .status(404)
        .json({ success: false, message: "Dealer not found" });
    }

    const existInvoiceNumber = await Purchases.findOne({
      invoiceNumber,
      _id: { $ne: id },
    });

    if (existInvoiceNumber) {
      return res
        .status(409)
        .json({ success: false, message: "Invoice already exist" });
    }

    for (const item of existPurchase.items) {
      const existProduct = await Products.findById(item.product);

      if (existProduct) {
        existProduct.currentStock -= item.quantity;
        await existProduct.save();
      }
    }

    let totalAmount = 0;

    const purchaseItem = [];

    for (const item of items) {
      const existProduct = await Products.findById(item.product);

      if (!existProduct) {
        return res
          .status(409)
          .json({ success: false, message: "Item not found" });
      }

      const total = item.quantity * item.buyPrice;

      totalAmount += total;

      existProduct.currentStock += item.quantity;

      await existProduct.save();

      purchaseItem.push({
        product: item.product,
        quantity: item.quantity,
        buyPrice: item.buyPrice,
        total,
      });
    }

    const updatePurchase = await Purchases.findByIdAndUpdate(
      id,
      {
        invoiceNumber,
        dealer,
        purchaseDate,
        items: purchaseItem,
        totalAmount,
        paymentMethod,
        remark,
      },
      {
        new: true,
      },
    );

    res.status(200).json({
      success: true,
      message: "Purchase Update successfully...",
      purchase: updatePurchase,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const deletePurchase = async (req, res) => {
  try {
    const { id } = req.params;

    const existPurchase = await Purchases.findById(id);

    if (!existPurchase) {
      return res
        .status(404)
        .json({ success: false, message: "Purchase not found" });
    }

    for (const item of existPurchase.items) {
      const existProduct = await Products.findById(item.product);

      if (existProduct) {
        existProduct.currentStock -= item.quantity;
        await existProduct.save();
      }
    }

    await Purchases.findByIdAndDelete(id);

    return res
      .status(200)
      .json({ success: true, message: "Purchase delete successfully..." });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
