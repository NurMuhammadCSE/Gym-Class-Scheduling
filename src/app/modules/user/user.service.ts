import { UserRole } from "@prisma/client";
import * as bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";
import jwt from "jsonwebtoken";

const createUser = async (data: any) => {
  const hashedPassword: string = await bcrypt.hash(data.password, 12);

  const userData = {
    email: data.email,
    password: hashedPassword,
    fullName: data.fullName,
    role: UserRole.ADMIN,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    const createdUser = await transactionClient.user.create({
      data: userData,
    });
    return createdUser;
  });

  return result;
};

const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );
  return { token, user };
};

const getProfile = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
    },
  });
  return user;
};

const getTrainers = async () => {
  const trainers = await prisma.user.findMany({
    where: { role: UserRole.TRAINER },
    select: {
      id: true,
      email: true,
      fullName: true,
    },
  });
  return trainers;
};

const getTrainerClasses = async (trainerId: number) => {
    const classes = await prisma.class.findMany({
        where: { trainerId },
        select: {
            id: true,
            date: true,
            duration: true,
            trainees: {
                select: {
                    id: true,
                    fullName: true
                }
            }
        }
    });
    return classes;
};

const getAvailableClasses = async () => {
    const classes = await prisma.class.findMany({
        where: {
            trainees: {
                some: {
                    id: {
                        lt: 10
                    }
                }
            }
        },
        select: {
            id: true,
            date: true,
            duration: true,
            trainees: {
                select: {
                    id: true,
                    fullName: true
                }
            }
        }
    });
    return classes;
};


const bookClass = async (classId: number, traineeId: number) => {
  const classDetails = await prisma.class.findUnique({
    where: { id: classId },
    include: { trainees: true },
  });

  if (!classDetails || classDetails.trainees.length >= 10) {
    throw new Error("Class is full or does not exist.");
  }

  const result = await prisma.$transaction(async (transactionClient) => {
    const updatedClass = await transactionClient.class.update({
      where: { id: classId },
      data: { trainees: { connect: { id: traineeId } } },
    });
    return updatedClass;
  });

  return result;
};

export const userService = {
  createUser,
  loginUser,
  getProfile,
  getTrainers,
  getTrainerClasses,
  getAvailableClasses,
  bookClass,
};
