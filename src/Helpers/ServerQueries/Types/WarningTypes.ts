import { APIPhoto } from "./Types";

export type WarningFormat<Code, Data> = { code: Code; data: Data };

export type WarningDataTypes = WarningPhotosNotOnDiskDeletedType;

export type WarningPhotosNotOnDiskDeletedDataType = {
  photosDeleted: Array<APIPhoto>;
};
export type WarningPhotosNotOnDiskDeletedType = WarningFormat<
  "PHOTOS_NOT_ON_DISK_DELETED",
  WarningPhotosNotOnDiskDeletedDataType
>;
