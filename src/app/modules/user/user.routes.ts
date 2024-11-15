import express from "express";
import { userController } from "./user.controller";

const router = express.Router();

// Route to create a new user (Admin, Trainer, Trainee)
router.post("/create", userController.createUser);

// Route for user login
router.post("/login", userController.loginUser);

// Route to get the profile of a specific user
router.get("/profile/:userId", userController.getProfile);

// Route to get all trainers (Admin role access only)
router.get("/trainers", userController.getAllTrainers);

// Route to get all classes assigned to a specific trainer
router.get("/trainer/:trainerId/classes", userController.getTrainerClasses);

// Route to get available classes that trainees can book
router.get("/classes/available", userController.getAvailableClasses);

// Route to book a class for a trainee
router.post("/classes/book", userController.bookClass);

export const userRoutes = router;
