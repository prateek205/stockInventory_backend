import Customers from "../Models/CustomerModal.js";
import Products from "../Models/ProductModal.js";
import Sales from "../Models/SalesModal.js";

export const createSales = async (req, res) => {
  try {
    const {
      invoiceNumber,
      customer,
      salesDate,
      items,
      itemDiscount,
      paymentMethod,
      remark,
    } = req.body;

    if (!invoiceNumber || !items || !customer || items.length === 0) {
      return res.status(404).json({
        success: false,
        message: "All required feilds are mandatory...",
      });
    }

    const existInvoiceNumber = await Sales.findOne({ invoiceNumber });

    if (existInvoiceNumber) {
      return res
        .status(404)
        .json({ success: false, message: "Invoice number already exists" });
    }

    const existCustomer = await Customers.findById(customer);

    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }

    let totalAmount = 0;
    const salesItem = [];

    for (const item of items) {
      const existItem = await Products.findById(item.product);

      if (!existItem) {
        return res
          .status(404)
          .json({ success: false, message: "Item not found" });
      }

      if (existItem.currentStock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${existItem.productName} has only ${existItem.currentStock} items in stock`,
        });
      }

      const subTotal = item.quantity * existItem.sellPrice;
      const discount = (subTotal * itemDiscount) / 100;
      const total = subTotal - discount;

      totalAmount += total;

      existItem.currentStock -= item.quantity;
      await existItem.save();

      salesItem.push({
        product: item.product,
        quantity: item.quantity,
        sellPrice: existItem.sellPrice,
        total,
      });
    }

    const sale = await Sales.create({
      invoiceNumber,
      customer,
      salesDate,
      items: salesItem,
      itemDiscount,
      totalAmount,
      paymentMethod,
      remark,
    });

    return res
      .status(201)
      .json({ success: true, message: "Sales Created successfully...", sale });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getSales = async (req, res) => {
  try {
    const {
      search = "",
      customer = "",
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

    if (customer) {
      query.customerName = customer;
    }

    if (paymentMethod) {
      query.paymentMethod = paymentMethod;
    }

    const sortOpt = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      invoice_asc: { invoiceNumber: -1 },
      invice_desc: { invoiceNumber: 1 },
      amt_high: { totalAmount: -1 },
      amt_low: { totalAmount: 1 },
    };

    const sortOptions = sortOpt[sort] || sortOpt.newest;

    const skip = (Number(page) - 1) * Number(limit);

    const sales = await Sales.find(query)
      .populate("customer")
      .populate("items.product")
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    const totalSales = await Sales.countDocuments(query);

    return res.status(200).json({
      success: true,
      count: sales.length,
      sales,
      totalSales,
      totalPages: Math.ceil(totalSales / Number(limit)),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getSale = async (req, res) => {
  try {
    const { id } = req.params;

    const sales = await Sales.findById(id)
      .populate("customer")
      .populate("item.product");

    if (!sales) {
      return res
        .status(404)
        .json({ success: false, message: "Sales not found" });
    }

    return res.status(200).json({ success: true, sales });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const updateSale = async (req, res) => {
  try {
    const { id } = req.params;

    const { invoiceNumber, customer, salesDate, items, paymentMethod, remark } =
      req.body;

    if (!invoiceNumber || !customer || !items || items.length === 0) {
      return res.status(409).json({
        success: false,
        message: "All required feilds are mandatory...",
      });
    }

    const existSales = await Sales.findById(id);

    if (!existSales) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }

    const existInvoiceNumber = await Sales.findOne({
      invoiceNumber,
      _id: { $ne: id },
    });

    if (existInvoiceNumber) {
      return res
        .status(409)
        .json({ success: false, message: "Invoice number already exists" });
    }

    for (const item of existSales.items) {
      const existProducts = await Products.findById(item.product);

      if (existProduct) {
        existProduct.currentStock += item.quantity;
        await existProduct.save();
      }
    }

    let totalAmount = 0;
    const salesItem = [];

    for (const item of items) {
      const existProduct = await Products.findById(item.product);

      if (!existProduct) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }

      if (existsProduct.currentStock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${existProduct.productName} has only ${existProduct.currentStock} items in stock`,
        });
      }

      const subTotal = item.quantity * existProduct.sellPrice;
      const discount = (subTotal * itemDiscount) / 100;
      const total = subtotal - discount;

      existProduct.currentStock -= item.quantity;
      await existProduct.save();

      salesItem.push({
        product: item.product,
        quantity: item.quantity,
        salePrice: existProduct.sellPrice,
        discount: item.discount,
        total,
      });
    }

    const updateSale = await Sales.findByIdAndUpdate(id, {
      invoiceNumber,
      customer,
      salesDate,
      items: salesItem,
      totalAmount,
      paymentMethod,
      remark,
    });

    return res
      .status(200)
      .json({ success: true, message: "Sales Update Successfully..." });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const removeSale = async (req, res) => {
  try {
    const { id } = req.params;

    const existSales = await Sales.findById(id);

    if (!existSales) {
      return res
        .status(404)
        .json({ success: false, message: "Sales not found" });
    }

    for (const item of existSales.items) {
      const existProduct = await Products.findById(item.product);

      if (existProduct) {
        existProduct.currentStock -= item.quantity;
        await existProduct.save();
      }
    }

    await Sales.findByIdAndDelete(id);

    return res
      .status(200)
      .json({ success: true, message: "Sales is deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
