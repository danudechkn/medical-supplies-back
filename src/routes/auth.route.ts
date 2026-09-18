import express from "express";
import { AuthController } from "../controllers/auth/auth.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = express.Router();
// const apiLogger = require("../middleware/apiLogger");
// const {
//   authenticateToken,
//   authorizeRole,
// } = require("../middleware/authMiddleware");

//route
// router.use(authenticateToken, apiLogger, authorizeRole(1));

// router.get("/mapAll", AllChoiceController.mapAll);
router.post("/login", AuthController.login)
router.get("/me", authenticateToken, AuthController.getMe)

export default router;
