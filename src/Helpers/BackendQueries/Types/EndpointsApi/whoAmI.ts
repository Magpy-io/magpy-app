import Joi from "joi";
import { ErrorsAuthorization } from "../ErrorTypes";
import { TokenAuthentification, UserType } from "../Types";

export type ResponseData = {
  user: UserType;
};

export const RequestSchema = Joi.object()
  .options({
    presence: "required",
  })
  .meta({ className: "RequestData" });

export type ResponseErrorTypes = ErrorsAuthorization;

export const endpoint = "whoAmI";

export const tokenAuth: TokenAuthentification = "user";

//auto-generated file using "yarn types"
export * from "../RequestTypes/whoAmI";
