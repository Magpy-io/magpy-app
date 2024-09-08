package com.magpy.NativeModules.MediaManagement.Utils;

import android.content.ContentResolver;
import android.content.res.AssetFileDescriptor;
import android.database.Cursor;
import android.graphics.BitmapFactory;
import android.media.ExifInterface;
import android.media.MediaMetadataRetriever;
import android.net.Uri;
import android.provider.MediaStore;

import com.facebook.common.logging.FLog;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.common.ReactConstants;
import com.reactnativecommunity.cameraroll.Utils;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Set;

import javax.annotation.Nullable;

public class MediaOperations {
    public static @Nullable WritableMap convertMediaToMap(
            ContentResolver resolver,
            Cursor media,
            Set<String> include) {
        int idIndex = media.getColumnIndex(MediaStore.Images.Media._ID);
        int mimeTypeIndex = media.getColumnIndex(MediaStore.Images.Media.MIME_TYPE);
        int groupNameIndex = media.getColumnIndex(MediaStore.Images.Media.BUCKET_DISPLAY_NAME);
        int dateTakenIndex = media.getColumnIndex(MediaStore.Images.Media.DATE_TAKEN);
        int dateAddedIndex = media.getColumnIndex(MediaStore.MediaColumns.DATE_ADDED);
        int dateModifiedIndex = media.getColumnIndex(MediaStore.MediaColumns.DATE_MODIFIED);
        int widthIndex = media.getColumnIndex(MediaStore.MediaColumns.WIDTH);
        int heightIndex = media.getColumnIndex(MediaStore.MediaColumns.HEIGHT);
        int sizeIndex = media.getColumnIndex(MediaStore.MediaColumns.SIZE);
        int dataIndex = media.getColumnIndex(MediaStore.MediaColumns.DATA);
        int orientationIndex = media.getColumnIndex(MediaStore.MediaColumns.ORIENTATION);

        boolean includeLocation = include.contains(Definitions.INCLUDE_LOCATION);
        boolean includeFilename = include.contains(Definitions.INCLUDE_FILENAME);
        boolean includeFileSize = include.contains(Definitions.INCLUDE_FILE_SIZE);
        boolean includeFileExtension = include.contains(Definitions.INCLUDE_FILE_EXTENSION);
        boolean includeImageSize = include.contains(Definitions.INCLUDE_IMAGE_SIZE);
        boolean includePlayableDuration = include.contains(Definitions.INCLUDE_PLAYABLE_DURATION);
        boolean includeOrientation = include.contains(Definitions.INCLUDE_ORIENTATION);
        boolean includeAlbums = include.contains(Definitions.INCLUDE_ALBUMS);

        WritableMap map = new WritableNativeMap();
        WritableMap node = new WritableNativeMap();
        boolean imageInfoSuccess =
                putImageInfo(resolver, media, node, widthIndex, heightIndex, sizeIndex, dataIndex, orientationIndex,
                        mimeTypeIndex, includeFilename, includeFileSize, includeFileExtension, includeImageSize,
                        includePlayableDuration, includeOrientation);
        if (imageInfoSuccess) {
            putBasicNodeInfo(media, node, idIndex, mimeTypeIndex, groupNameIndex, dateTakenIndex, dateAddedIndex, dateModifiedIndex, includeAlbums);
            putLocationInfo(media, node, dataIndex, includeLocation, mimeTypeIndex, resolver);

            map.putMap("node", node);
            return map;
        } else {
            return null;
        }
    }

