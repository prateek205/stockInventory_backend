import Products from "../Models/ProductModal.js";

export const getInventory = async (req, res) => {
  try {
    const {
      search = "",
      status = "",
      page = 1,
      limit = 10,
      sort = "newest",
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        {
          productName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          category: {
            $regex: search,
            $options: "i",
          },
        },
        {
          brand: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const skip = (pageNumber - 1) * limitNumber;

    const sortOptions = {
      name_asc: {
        productName: -1,
      },
      name_desc: {
        productName: 1,
      },
      stock_high: {
        currentStock: -1,
      },
      stock_low: {
        currentStock: 1,
      },
      price_high: {
        sellPrice: -1,
      },
      price_low: {
        sellPrice: 1,
      },
      newest: {
        createdAt: -1,
      },
      oldest: {
        createdAt: 1,
      },
    };

    const sortOption = sortOptions[sort] || sortOptions.newest;

    const products = await Products.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber)
      .lean();

    const totalProducts = await Products.countDocuments(query);

    const inventory = products.map((product) => {
      const currentStock = Number(product.currentStock || 0);
      const minStock = Number(product.minStock || 0);

      let stockStatus;

      if (currentStock === 0) {
        stockStatus = "Out of Stock";
      } else if (currentStock <= minStock) {
        stockStatus = "Low Stock";
      } else {
        stockStatus = "In Stock";
      }

      return {
        ...product,
        stockStatus,
      };
    });

    const totalQuantityResult = await Products.aggregate([
      {
        $group: {
          _id: null,
          totalQuantity: {
            $sum: "$stock",
          },
        },
      },
    ]);

    const totalQuantity = totalQuantityResult[0]?.totalQuantity || 0;

    const lowStockProducts = await Products.countDocuments({
      stock: {
        $gt: 0,
        $lte: 5,
      },
    });

    const outOfStock = await Products.countDocuments({
      stock: 0,
    });

    const inStock = await Products.countDocuments({
      stock: {
        $gt: 5,
      },
    });

    res.status(200).json({
      success: true,

      inventory,

      summary: {
        totalProducts,
        totalQuantity,
        inStock,
        lowStockProducts,
        outOfStock,
      },

      pagination: {
        currentPage: pageNumber,
        limit: limitNumber,
        totalProducts,
        totalPages: Math.ceil(totalProducts / limitNumber),
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
