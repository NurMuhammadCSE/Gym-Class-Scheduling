import { Request, Response, NextFunction, RequestHandler } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { classService } from "./class.service";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import ApiError from "../../errors/ApiError";

const createClass: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    // Retrieve the token from the Authorization header
    const token = req.headers.authorization; // Get token after 'Bearer'

    if (!token) {
      throw new ApiError(httpStatus.NOT_FOUND, "Not Found");
    }

    // Decode the token to extract trainerId
    const decodedToken = jwt.verify(token!, process.env.JWT_SECRET as string);
    console.log(decodedToken, token)
    const trainerId = decodedToken.id;

    // Pass the trainerId along with other data to the service
    const result = await classService.createClass({ ...req.body, trainerId });

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Class created successfully!",
      data: result,
    });
  }
);

const getClasses: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await classService.getClasses();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Classes retrieved successfully!",
      data: result,
    });
  }
);

const bookClass: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { classId, traineeId } = req.body;
    const result = await classService.bookClass(classId, traineeId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Class booked successfully!",
      data: result,
    });
  }
);

export const classController = {
  createClass,
  getClasses,
  bookClass,
};
