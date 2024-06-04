import { Response } from 'express';
import jwt from 'jsonwebtoken';

const generateToken = (res: Response, userId: string) => {
    const secretKey = process.env.JWT!;
    const payload = { userId };
    const options = { expiresIn: '30d' };
    const token = jwt.sign(payload, secretKey, options);

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    return token;
};

export default generateToken;

