import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import { sendError, sendSuccess } from "../utils/ApiResponse";
import User, { IUser, UserModel } from "../models/User";
import bcrypt from 'bcrypt';
import { AuthenticatedRequest } from "../middleware/auth";


export const ProtectedRoute = catchAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {

    const name = req.user.fullName();
    sendSuccess(res, 200, 'Protected Route', {name});
})
