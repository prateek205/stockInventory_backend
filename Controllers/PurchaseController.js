import Dealers from "../Models/DealerModal.js";
import Products from "../Models/ProductModal.js";
import Purchases from "../Models/PurchaseModal.js";

export const createPurchase = async (req, res) => {
  try {
    const {
      invoiceNumber,
      dealer,
      purchaseDate,
      item,
      totalAmount,
      paymentMethod,
      remark,
    } = req.body;

    if (!invoiceNumber || !dealer || !item || item.length === 0) {
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

    const existDealer = await Dealers.findOne({ dealer });

    if (existDealer) {
      return res
        .status(409)
        .json({ success: false, message: "Dealer is already exists" });
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
      search="",
      dealer="",
      paymentMethod="",
      sort="",
      page=1,
      limit=10,
    } = req.query;

    let query = {};

    if (search) {
      query.invoiceNumber = {
        $regex:search,
        $options:"i"
      };
    }

    if(dealer){
        query.dealer = dealer
    }

    if(paymentMethod){
        query.paymentMethod = paymentMethod
    }

    const sortOptions = {
        newest={createdAt: -1},
        oldest={createdAt: 1},
        invoice_asc={invoiceNumber: -1},
        invoice_desc={invoiceNumber: 1},
        amount_high={amount_high: -1},
        amount_low={amount_low: 1}
    }

    const sortOption = sortOptions[sort] || sortOptions.newest

    const skip = (Number(page) - 1) * Number(limit)

    const purchases = await Purchase.find(query)
    .populate("dealer")
    .populate("item.product")
    .sort(sortOption)
    .skip(skip)
    .limit(Number(limit))
    
    const totalPurchase = await Purchase.countDocument(query)

    res.status(200).json({success:true, count:purchases.length, purchases, totalPurchases, totalPages:Math.ceil(totalPurchase / Number(limit))})

  } catch (error) {
    res.status(500).json({success:false, message:"Internal Server Error", error:error.message})
  }
};

export const getPurchase = async (req, res) => {
    try {
        const {id} = req.params

        const purchases = await Purchase.findById(id).populate("dealer").populate("item.purchase")

        if(!purchases){
            return res.status(404).json({success:false, message:"Purchase not found"})
        }

        res.status(200).json({success:true, purchases})
    } catch (error) {
        res.status(500).json({success:false, message:"Internal Server Error", error:error.message})
    }
}

export const updatePurchase = async (req, res) => {
    try {
        const {id} = req.params

        const {
            invoiceNumber,
            dealer,
            purchaseDate,
            paymentMethod,
            remark,
            items
        } = req.body;

        if(!invoiceNumber || !dealer || !items || items.length === 0){
           return res.status(409).json({success:false, message:"All required fields are mandatory"})
        }

        const existPurchase = await Purchase.findById(id)

        if(!existPurchase){
            return res.status(404).json({success:false, message:"Purchase not found"})
        }

        const existDealer = await Purchase.findById(dealer)

        if(!existDealer){
            return res.status(404).json({success:false, message:"Dealer not found"})
        }

        const existInvoiceNumber = await Purchase.findOne({
            invoiceNumber,
            _id:{$ne:id}
        })

        if(existInvoiceNumber){
            return res.status(409).json({success:false, message:"Invoice already exist"})
        }

        


        const purchases = await Purchase.findById(id)
    } catch (error) {
        
    }
}
