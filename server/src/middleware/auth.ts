import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/ApiResponse'; 
import jwt, { JwtPayload } from 'jsonwebtoken'; 
import User, { IUser } from '../models/User';
import catchAsync from '../utils/catchAsync';

export interface AuthenticatedRequest extends Request {
    user: IUser; // Replace UserType with the type of the user object
  }

const Protect =  catchAsync( async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Getting token and check of it's there
        let token:string;
        if ( req.headers.authorization && req.headers.authorization.startsWith('Bearer') ) 
            token = req.headers.authorization.split(' ')[1];
            
        if (!token) 
            return sendError(res, 401, 'You are not logged in! Please log in to get access.', {});

        // Verifiying token
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
        if(!decoded)
            return sendError(res,401,'user cannot be found. please relogin',401);
        const user = await User.findById(decoded.userId);
        if(!user)
            return sendError(res,401,'user cannot be found. please relogin',401);

        req.user = user;
        next();
    } catch (error) {
        return sendError(res, 401, 'You are not logged in! Please log in to get access.', {});
    }
});

const adminProtect = catchAsync( async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    if(!['7972142271','7982463088'].includes(req.user.phone))
        return sendError(res, 401, 'You are not authorized to access this route', {});
    next();
})

export { Protect, adminProtect };