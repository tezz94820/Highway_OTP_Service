import mongoose, { Schema, Document  } from 'mongoose';

//typescript types
export interface IOtp extends Document {
    otp: string;
    expiration_time: Date;
}

//schema
const OtpSchema = new Schema<IOtp>({
    otp: {
        type: String,
        required: [true, 'please enter OTP']
    },
    expiration_time: {
        type: Date,
        required: [true, 'please enter OTP expiration time']
    }
}, {timestamps: true})

// Create a TTL index on expiration_time with a 0-second expiration time
OtpSchema.index({ expiration_time: 1 }, { expireAfterSeconds: 0 });

//                                                  model
const Otp = mongoose.model<IOtp>('Otp', OtpSchema);

//export
export default Otp; 