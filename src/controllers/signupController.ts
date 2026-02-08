import type { Request, Response, NextFunction } from "express";
import AuthService from "../services/authService.ts";

export async function SignupController(req: Request, res: Response, next: NextFunction){
    const { email, password, name } = req.body;
    
    try{
        const { createdUser } = await AuthService.register({
                email: email, 
                password: password, 
                provider: 'local', 
                name: name
            });
        res.json({createdUser});
    }catch(err){
        console.log(err);
        next(err);
    }

}