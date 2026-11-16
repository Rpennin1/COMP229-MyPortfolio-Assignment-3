
import express from "express";

import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  deleteAllProjects
} from "../controllers/project.controller.js";

import {
  requireSignin,
  requireAdmin
} from "../controllers/auth.controller.js";

const router = express.Router();

// Everyone can view projects.
router.get("/", getAllProjects);
router.get("/:id", getProjectById);

// Only Admins can make changes.
router.post("/", requireSignin, requireAdmin, createProject);
router.put("/:id", requireSignin, requireAdmin, updateProject);
router.delete("/:id", requireSignin, requireAdmin, deleteProject);
router.delete("/", requireSignin, requireAdmin, deleteAllProjects);

export default router;
