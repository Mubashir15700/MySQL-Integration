import { Router } from "express";
import { createUsersTable, getUsers } from "../controllers/userController.ts";

const router = Router();

router.get("/users/create-table", createUsersTable);
router.get("/users", getUsers);

export default router;
