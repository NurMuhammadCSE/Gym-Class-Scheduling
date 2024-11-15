import express from "express";
import { userRoutes } from "../modules/user/user.routes";
import { classRoutes } from "../modules/class/class.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/class",
    route: classRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
