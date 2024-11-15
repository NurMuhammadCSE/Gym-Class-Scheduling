import prisma from "../../../shared/prisma";

const createClass = async (data: any) => {
  const { date, duration, trainerId } = data;

  // Ensure max 5 classes per day validation
  const startOfDay = new Date(date).setHours(0, 0, 0, 0);
  const endOfDay = new Date(date).setHours(23, 59, 59, 999);

  const dailyClassCount = await prisma.class.count({
    where: {
      date: {
        gte: new Date(startOfDay),
        lte: new Date(endOfDay),
      },
    },
  });

  if (dailyClassCount >= 5) {
    throw new Error("Maximum daily class limit reached.");
  }

  const newClass = await prisma.class.create({
    data: {
      date,
      duration,
      trainerId,
    },
  });

  return newClass;
};

const getClasses = async () => {
  const classes = await prisma.class.findMany({
    include: {
      trainer: true,
      trainees: true,
    },
  });
  return classes;
};

const bookClass = async (classId: number, traineeId: number) => {
  const selectedClass = await prisma.class.findUnique({
    where: { id: classId },
    include: { trainees: true },
  });

  if (!selectedClass) {
    throw new Error("Class not found.");
  }

  if (selectedClass.trainees.length >= selectedClass.maxCapacity) {
    throw new Error("Class schedule is full. Maximum capacity reached.");
  }

  const updatedClass = await prisma.class.update({
    where: { id: classId },
    data: {
      trainees: {
        connect: { id: traineeId },
      },
    },
  });

  return updatedClass;
};

export const classService = {
  createClass,
  getClasses,
  bookClass,
};
