import express from "express";
import { body } from "express-validator";

import {
  register,
  login
} from "../controllers/authController.js";

const router = express.Router();


// REGISTER ROUTE
router.post(
  "/register",
  [
    body("email")
      .isEmail()
      .withMessage("Valid email required"),

    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters")
  ],
  register
);


// LOGIN ROUTE
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Valid email required"),

    body("password")
      .notEmpty()
      .withMessage("Password required")
  ],
  login
);

export default router;