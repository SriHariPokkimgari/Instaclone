import { Router } from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { sendMessage } from "../controllers/message.controller.js";

const router = Router();

router.post("/:id/send", isAuthenticated, sendMessage);
router.get("/:id/all", isAuthenticated, sendMessage);

export default router;
