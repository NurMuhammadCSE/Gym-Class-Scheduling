import express from "express";
import { classController } from "./class.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

// Route to create a new class (Admin only)
router.post("/class-create", auth(UserRole.TRAINER), classController.createClass);

// Route to get all classes (for trainers, trainees, or admins)
router.get("/", classController.getClasses);

// Route for a trainee to book a class
router.post("/book", classController.bookClass);

export const classRoutes = router;
