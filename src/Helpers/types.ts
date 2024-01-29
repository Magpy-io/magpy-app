type PhotoType = {
  inDevice: boolean;
  inServer: boolean;
  image: {
    fileSize: number;
    fileName: string;
    height: number;
    width: number;
    path?: string;
    pathCache: string;
    image64: string;
  };
  id: string;
  album: string;
  created: string;
  modified: string;
  syncDate: string;
  type: string; //JPEG PNG
  isLoading: boolean;
  loadingPercentage: number;
};

export type { PhotoType };