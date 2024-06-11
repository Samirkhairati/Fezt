import { transporter } from '../index';

const verifyMail = (to: string, code: string, subject: string) => {
    console.log('Sending email');
    transporter.sendMail(
        {
            from: 'dc0xdx@gmail.com',
            to: to,
            subject: subject,
            html: `<h1>${code}</h1>`
        }
        , function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
}

export { verifyMail }