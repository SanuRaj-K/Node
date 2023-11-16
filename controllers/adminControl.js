
const { signAccessToken } = require("../controllers/jwt");
const userModel = require("../schema/users");
const Products = require("../schema/products");
const errorHandler= require("../helpers/errorHandler")

const cloudinary = require("../cloudinary");
const admin = {
  username: "sanu",
  password: "1234",
};

////// Admin login/////////////

const adminLogin = async (req, res) => {
  const data = req.body;
  const validation = data.password === admin.password;
  const accessToken = await signAccessToken(admin.password);
  res.cookie("adminAuth", accessToken);
  if (validation) {
    res.status(200).json({
      status: "success",
      message: "Successfully logged In.",
      data: { jwt_token: accessToken },
    });
  } else {
    res.send("Invalid Admin");
  }
};

/////////// Viwew user by Id//////////

const adminUserById =  async (req, res) => {
  const id = req.params.id;
  const users = await userModel.findById(id);
  res.status(200).json({
    status: "success",
    message: "Successfully fetched user datas.",
    data: users,
  });
};

/////// View all Users//////////////

const adminUsers =  async (req, res) => {
  const data = await userModel.find();
  res.json(data);
};

//////////// View all Products///////////

const adminProducts = async (req, res) => {
  const products = await Products.find();
  res.status(200).json({
    status: "success",
    message: "Successfully fetched products detail.",
    data: products,
  });
};

///////////// View Products by Caterory///////////

const adminCategoryProduct = async (req, res) => {
  const category = req.query.category;
  const prod = await Products.find({ category: category });
  res.status(200).json({
    status: "success",
    message: "Successfully fetched products detail.",
    data: prod,
  });
};

/////////// View Product By Id/////////

const adminProductById = async (req, res) => {
  const id = req.params.id;
  const product = await Products.findById(id);
  res.status(200).json({
    status: "success",
    message: "Successfully fetched product details.",
    data: product,
  });
};

///////////// Add Product///////////

const adminAddProduct = async (req, res) => {
  const { title, description, price, category } = req.body;
  const exsitingProd = await Products.findOne({ title: title });
  if (!exsitingProd) {
    const adding = await cloudinary.uploader.upload(req.file.path);
    const added = await Products.create({
      title,
      description,
      price,
      category,
      image: adding.url,
    });
    res.status(201).json({
      status: "success",
      message: "Successfully created a product.",
      data: added,
    });
  } else {
    res.send("Proudct already exist");
  }
};

////////////// View Order Details///////////

const adminOrders = async (req, res) => {
  const order = await userModel.find();
  const orderDetails = await order.map((item) => item.orders);
  const usersWithOrders = orderDetails.filter((user) => user.length > 0);

  res.json({
    status: "success",
    message: "Successfully fetched order detail.",
    data: usersWithOrders,
  });
};

//////////// View  User States//////////////

const adminStats = async (req, res) => {
  const order = await userModel.find();
  const orderDetails = order.flatMap((item) => item.orders);

  const total = orderDetails.map((item) => item.totalAmount);

  const totalRevenue = total.reduce((total, price) => total + price, 0);

  const item = orderDetails.map((i) => i.items);

  let totalQuantity = 0;

  for (const orderGroup of item) {
    for (const order of orderGroup) {
      totalQuantity += order.quantity;
    }
  }
  res.json({
    status: "success",
    message: "Successfully fetched stats.",
    data: {
      totalProductSold: totalQuantity,
      totalRevenue: totalRevenue,
    },
  });
};

/////////////// Delete Products//////////////

const adminDeleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const prod = await Products.deleteOne({ _id: id });

    if (prod.deletedCount === 0) {
      res.send("product does not exist");
    } else {
      res.json({
        status: "success",
        message: "Successfully deleted a product.",
      });
    }
  } catch (err) {
    res.send("product not found");
  }
};

//////////// Update Product//////////////

const adminUpdateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const isExist = await Products.findById(id);
    const { title, description, price, category } = req.body;
    if (isExist) {
      const adding = await cloudinary.uploader.upload(req.file.path);

      const updating = await Products.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            title: title,
            description: description,
            price: price,
            category: category,
            image: adding.url,
          },
        }
      );
      res.json({
        status: "success",
        message: "Successfully updated a product.",
        data: updating,
      });
    }
  } catch (err) {
    res.send(`Error occored:  ${err}`);
  }
};

module.exports = {
  adminAddProduct,
  adminDeleteProduct,
  adminLogin,
  adminOrders,
  adminProductById,
  adminProducts,
  adminStats,
  adminUserById,
  adminCategoryProduct,
  adminUsers,
  adminUpdateProduct,
};
