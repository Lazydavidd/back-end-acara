import mongoose from "mongoose";
import { encrypt } from "../utils/encryption";
import {renderMailHtml, sendMail} from '../utils/mail/mail';
import { EMAIL_SMTP_USER } from "../utils/env";
export interface User {
    fullName: string;
    username: string;
    email: string;
    password: string;
    role: string;
    ProfilePicture: string;
    isActive: boolean;
    activationCode: string;
    createdAt?: String;
}
const schema =  mongoose.Schema;


const userSchema = new schema<User>({
    fullName: {
        type: schema.Types.String,
         required: true,
        },

        username: {
            type: schema.Types.String,
            required: true,
        },
        email: {
            type: schema.Types.String,
            required: true,
        },
        password: {
            type: schema.Types.String,
            required: true,
        },
        role: {
            type: schema.Types.String,
            enum: ["admin","user"],
            default: "user",
        },
        ProfilePicture: {
            type: schema.Types.String,
            default: "user.jpg",
        },
        isActive: {
            type: schema.Types.Boolean,
            default: false,
        },
        activationCode: {
            type: schema.Types.String,
        },


},
    {
        timestamps: true,
    }
);

userSchema.pre("save", function (next) {
    
    const user = this;

    user.password = encrypt(user.password);

    next();

});

userSchema.post("save", async function(doc, next) {
    

  try {
    
      const user = doc;
    
    console.log("Send Email to:", user.email);

const contentMail = await renderMailHtml("registration-success.ejs", {
    username: user.username,
    fullName: user.fullName,
    email: user.email,
    createdAt: user.createdAt,
    activationLink: '${CLIENT_HOST}/auth/activation?code=${user.activationCode}',
});

activationLink: `${process.env.CLIENT_HOST}/auth/activation?code=${user.activationCode}`


await sendMail({
    from: EMAIL_SMTP_USER,
    to: user.email,
    subject: "Aktifasi Akun Anda",
    html: contentMail,
});

  } catch (error) {
    console.log(error);
  } finally {
    next();
  }


});

userSchema.methods.toJSON= function () {
    const user = this.toObject();
    
    delete user.password;

    return user;
};

const UserModel = mongoose.model("user", userSchema);

export default UserModel;