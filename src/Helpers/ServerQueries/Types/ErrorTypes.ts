export type ErrorBadRequest = 'BAD_REQUEST';
export type ErrorServerError = 'SERVER_ERROR';
export type ErrorAuthorizationBackendFailed = 'AUTHORIZATION_BACKEND_FAILED';
export type ErrorAuthorizationBackendExpired = 'AUTHORIZATION_BACKEND_EXPIRED';
export type ErrorBackendServerUnreachable = 'BACKEND_SERVER_UNREACHABLE';
export type ErrorIdNotFound = 'ID_NOT_FOUND';
export type ErrorUserNotAllowed = 'USER_NOT_ALLOWED';
export type ErrorServerNotClaimed = 'SERVER_NOT_CLAIMED';
export type ErrorInvalidPartNumber = 'INVALID_PART_NUMBER';
export type ErrorServerAlreadyClaimed = 'SERVER_ALREADY_CLAIMED';
export type ErrorPhotoTransferNotFound = 'PHOTO_TRANSFER_NOT_FOUND';
export type ErrorMissingParts = 'MISSING_PARTS';
export type ErrorPhotoSizeExceeded = 'PHOTO_SIZE_EXCEEDED';
export type ErrorAuthorizationMissing = 'AUTHORIZATION_MISSING';
export type ErrorAuthorizationWrongFormat = 'AUTHORIZATION_WRONG_FORMAT';
export type ErrorAuthorizationFailed = 'AUTHORIZATION_FAILED';
export type ErrorAuthorizationExpired = 'AUTHORIZATION_EXPIRED';
export type ErrorCouldNotGetRequestAddress = 'COULD_NOT_GET_REQUEST_ADDRESS';
export type ErrorPathAccessDenied = 'PATH_ACCESS_DENIED';
export type ErrorPathFolderDoesNotExist = 'PATH_FOLDER_DOES_NOT_EXIST';
export type ErrorInvalidName = 'INVALID_NAME';
export type ErrorInvalidCredentials = 'INVALID_CREDENTIALS';
export type ErrorRequestNotFromLoopback = 'REQUEST_NOT_FROM_LOOPBACK';
export type ErrorFormatNotSupported = 'FORMAT_NOT_SUPPORTED';
export type ErrorPathNotAbsolute = 'PATH_NOT_ABSOLUTE';

export type ErrorCodes =
  | ErrorBadRequest
  | ErrorServerError
  | ErrorAuthorizationBackendFailed
  | ErrorAuthorizationBackendExpired
  | ErrorBackendServerUnreachable
  | ErrorIdNotFound
  | ErrorUserNotAllowed
  | ErrorServerNotClaimed
  | ErrorInvalidPartNumber
  | ErrorServerAlreadyClaimed
  | ErrorPhotoTransferNotFound
  | ErrorMissingParts
  | ErrorPhotoSizeExceeded
  | ErrorAuthorizationMissing
  | ErrorAuthorizationWrongFormat
  | ErrorAuthorizationFailed
  | ErrorAuthorizationExpired
  | ErrorCouldNotGetRequestAddress
  | ErrorPathAccessDenied
  | ErrorPathFolderDoesNotExist
  | ErrorInvalidName
  | ErrorInvalidCredentials
  | ErrorRequestNotFromLoopback
  | ErrorFormatNotSupported
  | ErrorPathNotAbsolute;

export type ErrorsAuthorization =
  | ErrorAuthorizationFailed
  | ErrorAuthorizationMissing
  | ErrorAuthorizationExpired
  | ErrorAuthorizationWrongFormat;
