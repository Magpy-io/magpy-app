export type Photo = {
  inDevice: boolean | null;
  inServer: boolean | null;
  image: {
    fileSize: number;
    fileName: string;
    height: number;
    width: number;
    path: string;
    base64: string;
  };
  album: string;
  created: string;
  modified: string;
  syncDate: string;
  type: string; //JPEG PNG
};
