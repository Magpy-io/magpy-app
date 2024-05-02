package com.opencloudphotos.NativeModules.MediaManagement;

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

}
