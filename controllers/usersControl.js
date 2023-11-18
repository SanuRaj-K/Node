const userModel = require("../schema/users");
const products = require("../schema/products");
const { authSchema } = require("../schema/validationSchema");
const { signAccessToken } = require("../middleware/jwt");
const asyncErrorHandler = require("../helpers/asyncErrorHandler");

/////////// View Products///////////

const getProducts = asyncErrorHandler(async (req, res) => {
  const data = await products.find();
  res.json(data);
});

//////////// View Product By Id////////////

const productsById = asyncErrorHandler(async (req, res) => {
  const id = req.params.id;
  const prod = await products.findById(id);
  res.json(prod);
});

///////// View Product by Category///////////

const productByCategory = asyncErrorHandler(async (req, res) => {
  const categoryName = req.query.category;
  const category = await products.find({ category: categoryName });
  if (category.length === 0) {
    res.status(404).send("No Items on This Category");
  } else {
    res.json(category);
  }
});

////////// View Cart////////////

const getCart = asyncErrorHandler(async (req, res) => {
  const id = req.params.id;
  const checking = await userModel.findById(id);
  res.send(checking.wish);
});

//////////// User login //////////////

const login = asyncErrorHandler(async (req, res, next) => {
  const result = await authSchema.validateAsync(req.body);
  const User = await userModel.findOne({ email: result.email });
  if (!User) {
    res.statusCode(422).json({ message: "Invalid username or password" });
  }
  const isMatch = await User.isValidPass(result.password);
  if (!isMatch) {
    res.send({ message: "Invalid username or password" });
  }
  const accessToken = await signAccessToken(User.id);
  res.cookie("jwt", accessToken);
  res.send("Login Successfully....");
});

////////// Register///////////////

const register = asyncErrorHandler(async (req, res, next) => {
  const result = await authSchema.validateAsync(req.body);
  const userExist = await userModel.findOne({ email: result.email });
  if (userExist) {
    res.status(409).send(`${userExist.email} is already exist`);
  } else {
    const user = await userModel.create(result);
    const accessToken = await signAccessToken(user.id);
    res.cookie("registercookie", accessToken);
    res.send("Successfully regiserd");
  }
});

//////////// adding item to  Cart By Id//////////////////

const cartByIdPost = asyncErrorHandler(async (req, res) => {
  const id = req.params.id;
  const prodId = req.body.id;
  const addProd = await products.findById(prodId);
  const user = await userModel.findById(id);
  const isExtst = user.cart.find((item) => item._id == prodId);
  if (isExtst) {
    res.send("Item is already in Cart");
  } else {
    user.cart.push(addProd);
    await user.save();
    res.json(user);
  }
});

////////////// wishlist//////////////

const wishlist = asyncErrorHandler(async (req, res) => {
  const id = req.params.id;
  const checking = await userModel.findById(id);
  const wish = checking.wishlist.length;
  if (wish === 0) {
    res.send("No wishlist Items");
  } else {
    res.send(checking.wishlist);
  }
});

//////////////// Add to wishlist /////////////
const addToWishlist = asyncErrorHandler(async (req, res) => {
  const id = req.params.id;
  const prodId = req.body.id;
  const addProd = await products.findById(prodId);
  const user = await userModel.findById(id);
  const isExtst = user.wishlist.find((item) => item._id == prodId);
  if (isExtst) {
    res.send("Item is already in wishlist");
  } else {
    user.wishlist.push(addProd);
    await user.save();
    res.json(user.wishlist);
  }
});

////////////// delete whishlist ////////////

const deleteWishlist = asyncErrorHandler(async (req, res) => {
  const id = req.params.id;
  const prodId = req.body.id;
  const user = await userModel.findById(id);
  const deleteItem = user.wishlist.filter((item) => item._id != prodId);
  const isExtst = user.wishlist.find((item) => item._id == prodId);

  if (!isExtst) {
    res.send("Product is not exist");
  } else {
    const upatedUser = await userModel.findByIdAndUpdate(
      id,
      {
        $set: { wishlist: deleteItem },
      },
      { new: true }
    );
    await upatedUser.save()
    res.json({
      message: "product successfully deleted",
      data: upatedUser.wishlist,
    });
  }
});

module.exports = {
  getProducts,
  productsById,
  productByCategory,
  getCart,
  login,
  register,
  cartByIdPost,
  wishlist,
  addToWishlist,
  deleteWishlist,
};
