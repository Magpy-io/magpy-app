import Joi from "joi";
import {
  ErrorInvalidName,
  ErrorsNotFromLocal,
  ErrorBackendServerUnreachable,
} from "../ErrorTypes";
import { TokenAuthentification } from "../Types";

export type ResponseData = string;

export const RequestSchema = Joi.object({
  name: Joi.string().optional(),
})
  .options({ presence: "required" })
  .meta({ className: "RequestData" });

export type ResponseErrorTypes =
  | ErrorInvalidName
  | ErrorsNotFromLocal
  | ErrorBackendServerUnreachable;

export const endpoint = "updateServerName";

export const tokenAuth: TokenAuthentification = "no";

//auto-generated file using "yarn types"
export * from "../RequestTypes/updateServerName";
