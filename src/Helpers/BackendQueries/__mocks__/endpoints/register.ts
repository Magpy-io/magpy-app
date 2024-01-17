import { Register } from "../../Types/";
import { ResponseTypeFrom } from "../../Types/ApiGlobalTypes";
import * as mockValues from "../mockValues";

export const Post = async (
  data: Register.RequestData
): Promise<ResponseType> => {
  await mockValues.timeout(10);
  const f = mockValues.checkFails();
  if (f) {
    return f;
  }

  if (data.email == mockValues.userEmailTaken) {
    return {
      ok: false,
      errorCode: "EMAIL_TAKEN",
      message: "",
    };
  }

  if (
    data.email != mockValues.validUserEmail ||
    data.password != mockValues.validUserPassword
  ) {
    return {
      ok: false,
      errorCode: "INVALID_EMAIL",
      message: "",
    };
  }

  return {
    ok: true,
    data: "",
  };
};

export type ResponseType = ResponseTypeFrom<
  Register.ResponseData,
  Register.ResponseErrorTypes
>;

export * from "../../Types/EndpointsApi/register";