    private static void putLocationInfo(
            Cursor media,
            WritableMap node,
            int dataIndex,
            boolean includeLocation,
            int mimeTypeIndex,
            ContentResolver resolver) {
        node.putNull("location");

        if (!includeLocation) {
            return;
        }

        try {
            String mimeType = media.getString(mimeTypeIndex);
            boolean isVideo = mimeType != null && mimeType.startsWith("video");
            if(isVideo){
                Uri photoUri = Uri.parse("file://" + media.getString(dataIndex));
                @Nullable AssetFileDescriptor photoDescriptor = null;
                try {
                    photoDescriptor = resolver.openAssetFileDescriptor(photoUri, "r");
                } catch (FileNotFoundException e) {
                    FLog.e(ReactConstants.TAG, "Could not open asset file " + photoUri.toString(), e);
                }

                if (photoDescriptor != null) {
                    MediaMetadataRetriever retriever = new MediaMetadataRetriever();
                    try {
                        retriever.setDataSource(photoDescriptor.getFileDescriptor());
                    } catch (RuntimeException e) {
                        // Do nothing. We can't handle this, and this is usually a system problem
                    }
                    try {
                        String videoGeoTag = retriever.extractMetadata(MediaMetadataRetriever.METADATA_KEY_LOCATION);
                        if (videoGeoTag!=null){
                            String filtered = videoGeoTag.replaceAll("/","");
                            WritableMap location = new WritableNativeMap();
                            location.putDouble("latitude", Double.parseDouble(filtered.split("[+]|[-]")[1]));
                            location.putDouble("longitude", Double.parseDouble(filtered.split("[+]|[-]")[2]));
                            node.putMap("location", location);
                        }
                    } catch (NumberFormatException e) {
                        FLog.e(ReactConstants.TAG,"Number format exception occurred while trying to fetch video metadata for "+ photoUri.toString(),e);
                    }
                    try {
                        retriever.release();
                    } catch (Exception e) { // Use general Exception here, see: https://developer.android.com/reference/android/media/MediaMetadataRetriever#release()
                        // Do nothing. We can't handle this, and this is usually a system problem
                    }
                }
                if (photoDescriptor != null) {
                    try {
                        photoDescriptor.close();
                    } catch (IOException e) {
                        // Do nothing. We can't handle this, and this is usually a system problem
                    }
                }
            }
            else{
                // location details are no longer indexed for privacy reasons using string Media.LATITUDE, Media.LONGITUDE
                // we manually obtain location metadata using ExifInterface#getLatLong(float[]).
                // ExifInterface is added in API level 5
                final ExifInterface exif = new ExifInterface(media.getString(dataIndex));
                float[] imageCoordinates = new float[2];
                boolean hasCoordinates = exif.getLatLong(imageCoordinates);
                if (hasCoordinates) {
                    double longitude = imageCoordinates[1];
                    double latitude = imageCoordinates[0];
                    WritableMap location = new WritableNativeMap();
                    location.putDouble("longitude", longitude);
                    location.putDouble("latitude", latitude);
                    node.putMap("location", location);
                }
            }
        } catch (IOException e) {
            FLog.e(ReactConstants.TAG, "Could not read the metadata", e);
        }
    }

    private static void putBasicNodeInfo(
            Cursor media,
            WritableMap node,
            int idIndex,
            int mimeTypeIndex,
            int groupNameIndex,
            int dateTakenIndex,
            int dateAddedIndex,
            int dateModifiedIndex,
            boolean includeAlbums) {
        node.putString("id", Long.toString(media.getLong(idIndex)));
        node.putString("type", media.getString(mimeTypeIndex));
        WritableArray subTypes = Arguments.createArray();
        node.putArray("subTypes", subTypes);
        WritableArray group_name = Arguments.createArray();
        if (includeAlbums) {
            group_name.pushString(media.getString(groupNameIndex));
        }
        node.putArray("group_name", group_name);
        long dateTaken = media.getLong(dateTakenIndex);
        if (dateTaken == 0L) {
            //date added is in seconds, date taken in milliseconds, thus the multiplication
            dateTaken = media.getLong(dateAddedIndex) * 1000;
        }
        node.putDouble("timestamp", dateTaken / 1000d);
        node.putDouble("modificationTimestamp", media.getLong(dateModifiedIndex));
    }

    private static boolean putImageInfo(
            ContentResolver resolver,
            Cursor media,
            WritableMap node,
            int widthIndex,
            int heightIndex,
            int sizeIndex,
            int dataIndex,
            int orientationIndex,
            int mimeTypeIndex,
            boolean includeFilename,
            boolean includeFileSize,
            boolean includeFileExtension,
            boolean includeImageSize,
            boolean includePlayableDuration,
            boolean includeOrientation) {
        WritableMap image = new WritableNativeMap();
        Uri photoUri = Uri.parse("file://" + media.getString(dataIndex));
        image.putString("uri", photoUri.toString());
        String mimeType = media.getString(mimeTypeIndex);

        boolean isVideo = mimeType != null && mimeType.startsWith("video");
        boolean putImageSizeSuccess = putImageSize(resolver, media, image, widthIndex, heightIndex, orientationIndex,
                photoUri, isVideo, includeImageSize);
        boolean putPlayableDurationSuccess = putPlayableDuration(resolver, image, photoUri, isVideo,
                includePlayableDuration);

        if (includeFilename) {
            File file = new File(media.getString(dataIndex));
            String strFileName = file.getName();
            image.putString("filename", strFileName);
        } else {
            image.putNull("filename");
        }

        if (includeFileSize) {
            image.putDouble("fileSize", media.getLong(sizeIndex));
        } else {
            image.putNull("fileSize");
        }

        if (includeFileExtension) {
            image.putString("extension", Utils.getExtension(mimeType));
        } else {
            image.putNull("extension");
        }

        if (includeOrientation) {
            if(media.isNull(orientationIndex)) {
                image.putInt("orientation", media.getInt(orientationIndex));
            } else {
                image.putInt("orientation", 0);
            }
        } else {
            image.putNull("orientation");
        }

        node.putMap("image", image);
        return putImageSizeSuccess && putPlayableDurationSuccess;
    }

