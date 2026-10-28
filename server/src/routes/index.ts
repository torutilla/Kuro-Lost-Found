import authRouter from "@features/auth/routes/index.js";
import userRouter from "@features/users/routes/users.route.js";
import petsRouter from "@features/pets/routes/pets.route.js";
import messagingRouter from "@features/messaging/routes/messaging.route.js";
import { Router } from "express";

const router: Router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

router.use('/auth', authRouter);

router.use('/users', userRouter);

router.use('/pets', petsRouter);
router.use('/messaging', messagingRouter);

export default router;