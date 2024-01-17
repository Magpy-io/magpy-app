import { GetServerInfo } from "../../Types/";
import { ResponseTypeFrom } from "../../Types/ApiGlobalTypes";
import * as mockValues from "../mockValues";
import { GetServerToken, verifyHasServerToken } from "../../TokenManager";

export const Post = async (
  data?: GetServerInfo.RequestData
): Promise<ResponseType> => {
  verifyHasServerToken();
  await mockValues.timeout(10);
  const f = mockValues.checkFails();
  if (f) {
    return f;
  }

  if (GetServerToken() == mockValues.expiredServerToken) {
    return {
      ok: false,
      errorCode: "AUTHORIZATION_EXPIRED",
      message: "",
    };
  }

  if (GetServerToken() != mockValues.validServerToken) {
    return {
      ok: false,
      errorCode: "AUTHORIZATION_FAILED",
      message: "",
    };
  }

  return {
    ok: true,
    data: {
      server: {
        _id: mockValues.serverId,
        name: "MyLocalServer",
        ipPublic: "0.0.0.0",
        ipPrivate: "0.0.0.0",
        port: "0000",
        owner: {
          _id: mockValues.userId,
          name: mockValues.validUserName,
          email: mockValues.validUserEmail,
          serverId: mockValues.serverId,
        },
      },
    },
  };
};

export type ResponseType = ResponseTypeFrom<
  GetServerInfo.ResponseData,
  GetServerInfo.ResponseErrorTypes
>;

export * from "../../Types/EndpointsApi/getServerInfo";
