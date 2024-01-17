import Joi from "joi";
import { ErrorServerNotClaimed, ErrorsAuthorization } from "../ErrorTypes";
import { TokenAuthentification } from "../Types";

export type ResponseData = {
  number: number;
};

export const RequestSchema = Joi.object()
  .options({
    presence: "required",
  })
  .meta({ className: "RequestData" });

export type ResponseErrorTypes = ErrorServerNotClaimed | ErrorsAuthorization;

export const endpoint = "getNumberPhotos";

export const tokenAuth: TokenAuthentification = "yes";

//auto-generated file using "yarn types"
export * from "../RequestTypes/getNumberPhotos";
