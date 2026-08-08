import Customers from "../Models/CustomerModal.js";

export const createCustomer = async (req, res) => {
  try {
    const {
      customerName,
      contact,
      email,
      vehicleNumber,
      vehicleModal,
      city,
      state,
      pincode,
      status,
    } = req.body;

    if (
      !customerName ||
      !contact ||
      !email ||
      !vehicleNumber ||
      !vehicleModal ||
      !city ||
      !state ||
      !pincode ||
      !status
    ) {
      return res
        .status(404)
        .json({ success: false, message: "All fields are mandatory..." });
    }

    const existsCustomer = await Customers.findOne({ vehicleNumber });

    if (existsCustomer) {
      return res
        .status(409)
        .json({ success: false, message: "Customer already exists..." });
    }

    const newCustomer = await Customers.create(req.body);

    res.status(201).json({
      success: true,
      message: "New Customer is Created Successfully...",
      customer: newCustomer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getCustomers = async (req, res) => {
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
        { customerName: { $regex: search, $options: "i" } },
        { vehicleNumber: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    let sortOptions = {};

    switch (sort) {
      case "name_asc":
        sortOptions = { customerName: 1 };
        break;

      case "name_desc":
        sortOptions = { customerName: -1 };
        break;

      case "oldest":
        sortOptions = { customerName: 1 };
        break;

      default:
        sortOptions = { createdAt: -1 };
    }

    const skip = Number(page - 1) * Number(limit);

    const customer = await Customers.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    const totalCustomers = await Customers.countDocuments(query);

    res.status(200).json({
      success: true,
      count: customer.length,
      customer,
      totalCustomers,
      totalPage: Math.ceil(totalCustomers / Number(limit)),
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

export const getCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customers.findById(id);

    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }

    res.status(200).json({ success: true, customer });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customers.findById(id);
    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: "Customer Not Found..." });
    }

    const updatedCustomer = await Customers.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Customer update successfully...",
      customer: updateCustomer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customers.findById(id);

    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }

    const removeCustomer = await Customers.findByIdAndDelete(id);

    res
      .status(200)
      .json({ success: true, message: "customer deleted successfully..." });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
