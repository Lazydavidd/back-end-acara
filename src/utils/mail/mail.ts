import nodemailer from "nodemailer";
import ejs from 'ejs';
import path from 'path';


import {
    EMAIL_SMTP_SERVICE_NAME,
    EMAIL_SMTP_HOST,
    EMAIL_SMTP_PASS,
    EMAIL_SMTP_PORT,
    EMAIL_SMTP_SECURE,
    EMAIL_SMTP_USER,
} from "../env";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SMTP_HOST,
  port: Number(process.env.EMAIL_SMTP_PORT),
  secure: process.env.EMAIL_SMTP_SECURE === "true",
  auth: {
    user: process.env.EMAIL_SMTP_USER,
    pass: process.env.EMAIL_SMTP_PASS,
  },
  requireTLS: true,
});


//function untuk kirim email
export interface IsendMail {
    from: string;
    to: string;
    subject: string;
    html: string;
}
//function untuk kirim email
export const sendMail = async ({ ...mailParams }: IsendMail) => {
    const result = await transporter.sendMail({
        ...mailParams,
    });
    return result;
};

export const renderMailHtml = async (template: string, data: any): Promise<string>  => {
    const filePath = path.join(__dirname, 'templates', template); // <- ini diperbaiki
    const content = await ejs.renderFile(filePath, data);
    return content as string;
};