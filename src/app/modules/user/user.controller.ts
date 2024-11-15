import { NextFunction, Request, RequestHandler, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { userService } from "./user.service";

// Controller to create a new user
const createUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await userService.createUser(req.body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User created successfully!",
      data: result,
    });
  }
);

// Controller to login user
const loginUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await userService.loginUser(email, password);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Login successful!",
      data: result,
    });
  }
);

// Controller to get the profile of a user
const getProfile: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const userId = Number(req.params.userId);
    const result = await userService.getProfile(userId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User profile retrieved successfully!",
      data: result,
    });
  }
);

// Controller to get all trainers
const getAllTrainers: RequestHandler = catchAsync(
  async (_req: Request, res: Response) => {
    const result = await userService.getTrainers();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Trainers retrieved successfully!",
      data: result,
    });
  }
);

// Controller to get all classes for a specific trainer
const getTrainerClasses: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const trainerId = Number(req.params.trainerId);
    const result = await userService.getTrainerClasses(trainerId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Trainer classes retrieved successfully!",
      data: result,
    });
  }
);

// Controller to get available classes
const getAvailableClasses: RequestHandler = catchAsync(
  async (_req: Request, res: Response) => {
    const result = await userService.getAvailableClasses();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Available classes retrieved successfully!",
      data: result,
    });
  }
);

// Controller to book a class for a trainee
const bookClass: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { classId, traineeId } = req.body;
    const result = await userService.bookClass(classId, traineeId);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Class booked successfully!",
      data: result,
    });
  }
);

export const userController = {
  createUser,
  loginUser,
  getProfile,
  getAllTrainers,
  getTrainerClasses,
  getAvailableClasses,
  bookClass,
};
