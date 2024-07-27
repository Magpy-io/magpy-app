import { NativeModules } from 'react-native';

const { MediaManagementModule } = NativeModules;

export type GroupTypes =
  | 'Album'
  | 'All'
  | 'Event'
  | 'Faces'
  | 'Library'
  | 'SmartAlbum'
  | 'PhotoStream'
  | 'SavedPhotos';

export type AssetType = 'All' | 'Videos' | 'Photos';

export type Include =
  | 'filename'
  | 'fileSize'
  | 'fileExtension'
  | 'location'
  | 'imageSize'
  | 'playableDuration'
  | 'orientation'
  | 'albums';

export type GetPhotosParams = {
  /**
   * The number of photos wanted in reverse order of the photo application
   * (i.e. most recent first).
   */
  first: number;

  /**
   * A cursor that matches `page_info { end_cursor }` returned from a previous
   * call to `getPhotos`
   */
  after?: string;

  /**
   * Specifies which group types to filter the results to.
   */
  groupTypes?: GroupTypes;

  /**
   * Specifies filter on group names, like 'Recent Photos' or custom album
   * titles.
   */
  groupName?: string;

  /**
   * Include assets originating from an iCloud Shared Album. iOS only.
   */
  includeSharedAlbums?: boolean;

  /**
   * Specifies filter on asset type
   */
  assetType?: AssetType;

  /**
   * Earliest time to get photos from. A timestamp in milliseconds. Exclusive.
   */
  fromTime?: number;

  /**
   * Latest time to get photos from. A timestamp in milliseconds. Inclusive.
   */
  toTime?: number;

  /**
   * Filter by mimetype (e.g. image/jpeg).
   */
  mimeTypes?: Array<string>;

  /**
   * Specific fields in the output that we want to include, even though they
   * might have some performance impact.
   */
  include?: Include[];
};

export type PhotoIdentifiersPage = {
  edges: Array<PhotoIdentifier>;
  page_info: {
    has_next_page: boolean;
    start_cursor?: string;
    end_cursor?: string;
  };
  limited?: boolean;
};

export type PhotoIdentifier = {
  node: {
    id: string;
    type: string;
    subTypes: SubTypes;
    group_name: string[];
    image: {
      filename: string | null;
      filepath: string | null;
      extension: string | null;
      uri: string;
      height: number;
      width: number;
      fileSize: number | null;
      playableDuration: number;
      orientation: number | null;
    };
    timestamp: number;
    modificationTimestamp: number;
    location: {
      latitude?: number;
      longitude?: number;
      altitude?: number;
      heading?: number;
      speed?: number;
    } | null;
  };
};

export type SubTypes =
  | 'PhotoPanorama'
  | 'PhotoHDR'
  | 'PhotoScreenshot'
  | 'PhotoLive'
  | 'PhotoDepthEffect'
  | 'VideoStreamed'
  | 'VideoHighFrameRate'
  | 'VideoTimelapse';

export type SaveToCameraRollOptions = {
  type: 'photo' | 'video';
  album?: string;
};

export interface MediaManagementModuleType {
  getRestoredMediaAbsolutePath: () => Promise<string>;
  getPhotos: (params: GetPhotosParams) => Promise<PhotoIdentifiersPage>;
  getPhotoById: (id: string, params: GetPhotosParams) => Promise<PhotoIdentifiersPage>;
  deleteMedia: (ids: string[]) => Promise<void>;
  saveToCameraRoll: (
    path: string,
    options: SaveToCameraRollOptions,
  ) => Promise<PhotoIdentifier>;
}

const Module = MediaManagementModule as MediaManagementModuleType;

export { Module as MediaManagementModule };
