import { Request, Response } from "express";
import response from "../utils/response";

import * as yup from "yup";

import UserModel, { userDTO, userLoginDTO, userUpdatePasswordDTO } from "../models/user.model";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IReqUser } from "../utils/interfaces";
import { ROLES } from "../utils/constant";


export default {

     async updateProfile(req: IReqUser, res: Response) {
    try {
      const userId = req.user?.id;
      const { fullName, profilePicture } = req.body;
      const result = await UserModel.findByIdAndUpdate(
        userId,
        {
          fullName,
          profilePicture,
        },
        {
          new: true,
        }
      );

      if (!result) return response.notFound(res, "user not found");

      response.success(res, result, "success to update profile");
    } catch (error) {
      response.error(res, error, "failed to update profile");
    }
  },
  async updatePassword(req: IReqUser, res: Response) {
    try {
      const userId = req.user?.id;
      const { oldPassword, password, confirmPassword } = req.body;

      await userUpdatePasswordDTO.validate({
        oldPassword,
        password,
        confirmPassword,
      });

      const user = await UserModel.findById(userId);

      if (!user || user.password !== encrypt(oldPassword))
        return response.notFound(res, "user not found");

      const result = await UserModel.findByIdAndUpdate(
        userId,
        {
          password: encrypt(password),
        },
        {
          new: true,
        }
      );
      response.success(res, result, "success to update password");
    } catch (error) {
      response.error(res, error, "failed to update password");
    }
  },

    async register(req: Request, res: Response) {
        const { fullName, username, email, password, confirmPassword } = req.body;

        try {
        await userDTO.validate({
            fullName, 
            username, 
            email, 
            password, 
            confirmPassword,
        });

        if ('role' in req.body) delete req.body.role;
        const result = await UserModel.create({
            fullName, 
            username, 
            email, 
            password, 
            role: ROLES.MEMBER,
        });

    response.success(res, result, "success registration!");
    
    } catch (error) {
    response.error(res, error, "failed registration");
    }
    },

    // funtion login
    async login(req: Request, res: Response) {


        try {
            const {identifier, password} = req.body;
            await userLoginDTO.validate({identifier, password,});
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
                return response.unauthorized(res, "user not found");
            }

            //validasi password
            const validatePassword: boolean = encrypt(password) == userByIndentifier.password;

            if(!validatePassword) {
                return response.unauthorized(res, "user not found");
            }

            const token = generateToken ({
                id: userByIndentifier._id,
                role: userByIndentifier.role,
                profilePicture: userByIndentifier.profilePicture,
            });
            response.success(res, token, "login success");
        } catch (error) {
        response.error(res, error, "login failed");
        }

    },

  //disini irequser
   async me(req: IReqUser, res: Response){
        try {

            const user = req.user;

            const result = await UserModel.findById(user?.id);

         response.success(res, result, "success get user profile");

        } catch (error) {
        response.error(res, error, "failed get user profile");
        }
        
    },

    async activation(req: Request, res: Response) {
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
        response.success(res, user, "user successfully activated");
        } catch (error) {
        response.error(res, error, "user failed activated");
        }
    }
};
