import { Response } from "express";
import { IReqUser } from "../utils/interfaces";
import uploader from "../utils/uploader";
import response from "../utils/response";

export default {
async single(req: IReqUser, res: Response) {
  if (!req.file) {
    return response.error(res, null, "No file uploaded");
  }

  try {
        const result = await uploader.uploadSingle(req.file as Express.Multer.File);
        return response.success(res, result, "Success upload a file");
    } catch (error) {
        console.error("Upload file error:", error);
        return response.error(res, null, "Failed to upload file");
    }
    },
    async multiple(req: IReqUser, res: Response) {
                if(!req.files || req.files.length == 0 ) {
            return response.error(res, null, "file not found");
        }

        try {
            const result = await uploader.uploadMultiple(req.files as Express.Multer.File[]);
            response.success(res, result, "Files uploaded successfully")
        } catch {
            response.error(res, null, "failed upload file");
        }
    },
        async remove(req: IReqUser, res: Response) {
        try {
            const { fileUrl } = req.body as { fileUrl: string };
            const result = await uploader.remove(fileUrl);
            response.success(res, result,"success remove file")
        } catch (error) {
            response.error(res, null, "failed remove file");
        }
        },

};