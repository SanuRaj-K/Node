const userModel = require("../schema/users");
const products = require("../schema/products");
const { authSchema } = require("../schema/validationSchema");
const { signAccessToken } = require("../middleware/jwt");
const asyncErrorHandler = require("../helpers/asyncErrorHandler");
const customError = require("../helpers/coustomError");

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
//////////// User login //////////////

const login = asyncErrorHandler(async (req, res, next) => {
  const result = await authSchema.validateAsync(req.body);
  const User = await userModel.findOne({ email: result.email });
  if (!User) {
    res.status(422).json({ message: "Invalid username or password" });
  }
  const isMatch = await User.isValidPass(result.password);
  if (!isMatch) {
    res.send({ message: "Invalid username or password" });
  }
  const accessToken = await signAccessToken(User.id);
  res.cookie("jwt", accessToken);
  res.send("Login Successfully....");
});

//////////// adding item to  Cart By Id//////////////////

const cartByIdPost = asyncErrorHandler(async (req, res) => {
  const id = req.params.id;
  const prodId = req.body.id;
  const addProd = await products.findById(prodId);
  const user = await userModel.findById(id);
  const isExtst = user.cart.find((item) => item._id == prodId);
  if (isExtst) {
    res.status(404).send("Item is already in Cart");
  } else {
    user.cart.push(addProd);
    await user.save();
    res.json(user);
  }
});
/////////// View Products///////////

const getProducts = asyncErrorHandler(async (req, res, next) => {
  const data = await products.find();
  if (!data) {
    const err = new customError("products not found", 404);
    return next(err);
  }
  res.json(data);
});

//////////// View Product By Id////////////

const productsById = asyncErrorHandler(async (req, res, next) => {
  const id = req.params.id;
  const prod = await products.findById(id);
  if (!prod) {
    const err = new customError("Product not Found", 404);
    return next(err);
  } else {
    res.json(prod);
  }
});

///////// View Product by Category///////////

const productByCategory = asyncErrorHandler(async (req, res, next) => {
  const categoryName = req.query.category;
  const category = await products.find({ category: categoryName });
  if (category.length === 0) {
    const err = new customError("No Items on This Category", 404);
    return next(err);
  } else {
    res.json(category);
  }
});

////////// View Cart////////////

const getCart = asyncErrorHandler(async (req, res, next) => {
  const id = req.params.id;
  const checking = await userModel.findById(id);
  if (!checking) {
    const err = new customError("Your cart is empty", 404);
    next(err)
  } else {
    res.send(checking.wish);
  }
});

////////////// wishlist//////////////

const wishlist = asyncErrorHandler(async (req, res, next) => {
  const id = req.params.id;
  const checking = await userModel.findById(id);
  const wish = checking.wishlist.length;
  if (wish === 0) {
    const err= new customError("No wishlist Items", 404)
    return next(err)
  } else {
    res.send(checking.wishlist);
  }
});

//////////////// Add to wishlist /////////////
const addToWishlist = asyncErrorHandler(async (req, res, next) => {
  const id = req.params.id;
  const prodId = req.body.id;
  const addProd = await products.findById(prodId);
  const user = await userModel.findById(id);
  const isExtst = user.wishlist.find((item) => item._id == prodId);
  if (isExtst) {
    const err= new customError("Item is already in wishlist", 409)
    return next(err)
  } else {
    user.wishlist.push(addProd);
    await user.save();
    res.json(user.wishlist);
  }
});

////////////// delete whishlist ////////////

const deleteWishlist = asyncErrorHandler(async (req, res, next) => {
  const id = req.params.id;
  const prodId = req.body.id;
  const user = await userModel.findById(id);
  const deleteItem = user.wishlist.filter((item) => item._id != prodId);
  const isExtst = user.wishlist.find((item) => item._id == prodId);

  if (!isExtst) {
    const err= new customError("Product is not exist", 404)
    return next(err)
  } else {
    const upatedUser = await userModel.findByIdAndUpdate(
      id,
      {
        $set: { wishlist: deleteItem },
      },
      { new: true }
    );
    await upatedUser.save();
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
