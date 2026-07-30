import Products from "../Models/ProductModal.js";

export const createProduct = async (req, res) => {
  try {
    const {
      productName,
      category,
      brand,
      itemNumber,
      buyPrice,
      sellPrice,
      currentStock,
      minStock,
      unit,
      imgUrl,
      status,
    } = req.body;

    if (
      !productName ||
      !category ||
      !brand ||
      !itemNumber ||
      !buyPrice ||
      !sellPrice ||
      !currentStock ||
      !minStock ||
      !unit ||
      !imgUrl ||
      !status
    ) {
      return res
        .status(404)
        .json({ success: false, message: "All Feilds are Mandatory..." });
    }

    const productExist = await Products.findOne({ itemNumber });

    if (productExist) {
      return res
        .status(409)
        .json({ success: false, message: "Product Already Exists" });
    }

    const newProduct = await Products.create(req.body);

    res.status(201).json({
      success: true,
      message: "Product Create Successfully....",
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getAllProduct = async (req, res) => {
  try {
    const {
      search = "",
      sort = "newest",
      status = "",
      page = 1,
      limit = 10,
    } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { productName: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
      ];
    }

    if (status) {
      query.status = status;
    }

    let sortOpt = {};

    switch (sort) {
      case "name_asc":
        sortOpt = { productName: 1 };
        break;

      case "name_desc":
        sortOpt = { productName: -1 };
        break;

      case "price_high":
        sortOpt = { sellPrice: -1 };
        break;

      case "price_low":
        sortOpt = { sellPrice: 1 };
        break;

      case "oldest":
        sortOpt = { productName: 1 };
        break;

      default:
        sortOpt = { createdAt: -1 };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const product = await Products.find(query)
      .sort(sortOpt)
      .skip(skip)
      .limit(Number(limit));

    const totalProducts = await Products.countDocuments(query);

    res.status(200).json({
      success: true,
      count: product.length,
      product,
      totalProducts,
      totalPage: Math.ceil(totalProducts / Number(limit)),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getProductId = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Products.findById(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "product not found" });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Products.findById(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product Not found" });
    }

    const deleteProduct = await Products.findByIdAndDelete(id);

    res
      .status(200)
      .json({
        success: true,
        message: "Product Deleted Successfully...",
        deleteProduct,
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
