
import express from "express";

import {
  getAllQualifications,
  getQualificationById,
  createQualification,
  updateQualification,
  deleteQualification,
  deleteAllQualifications
} from "../controllers/education.controller.js";

import {
  requireSignin,
  requireAdmin
} from "../controllers/auth.controller.js";

const router = express.Router();

// Everyone can view qualifications.
router.get("/", getAllQualifications);
router.get("/:id", getQualificationById);

// Only Admins can make changes.
router.post("/", requireSignin, requireAdmin, createQualification);
router.put("/:id", requireSignin, requireAdmin, updateQualification);
router.delete("/:id", requireSignin, requireAdmin, deleteQualification);
router.delete("/", requireSignin, requireAdmin, deleteAllQualifications);

export default router;
