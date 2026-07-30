import Dealers from "../Models/DealerModal.js";

export const postDealer = async (req, res) => {
  try {
    const {
      dealerName,
      contactPerson,
      contactNumber,
      email,
      city,
      GSTNumber,
      state,
      pincode,
      status,
    } = req.body;

    if (
      !dealerName ||
      !contactPerson ||
      !contactNumber ||
      !email ||
      !city ||
      !GSTNumber ||
      !state ||
      !pincode ||
      !status
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are mandatory" });
    }

    const existDealer = await Dealers.findOne({
      $or: [{ email }, { GSTNumber }],
    });

    if (existDealer) {
      if (existDealer.email === "email") {
        return res
          .status(409)
          .json({ success: false, message: "Dealer already exists" });
      }

      if (existDealer.GSTNumber === "GSTNumber") {
        return res
          .status(409)
          .json({ success: false, message: "GST Number is already exists" });
      }
    }

    const newDealer = await Dealers.create(req.body);

    res.status(201).json({
      success: true,
      message: "Dealer Created Successfully...",
      dealer: newDealer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal Server Error",
    });
  }
};

export const getDealers = async (req, res) => {
  try {
    const {
      search = "",
      status = "",
      sort = "newest",
      page = 1,
      limit = 10,
    } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { dealerName: { $regex: search, $options: "i" } },
        { contactNumber: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
      ];
    }

    if (status) {
      query.status = status;
    }

    let sortOption = {};

    switch (sort) {
      case "name_asc":
        sortOption = { dealerName: 1 };
        break;

      case "name_desc":
        sortOption = { dealerName: -1 };
        break;

      case "oldest":
        sortOption = { dealerName: 1 };
        break;

      default:
        sortOption = { createdAt: -1 };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const dealers = await Dealers.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const totalDealers = await Dealers.countDocuments(query);

    res.status(200).json({
      success: true,
      dealers,
      totalDealers,
      totalPages: Math.ceil(totalDealers / Number(limit)),
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

export const getDealerID = async (req, res) => {
  try {
    const { id } = req.params;

    const dealer = await Dealers.findById(id);

    if (!dealer) {
      res.status(404).json({ success: false, message: "Dealer not found..." });
    }

    res.status(200).json({ success: true, dealer });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const updateDealers = async (req, res) => {
  try {
    const { id } = req.params;

    const dealer = await Dealers.findById(id);

    if (!dealer) {
      res.status(404).json({ success: false, message: "Dealer not found" });
    }

    const updateDealer = await Dealers.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Dealer Update Successfully...",
      dealer: updateDealer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const deleteDealer = async (req, res) => {
  try {
    const { id } = req.params;

    const dealer = await Dealers.findById(id);

    if (!dealer) {
      res.status(404).json({ success: false, message: "Dealer not found" });
    }

    const deleteDealer = await Dealers.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Dealer Delete Successfully",
      dealer: deleteDealer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
