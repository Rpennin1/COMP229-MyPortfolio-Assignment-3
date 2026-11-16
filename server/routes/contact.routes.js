
import express from "express";

import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  deleteAllContacts
} from "../controllers/contact.controller.js";

import {
  requireSignin,
  requireAdmin
} from "../controllers/auth.controller.js";

const router = express.Router();

// Everyone can view contacts.
router.get("/", getAllContacts);
router.get("/:id", getContactById);

// Only Admins can make changes.
router.post("/", requireSignin, requireAdmin, createContact);
router.put("/:id", requireSignin, requireAdmin, updateContact);
router.delete("/:id", requireSignin, requireAdmin, deleteContact);
router.delete("/", requireSignin, requireAdmin, deleteAllContacts);

export default router;
