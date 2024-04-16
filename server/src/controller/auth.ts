import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import { sendError, sendSuccess } from "../utils/ApiResponse";
import User, { IUser, UserModel } from "../models/User";
import bcrypt from 'bcrypt' ;
import otpGenerator from 'otp-generator';
import { AddMinutesToDate } from "../utils/dateFunctions";
import { MAX_OTP_TRIALS, MAX_OTP_TRIALS_IN_MINUTES, OTP_EXPIRE_AFTER_MINUTES } from "../constants/otp";
import Otp from "../models/Otp";
import { sendEmail } from "../utils/sendEmail";
import { decode, encode } from "../utils/crypt";


export const register = catchAsync(async (req: Request, res: Response): Promise<void> => {

    let { first_name, last_name, email, phone, password } = req.body;

    //checking if the user is already present 
    const alreadyPresentUser = await User.findOne({ email });

    //if already present and verified then he can directly login
    if (alreadyPresentUser && alreadyPresentUser.email_verified)
        return sendSuccess(res, 400, 'You Are already registered. you can login', {});

    //if already present but not verified then delete the already present entry
    if (alreadyPresentUser && !alreadyPresentUser.email_verified) {
        await User.findByIdAndDelete(alreadyPresentUser._id);
    }

    //encryt the password
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    //create new User
    const newUser = await User.create({
        first_name,
        last_name,
        email,
        phone,
        password,
        email_verified: false
    });

    const response = { email };
    sendSuccess(res, 200, 'User created successfully', response);
})




export const getOtp = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const { email } = req.body;
    const currentDate = new Date();

    //search for the registered user
    const user = await User.findOne({ email });

    if (!user) {
        const response = { "status": "Failure", "details": "User not found" }
        return sendError(res, 400, 'User not found', response);
    }

    // when 1 hour has passed then reset the otp properties 
    if (user.lastOtpRequestTime != undefined && currentDate > AddMinutesToDate(user.lastOtpRequestTime, MAX_OTP_TRIALS_IN_MINUTES)) {
        user.OtpAttemptCount = '0';
        user.lastOtpRequestTime = undefined;
    }

    //if request is within 1 hour then check otpCount. if otpCount>3 return error.
    if (user.lastOtpRequestTime != undefined
        &&
        currentDate < AddMinutesToDate(user.lastOtpRequestTime, MAX_OTP_TRIALS_IN_MINUTES)
        &&
        parseInt(user.OtpAttemptCount) >= MAX_OTP_TRIALS
    ) {
        const response = { "status": "Failure", "details": "Only 3 OTP request in 1 hour" }
        return sendError(res, 400, `Only ${MAX_OTP_TRIALS} OTP request in 1 hour. Now apply after 1 hr`, response);
    }

    //Generate OTP 
    const otp = otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
    const expiration_time = AddMinutesToDate(currentDate, OTP_EXPIRE_AFTER_MINUTES);

    //Create OTP instance in OTP model
    const otp_instance = new Otp({
        otp: otp,
        expiration_time: expiration_time,
    });
    await otp_instance.save();

    // Create details object containing the email and otp id
    const details = {
        "timestamp": currentDate,
        "check": email,
        "success": true,
        "message": "OTP sent to user",
        "otp_id": otp_instance._id
    }

    // Encrypt the details object
    const encoded = await encode(JSON.stringify(details));

    // send OTP to email address
    const sendDetails = await sendEmail(email,user.fullName(), otp);
    if (!sendDetails)
        return sendError(res, 400, 'Failed to send OTP', { status: "fail" });

    const response = {
        check: email,
        verification_code: encoded
    }

    // update the User model
    user.lastOtpRequestTime = currentDate;
    user.OtpAttemptCount = String(parseInt(user.OtpAttemptCount) + 1);
    await user.save();

    return sendSuccess(res, 200, 'OTP sent Successful', response);

})


export const verifyOtp = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const { verification_code, otp, check } = req.body;
    const currentDate = new Date();
    //type :- FORGOT,REGISTER

    //Check if verification code is altered or not
    let decoded: string;
    try {
        decoded = await decode(verification_code);
    } catch (error) {
        return sendError(res, 400, 'Verification code not valid', { message: "Verification code not valid" });
    }

    const decodedObj = JSON.parse(decoded);

    // Check if the OTP was meant for the same email or phone number for which it is being verified 
    if (decodedObj.check != check) {
        const errorData = { "Status": "Failure", "Details": "OTP was not sent to this particular email" }
        return sendError(res, 400, 'OTP was not sent to this particular email or phone number', errorData);
    }

    const otp_instance = await Otp.findById(decodedObj.otp_id);

    // if otp is not present in db
    if (!otp_instance)
        return sendError(res, 400, 'Otp is Incorrect', { message: "Otp is Incorrect" });

    // if otp is expired
    if (otp_instance.expiration_time < currentDate)
        return sendError(res, 400, 'Otp is expired', { message: "Otp is expired" });

    //Check if OTP is equal to the OTP in the DB
    if (otp != otp_instance.otp)
        return sendError(res, 400, 'Incorrect OTP', { message: "Incorrect OTP" });

    //so if the otp matches delete the OTP from db
    await Otp.findByIdAndDelete(decodedObj.otp_id);

    let response = {};
    //  update email_verified of that student to true
    const user = await User.findOneAndUpdate({ email: check }, { email_verified: true }, { new: true });
    if (!user)
        return sendError(res, 400, 'User not found with this phone number', { message: "User not found with this phone number" });

    // create a token
    const token = await user.generateAuthToken();
    response = {
        otp_verified: true,
        user_id: user._id,
        name: user.fullName(),
        token,
        email: check
    }

    return sendSuccess(res, 200, 'OTP verified', response);
})


export const login = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const { email, password } = req.body;

    //get the user from db
    const user = await User.findOne({ email: email });
    if (!user)
        return sendError(res, 400, 'Email is not registered', {});

    //check the password is correct
    const isMatch = await user.comparePassword(password);
    if (!isMatch)
        return sendError(res, 400, 'Invalid Password', {});

    //check the email is verified
    if (!user.email_verified)
        return sendError(res, 400, 'Email is not verified', {});

    //create a token
    const token = await user.generateAuthToken();
    const response = {
        user_id: user._id,
        name: user.fullName(),
        token,
        email: user.email
    }

    return sendSuccess(res, 200, 'Login Successful', response);
})
