const express = require("express");
const userModel = require("../schema/users");
const products = require("../schema/products");
const { authSchema } = require("../schema/validationSchema");
const { signAccessToken } = require("../controllers/jwt");

/////////// View Products///////////

const getProducts = async (req, res) => {
  const data = await products.find();
  res.json(data);
};

//////////// View Product By Id////////////

const productsById = async (req, res) => {
  const id = req.params.id;
  const prod = await products.findById(id);
  res.json(prod);
};

///////// View Product by Category///////////

const productByCategory = async (req, res) => {
  const categoryName = req.params.categoryname;
  const category = await products.find({ category: categoryName });
  if (category.length === 0) {
    res.status(404).send("No Items on This Category");
  } else {
    res.json(category);
  }
};

////////// View Cart////////////

const getCart = async (req, res) => {
  const id = req.params.id;
  const checking = await userModel.findById(id);
  res.send(checking.cart);
};

//////////// User login //////////////

const login = async (req, res, next) => {
  try {
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
  } catch (err) {
    next(err);
  }
};

////////// Register///////////////

const register = async (req, res, next) => {
  try {
    const result = await authSchema.validateAsync(req.body);

    const userExist = await userModel.findOne({ email: result.email });
    if (userExist) {
      res.status(409).send(`${userExist.email} is already exist`);
    } else {
      const user = await userModel.create(result);
      const accessToken = await signAccessToken(user.id);
      res.cookie(accessToken);
      res.send("Successfully regiserd");
    }
  } catch (err) {
    next(err);
  }
};

//////////// View Cart By Id//////////////////

const cartById = async (req, res) => {
  const id = req.params.id;
  const user = await userModel.findById(id);
  const cartItems = req.body;

  const isExist = await user.cart.find((item) => item.item === cartItems.item);
  if (isExist) {
    res.send("item already added");
  } else {
    user.cart.push(cartItems);
    await user.save();
    res.json(cartItems);
  }
};

////////////// wishlist//////////////

const wishlistById = async (req, res) => {
  const id = req.params.id;
  const user = await userModel.findById(id);
  const whishItems = req.body;
  const isExist = await user.wishlist.find(
    (item) => item.item === whishItems.item
  );
  if (isExist) {
    res.send("item already added");
  } else {
    user.wishlist.push(whishItems);
    await user.save();
    res.json(whishItems);
  }
};

module.exports = {
  getProducts,
  productsById,
  productByCategory,
  getCart,
  login,
  register,
  cartById,
  wishlistById,
};
