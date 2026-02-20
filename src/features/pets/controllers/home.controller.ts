import type { Request, Response } from "express";
function homeController(req: Request, res: Response) {
    res.send("Welcome to the home page!");
}

export default homeController;