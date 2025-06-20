import { Request, response, Response } from "express";

import * as yup from "yup";

import UserModel from "../models/user.model";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IReqUser } from "../middlewares/auth.middleware";

type TRegister = {
    fullName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
};

type Tlogin = {
    identifier: string;
    password: string;
};

const registerValidateSchema = yup.object().shape({

    fullName: yup.string().required(),
    username: yup.string().required(),
    email: yup.string().required(),
    password: yup.string().required().min(6, "password must be at least 6 characters")
    .test(
    'at-least-one-uppercase-letter', 
    "contains at least one uppercase letter", 
    (value) => {
        if (!value) return false;
        const regex = /^(?=.*[A-Z])/;
        return regex.test(value);
    }
)    .test(
    'at-least-one-number', 
    "contains at least one uppercase letter", 
    (value) => {
        if (!value) return false;
        const regex = /^(?=.*\d)/;
        return regex.test(value);
    }
),
    confirmPassword: yup.string().required().oneOf([yup.ref('password'), ""], "Password must match") , 
});

export default {
    async register(req: Request, res: Response) {
        const { fullName, username, email, password, confirmPassword } = req.body as TRegister;

        /**
         #swagger.tags = ['Auth']
         */

        req.body as unknown as TRegister;

        try {
        await registerValidateSchema.validate({
            fullName, 
            username, 
            email, 
            password, 
            confirmPassword, 
        });

        const result = await UserModel.create({
            fullName, 
            username, 
            email, 
            password, 
        });

    res.status(200).json({
    message: "Registration successful",

    data: result
});

    } catch (error) {
        const err = error as unknown as Error;

        res.status(400).json({
            message: err.message,
            data: null,
        });
    }
    },

    // funtion login
    async login(req: Request, res: Response) {

        /**
         #swagger.tags = ['Auth']
         #swagger.requestBody = {
            required: true,
            schema: {$ref: "#/components/schemas/LoginRequest"}
         }
         */
                    const {
                        identifier,
                        password

                    } = req.body as unknown as Tlogin;
        try {
            //ambil data user bedasarkan identifier -> email dan username
            const userByIndentifier = await UserModel.findOne({ //untuk mengidentifikasi user melalui email/username
                $or: [
                    {
                     email: identifier,
                    },
                    {
                        username: identifier,
                    },
                ],
                isActive: true,
            });

            if (!userByIndentifier) {
                return res.status(403).json ({
                    message: "user not found",
                data: null
                });
                
            }

            //validasi password
            const validatePassword: boolean = encrypt(password) == userByIndentifier.password;

            if(!validatePassword) {
                return res.status(403).json ({
                    message: "user not found",
                data: null
                });
            }

            const token = generateToken ({
                id: userByIndentifier._id,
                role: userByIndentifier.role,
            });

            res.status(200).json ({
                message: "Login Success",
                data: token,
            });

        } catch (error) {
             const err = error as unknown as Error;

        res.status(400).json({
            message: err.message,
            data: null,
        });
        }

    },

  //disini irequser
   async me(req: IReqUser, res: Response){

    /**
     #swagger.tags = ['Auth']
     #swagger.security = [{
        "bearerAuth": []
     }]
     */
        try {

            const user = req.user;

            const result = await UserModel.findById(user?.id);

           res.status(200).json({
            message: "Success Login User Profile",
            data: result,
        });  

        } catch (error) {
          const err = error as unknown as Error;

        res.status(400).json({
            message: err.message,
            data: null,
        });  
        }
        
    },

    async activation(req: Request, res: Response) {
/**
 #swagger.tags = ['Auth']
 #swagger.requestBody = {
   required: true,
   content: {
     "application/json": {
       schema: { $ref: "#/components/schemas/ActivationRequest" }
     }
   }
 }
 */

        try {
            const { code } = req.body as {code: string};
        
            const user = await UserModel.findOneAndUpdate({
                activationCode: code,
            },{
                isActive: true,
            },{
                new: true,
            }
        );
        res.status(200).json({
            message: "Success Activation User",
            data: user,
        });

        } catch (error) {
            const err = error as unknown as Error;

        res.status(400).json({
            message: err.message,
            data: null,
        });
        }
    }
};
