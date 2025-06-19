import express, { json } from 'express';
import userRoutes from './Routes/userRoutes.js';
import authRoutes from './Routes/authRoutes.js';
import quizRoutes from './Routes/quizRoutes.js';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const conn = mongoose.connect(process.env.MONGODB_URL);

if(conn) {
    console.log('Db connection successful!');
}

const app = express();



app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(json());
app.use(cookieParser());

app.use('/api/auth', authRoutes );
app.use('/api/users', userRoutes);
app.use('/api/quiz', quizRoutes);

app.listen(8000, () => {
    console.log('Server is running on port 8000');
})