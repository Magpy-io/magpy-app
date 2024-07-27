package com.opencloudphotos.NativeModules.MediaManagement.Utils;

import android.provider.MediaStore;

public class Definitions {

    public static final String[] PROJECTION = {
            MediaStore.Images.Media._ID,
            MediaStore.Images.Media.MIME_TYPE,
            MediaStore.Images.Media.BUCKET_DISPLAY_NAME,
            MediaStore.Images.Media.DATE_TAKEN,
            MediaStore.MediaColumns.DATE_ADDED,
            MediaStore.MediaColumns.DATE_MODIFIED,
            MediaStore.MediaColumns.WIDTH,
            MediaStore.MediaColumns.HEIGHT,
            MediaStore.MediaColumns.SIZE,
            MediaStore.MediaColumns.DATA,
            MediaStore.MediaColumns.ORIENTATION,
    };

    public static final String SELECTION_BUCKET = MediaStore.Images.Media.BUCKET_DISPLAY_NAME + " = ?";


    public static final String INCLUDE_FILENAME = "filename";
    public static final String INCLUDE_FILE_SIZE = "fileSize";
    public static final String INCLUDE_FILE_EXTENSION = "fileExtension";
    public static final String INCLUDE_LOCATION = "location";
    public static final String INCLUDE_IMAGE_SIZE = "imageSize";
    public static final String INCLUDE_PLAYABLE_DURATION = "playableDuration";
    public static final String INCLUDE_ORIENTATION = "orientation";
    public static final String INCLUDE_ALBUMS = "albums";

    public static final String ASSET_TYPE_PHOTOS = "Photos";
    public static final String ASSET_TYPE_VIDEOS = "Videos";
    public static final String ASSET_TYPE_ALL = "All";

    public static final String ERROR_UNABLE_TO_FILTER = "E_UNABLE_TO_FILTER";
    public static final String ERROR_UNABLE_TO_SAVE = "E_UNABLE_TO_SAVE";

    public static final String ERROR_UNABLE_TO_LOAD = "E_UNABLE_TO_LOAD";
    public static final String ERROR_UNABLE_TO_LOAD_PERMISSION = "E_UNABLE_TO_LOAD_PERMISSION";

}
