const express = require("express");
const router = express.Router();
const { authentication } = require("../middleware/authentication");
const userController = require("../controllers/usersControl");
router.get("/products", authentication, userController.getProducts);
router.get("/products/:id", authentication, userController.productsById);
router.get("/products/category/:categoryname",userController.productByCategory);
router.get("/:id/cart", authentication, userController.getCart);
router.get("/:id/wishlist", (req, res) => {});
router.post("/login", authentication, userController.login);
router.post("/register", userController.register);
router.post("/:id/cart", authentication, userController.cartById);
router.post("/:id/wishlist", authentication, userController.wishlistById);
// router.delete("/:id/wishlist", async(req, res) => {
//   const id= req.params.id;
//   const user = await userModel.deleteOne(id);
//   if(user.deletedCount===0){
//     res.send("user not found")
//   }else{
//     res.send('success...!')
//   }

// });
module.exports = router;
