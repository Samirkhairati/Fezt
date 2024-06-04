import { Request, Response } from "express";

const asyncHandler = (givenFunction: any, customError: any) => {
    return async (req: Request, res: Response, next: any) => {
        try {
            await givenFunction(req, res, next);
        } catch (error: any) {
            if (customError === undefined) {
                //res.send(error.message)
                console.log(RED, `@handler error: ${error.message}`);
            } else {
                res.send(customError + error.message)
                console.log(RED, `@handler error: ${customError + error.message}`);
            }
        }
    };
};
const RED = '\x1b[31m%s\x1b[0m';
const GREEN = '\x1b[32m%s\x1b[0m';
const YELLOW = '\x1b[33m%s\x1b[0m';
const BLUE = '\x1b[34m%s\x1b[0m';

export default asyncHandler;