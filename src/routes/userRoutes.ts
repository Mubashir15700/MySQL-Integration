import { Router } from "express";
import {
    createUsersTable,
    getUsers,
    createUser,
    getUserById,
    updateUser,
    patchUser,
    deleteUser,
} from "../controllers/userController.ts";

const router = Router();

router.get("/users/create-table", createUsersTable);
router.get("/users", getUsers);
router.post("/users", createUser);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.patch("/users/:id", patchUser);
router.delete("/users/:id", deleteUser);

export default router;
