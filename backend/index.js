import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

const PORT = 3000;


app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});