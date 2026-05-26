const express = require("express");
const router = express.Router();
const multer = require("multer");
const authMiddleware = require("../middleware/auth.middleware");

const authController = require("../controllers/auth.controller")


const upload = multer({ storage: multer.memoryStorage() });

router.post("/register", upload.single("avatar"), authController.authRegistrationController)
router.post("/login", authController.authLoginController)
router.get("/logout", authController.authLogoutController)
router.get("/me", authMiddleware.authMiddleware, authController.getMeController)

module.exports = router;