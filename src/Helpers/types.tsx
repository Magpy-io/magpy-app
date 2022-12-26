type PhotoType = {
  inDevice: boolean | null;
  inServer: boolean | null;
  image: {
    fileSize: number;
    fileName: string;
    height: number;
    width: number;
    path: string;
    image64: string;
  };
  id: string;
  album: string;
  created: string;
  modified: string;
  syncDate: string;
  type: string; //JPEG PNG
};

export type { PhotoType };
