import authRouter from "@features/auth/routes/index.js";
import userRouter from "@features/users/routes/users.route.js";
import petsRouter from "@features/pets/routes/pets.route.js";
import { Router } from "express";

const router = Router();

router.use('/auth', authRouter);

router.use('/users', userRouter);

router.use('/pets', petsRouter);

export default router;