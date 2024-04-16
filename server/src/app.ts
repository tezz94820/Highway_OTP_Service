import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import connectDB from './db/connect';
import indexRoutes from './routes/indexRoute';
import env from 'dotenv';
env.config();


const app = express();

//middlewares
// app.use(cors({
//     origin: [
//         'https://dkacademy.co.in',
//         'https://www.dkacademy.co.in',
//         'http://localhost:3000'
//     ],
//     credentials: true,
//     // optionSuccessStatus:200,
// }));
app.use(cors());
app.use(helmet());
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//routes
app.get('/health', (req, res) => {
    res.status(200).send({ message: 'Server is up and running' });
});
app.use('/api/v2', indexRoutes);

//starting the server
const port = process.env.PORT
const start = async (): Promise<void> => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen( port, () =>   console.log(`Listening on port ${port}`) );
    } catch (error) {
        console.log(error.message);
    }
}


start()