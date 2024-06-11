import { Request, Response } from "express";
import handler from "../middleware/handler.middleware";
import { transporter } from '../index';


const mailOptions = {
    from: 'dc0xdx@gmail.com',
    to: 'samirk10101@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
};

const mailTest = handler(async (req: Request, res: Response) => {
    console.log('Sending email');
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    res.json()
    });

}, '@mailTest ERROR: ');



export { mailTest }