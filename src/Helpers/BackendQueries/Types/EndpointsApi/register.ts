import Joi from "joi";
import {
  ErrorEmailTaken,
  ErrorInvalidEmail,
  ErrorInvalidName,
  ErrorInvalidPassword,
} from "../ErrorTypes";
import { TokenAuthentification } from "../Types";

export type ResponseData = string;

export const RequestSchema = Joi.object({
  email: Joi.string(),
  name: Joi.string(),
  password: Joi.string(),
})
  .options({
    presence: "required",
  })
  .meta({ className: "RequestData" });

export type ResponseErrorTypes =
  | ErrorEmailTaken
  | ErrorInvalidEmail
  | ErrorInvalidName
  | ErrorInvalidPassword;

export const endpoint = "register";

export const tokenAuth: TokenAuthentification = "no";

//auto-generated file using "yarn types"
export * from "../RequestTypes/register";
