export type Photo = {
  inDevice: boolean | null;
  inServer: boolean | null;
  image: {
    fileSize: number;
    fileName: string;
    height: number;
    width: number;
    path: string;
  };
  album: string;
  created: number;
  modified: number;
  syncDate: string | null;
  type: string; //JPEG PNG
};
