import { GetServerToken } from "../../Types/";
import { ResponseTypeFrom } from "../../Types/ApiGlobalTypes";
import * as mockValues from "../mockValues";
import { SetServerToken } from "../../TokenManager";

export const Post = async (
  data: GetServerToken.RequestData
): Promise<ResponseType> => {
  await mockValues.timeout(10);
  const f = mockValues.checkFails();
  if (f) {
    return f;
  }

  if (
    data.key != mockValues.validKey &&
    data.key != mockValues.validRandomKey
  ) {
    return {
      ok: false,
      errorCode: "INVALID_CREDENTIALS",
      message: "",
    };
  }

  SetServerToken(mockValues.validServerToken);

  return {
    ok: true,
    data: "",
  };
};

export type ResponseType = ResponseTypeFrom<
  GetServerToken.ResponseData,
  GetServerToken.ResponseErrorTypes
>;

export * from "../../Types/EndpointsApi/getServerToken";
