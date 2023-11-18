const express = require("express");
const router = express.Router();
const { adminAuth } = require("../middleware/adminAuth");
const adminControl = require("../controllers/adminControl");
const multer = require("../middleware/multer");

router.post("/login", adminControl.adminLogin);
router.get("/users", adminAuth, adminControl.adminUsers);
router.get("/users/:id", adminAuth, adminControl.adminUserById);
router.get("/products", adminAuth, adminControl.adminProducts);
router.get("/product", adminAuth, adminControl.adminCategoryProduct);
router.get("/product/:id", adminAuth, adminControl.adminProductById);
router.post(
  "/addproduct",
  adminAuth,
  multer.single("image"),
  adminControl.adminAddProduct
);    
router.get("/orders", adminAuth, adminControl.adminOrders);
router.get("/stats", adminAuth, adminControl.adminStats);
router.delete("/products/:id", adminAuth, adminControl.adminDeleteProduct);
router.put(
  "/update/:id",
  adminAuth,
  multer.single("image"),
  adminControl.adminUpdateProduct
);

module.exports = router;