    private static boolean putImageSize(
            ContentResolver resolver,
            Cursor media,
            WritableMap image,
            int widthIndex,
            int heightIndex,
            int orientationIndex,
            Uri photoUri,
            boolean isVideo,
            boolean includeImageSize) {
        image.putNull("width");
        image.putNull("height");

        if (!includeImageSize) {
            return true;
        }

        boolean success = true;

        int width = media.getInt(widthIndex);
        int height = media.getInt(heightIndex);

        /* If the columns don't contain the size information, read the media file */
        if (width <= 0 || height <= 0) {
            @Nullable AssetFileDescriptor mediaDescriptor = null;
            try {
                mediaDescriptor = resolver.openAssetFileDescriptor(photoUri, "r");
            } catch (FileNotFoundException e) {
                success = false;
                FLog.e(ReactConstants.TAG, "Could not open asset file " + photoUri.toString(), e);
            }
            if (mediaDescriptor != null) {
                if (isVideo) {
                    MediaMetadataRetriever retriever = new MediaMetadataRetriever();
                    try {
                        retriever.setDataSource(mediaDescriptor.getFileDescriptor());
                    } catch (RuntimeException e) {
                        // Do nothing. We can't handle this, and this is usually a system problem
                    }
                    try {
                        width = Integer.parseInt(retriever.extractMetadata(MediaMetadataRetriever.METADATA_KEY_VIDEO_WIDTH));
                        height = Integer.parseInt(retriever.extractMetadata(MediaMetadataRetriever.METADATA_KEY_VIDEO_HEIGHT));
                    } catch (NumberFormatException e) {
                        success = false;
                        FLog.e(
                                ReactConstants.TAG,
                                "Number format exception occurred while trying to fetch video metadata for "
                                        + photoUri.toString(),
                                e);
                    }
                    try {
                        retriever.release();
                    } catch (Exception e) { // Use general Exception here, see: https://developer.android.com/reference/android/media/MediaMetadataRetriever#release()
                        // Do nothing. We can't handle this, and this is usually a system problem
                    }
                } else {
                    BitmapFactory.Options options = new BitmapFactory.Options();
                    // Set inJustDecodeBounds to true so we don't actually load the Bitmap, but only get its
                    // dimensions instead.
                    options.inJustDecodeBounds = true;
                    BitmapFactory.decodeFileDescriptor(mediaDescriptor.getFileDescriptor(), null, options);
                    width = options.outWidth;
                    height = options.outHeight;
                }

                try {
                    mediaDescriptor.close();
                } catch (IOException e) {
                    FLog.e(
                            ReactConstants.TAG,
                            "Can't close media descriptor "
                                    + photoUri.toString(),
                            e);
                }
            }

        }

        if(!media.isNull(orientationIndex)) {
            int orientation = media.getInt(orientationIndex);
            if (orientation >= 0 && orientation % 180 != 0) {
                int temp = width;
                width = height;
                height = temp;
            }
        }

        image.putInt("width", width);
        image.putInt("height", height);
        return success;
    }

    private static boolean putPlayableDuration(
            ContentResolver resolver,
            WritableMap image,
            Uri photoUri,
            boolean isVideo,
            boolean includePlayableDuration) {
        image.putNull("playableDuration");

        if (!includePlayableDuration || !isVideo) {
            return true;
        }

        boolean success = true;
        @Nullable Integer playableDuration = null;
        @Nullable AssetFileDescriptor photoDescriptor = null;
        try {
            photoDescriptor = resolver.openAssetFileDescriptor(photoUri, "r");
        } catch (FileNotFoundException e) {
            success = false;
            FLog.e(ReactConstants.TAG, "Could not open asset file " + photoUri.toString(), e);
        }

        if (photoDescriptor != null) {
            MediaMetadataRetriever retriever = new MediaMetadataRetriever();
            try {
                retriever.setDataSource(photoDescriptor.getFileDescriptor());
            } catch (RuntimeException e) {
                // Do nothing. We can't handle this, and this is usually a system problem
            }
            try {
                int timeInMillisecond = Integer.parseInt(retriever.extractMetadata(MediaMetadataRetriever.METADATA_KEY_DURATION));
                playableDuration = timeInMillisecond / 1000;
            } catch (NumberFormatException e) {
                success = false;
                FLog.e(
                        ReactConstants.TAG,
                        "Number format exception occurred while trying to fetch video metadata for "
                                + photoUri.toString(),
                        e);
            }
            try {
                retriever.release();
            } catch (Exception e) { // Use general Exception here, see: https://developer.android.com/reference/android/media/MediaMetadataRetriever#release()
                // Do nothing. We can't handle this, and this is usually a system problem
            }
        }

        if (photoDescriptor != null) {
            try {
                photoDescriptor.close();
            } catch (IOException e) {
                // Do nothing. We can't handle this, and this is usually a system problem
            }
        }

        if (playableDuration != null) {
            image.putInt("playableDuration", playableDuration);
        }

        return success;
    }
}
