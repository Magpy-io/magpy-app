import Joi from "joi";
import { ErrorInvalidCredentials } from "../ErrorTypes";
import { TokenAuthentification } from "../Types";

export type ResponseData = string;

export const RequestSchema = Joi.object({
  email: Joi.string(),
  password: Joi.string(),
})
  .options({
    presence: "required",
  })
  .meta({ className: "RequestData" });

export type ResponseErrorTypes = ErrorInvalidCredentials;

export const endpoint = "login";

export const tokenAuth: TokenAuthentification = "set-token-user";

//auto-generated file using "yarn types"
export * from "../RequestTypes/login";
