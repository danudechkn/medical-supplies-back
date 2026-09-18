import { Router } from "express";
import { SuppliesController } from "../controllers/supplies.controller";
import { authenticateToken } from "../middleware/auth.middleware";

// import { AllInOneController } from "../controllers/all_in_one/allInOne.controller";

const router = Router();
router.use(authenticateToken);
// const apiLogger = require("../middleware/apiLogger");
// const {
//   authenticateToken,
//   authorizeRole,
// } = require("../middleware/authMiddleware");

//route
// router.use(authenticateToken, apiLogger, authorizeRole(1));

// router.get("/mapAll", AllChoiceController.mapAll);
// router.get("/all-in-one", AllInOneController.index);
router.post("/create-item", SuppliesController.createItem);
router.get("/get-item", SuppliesController.index);
router.get("/get-item/:id", SuppliesController.getItemByID);
router.put("/update-item/:id", SuppliesController.updateItem);


export default router;
