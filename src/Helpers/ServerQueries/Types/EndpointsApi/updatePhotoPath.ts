import Joi from "joi";
import {
  ErrorIdNotFound,
  ErrorServerNotClaimed,
  ErrorsAuthorization,
} from "../ErrorTypes";
import { TokenAuthentification } from "../Types";

export type ResponseData = string;

export const RequestSchema = Joi.object({
  id: Joi.string().uuid({ version: "uuidv4" }),
  path: Joi.string(),
  deviceUniqueId: Joi.string().uuid({ version: "uuidv4" }),
})
  .options({ presence: "required" })
  .meta({ className: "RequestData" });

export type ResponseErrorTypes =
  | ErrorIdNotFound
  | ErrorServerNotClaimed
  | ErrorsAuthorization;

export const endpoint = "updatePhotoPath";

export const tokenAuth: TokenAuthentification = "yes";

//auto-generated file using "yarn types"
export * from "../RequestTypes/updatePhotoPath";
