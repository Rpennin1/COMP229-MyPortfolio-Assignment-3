
import jwt from "jsonwebtoken";
import User from "../user.js";
import config from "../../config/config.js";
import { expressjwt } from "express-jwt";

// POST /auth/signin
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    // Find the user and include their password hash
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).select("+hashed_password");

    // Temporary diagnostic checks
    console.log("User found:", Boolean(user));

    const passwordMatches = user
      ? await user.authenticate(password)
      : false;

    console.log("Password matches:", passwordMatches);

    if (!user || !passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Create authentication token
    const token = jwt.sign(
      { _id: user._id.toString() },
      config.jwtSecret,
      { expiresIn: "1h" }
    );

    // Store token in cookie
    res.cookie("t", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000,
    });

    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("Sign-in error:", error);
    return res.status(500).json({
      message: "Unable to sign in.",
    });
  }
};

// GET /auth/signout
export const signout = (req, res) => {
  res.clearCookie("t");
  return res.json({
    message: "Signed out successfully.",
  });
};

// Authentication middleware
const requireSignin = expressjwt({
  secret: config.jwtSecret,
  algorithms: ["HS256"],
  requestProperty: "auth",
});

export { requireSignin };

// Check whether the signed-in user owns the requested profile
export const hasAuthorization = (req, res, next) => {
  const authorized =
    req.auth &&
    req.profile &&
    req.auth._id === req.profile._id.toString();

  if (!authorized) {
    return res.status(403).json({
      message: "You are not authorized to perform this action.",
    });
  }

  next();
};

// Check whether the signed-in user is an admin
export const requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.auth._id);

    if (!user || user.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required.",
      });
    }

    next();

  } catch (error) {
    console.error("Admin verification error:", error);
    return res.status(500).json({
      message: "Unable to verify admin permissions.",
    });
  }
};
