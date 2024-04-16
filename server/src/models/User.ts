import mongoose, { Schema, Document, Model, Types} from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export interface UserInput extends Document{
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    password: string;
    email_verified: boolean;
}

export interface IUser extends UserInput {
    OtpAttemptCount: string;
    lastOtpRequestTime: Date;
    fullName(): string;
    comparePassword(userPassword:string): Promise<boolean>;
    generateAuthToken(): Promise<string>;
}

interface UserInstanceMethods {
    fullName(): string;
    comparePassword(userPassword:string): Promise<boolean>;
    generateAuthToken(): Promise<string>;
}

export type UserModel = Model<IUser, {}, UserInstanceMethods>;


//schema
const UserSchema = new Schema<IUser, UserModel, UserInstanceMethods>({
    first_name: {
        type: String,
        required: [true, 'please enter first name']
    },
    last_name: {
        type: String,
        required: [true, 'please enter first name']
    },
    email: {
        type: String,
        required: [true, 'Please enter the email'],
        unique: true,
        validate : {
            validator: function(v:string) {
                return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
            },
            message: 'Invalid Email!'
        }
    },
    phone: {
        type: String,
        required: [true, 'Please provide your phone number'],
        unique:true,
        validate: {
          validator: function(v:string) {
            // return /d{10}/.test(v);
            return /^[1-9]\d{9}$/.test(v);
          },
          message: 'Invalid Phone Number!'
        }
    },
    email_verified: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: [true, 'Please provide a password']
    },
    OtpAttemptCount: {
        type: String,
        default: '0'
    },
    lastOtpRequestTime: {
        type: Date
    }
}, {timestamps: true})

//instance Methods
UserSchema.method('fullName', function fullName():string {
    return this.first_name + ' ' + this.last_name;
});

//comparing the password by bcrypt
UserSchema.method('comparePassword', async function(userPassword) {
    const isMatch = await bcrypt.compare(userPassword,this.password);
    return isMatch;
});

//creating token
UserSchema.method('generateAuthToken', async function() {
    const token = jwt.sign({userId:this._id,username:this.fullName()},process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME})
    return token;
});


// model
const User = mongoose.model<IUser, UserModel>('User', UserSchema);

//export
export default User;