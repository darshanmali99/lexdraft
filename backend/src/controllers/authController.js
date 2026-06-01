import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import pool from "../config/db.js";


// REGISTER USER
export const register = async (req, res) => {

  try {

    // VALIDATION CHECK
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // CHECK IF USER EXISTS
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // INSERT USER
    const newUser = await pool.query(
      `INSERT INTO users 
      (email, password_hash)
      VALUES ($1, $2)
      RETURNING id, email, role`,
      [email, hashedPassword]
    );

    res.status(201).json({
      success: true,
      user: newUser.rows[0]
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


// LOGIN USER
export const login = async (req, res) => {

  try {

    // VALIDATION CHECK
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // FIND USER
    const userQuery = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (userQuery.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const user = userQuery.rows[0];

    // COMPARE PASSWORD
    const validPassword = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // GENERATE JWT TOKEN
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN
      }
    );

    res.json({
      success: true,
      token
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};