import { RegisterServer } from "../../Types/";
import { ResponseTypeFrom } from "../../Types/ApiGlobalTypes";
import * as mockValues from "../mockValues";
import { verifyHasUserToken, GetUserToken } from "../../TokenManager";

export const Post = async (
  data: RegisterServer.RequestData
): Promise<ResponseType> => {
  verifyHasUserToken();
  await mockValues.timeout(10);
  const f = mockValues.checkFails();
  if (f) {
    return f;
  }

  if (GetUserToken() == mockValues.expiredUserToken) {
    return {
      ok: false,
      errorCode: "AUTHORIZATION_EXPIRED",
      message: "",
    };
  }

  if (GetUserToken() != mockValues.validUserToken) {
    return {
      ok: false,
      errorCode: "AUTHORIZATION_FAILED",
      message: "",
    };
  }

  mockValues.setRandomValidKey(data.serverKey);

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
  RegisterServer.ResponseData,
  RegisterServer.ResponseErrorTypes
>;

export * from "../../Types/EndpointsApi/registerServer";
