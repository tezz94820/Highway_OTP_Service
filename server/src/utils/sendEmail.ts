import nodemailer from 'nodemailer';
import env from 'dotenv';
env.config();


// Create a transporter object using SMTP transport
let transporter = nodemailer.createTransport({
    service: 'Gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD,
    }
});


// Verify connection configuration
transporter.verify((error, success) => {
    if (error) {
        console.log('transport not verified');
        console.log(error);
    } else {
        console.log('SMTP server ready');
    }
});


export const sendEmail = async (email: string, clientName: string, otp: string): Promise<boolean> => {
    let mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Your One Time Password (OTP) for Authentication',
        html: `
        <p>Dear ${clientName},</p>
        <p>Thank you for using our platform/service. As requested, we have generated a One Time Password (OTP) for your authentication process.</p>
        <p style="font-size: 24px; font-weight: bold;">OTP: ${otp}</p>
        <p>This OTP is valid for a single use and will expire in 10 minutes. Please ensure to use it within the specified time frame.</p>
        <p>If you did not request this OTP or have any concerns regarding your account security, please contact our support team immediately at <a href="mailto:tejasitankar94820@gmail.com">tejasitankar@94820@gmail.com</a>.</p>
        <p>Thank you for choosing Highway Delite!</p>
    `
    };

    // Send email
    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log(error);
        return false;
    }

    return true;

}
