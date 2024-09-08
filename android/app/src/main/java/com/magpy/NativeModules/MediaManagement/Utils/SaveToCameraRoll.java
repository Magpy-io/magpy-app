package com.magpy.NativeModules.MediaManagement.Utils;

import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.media.MediaScannerConnection;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.os.FileUtils;
import android.provider.MediaStore;
import android.text.TextUtils;

import com.facebook.common.logging.FLog;
import com.facebook.react.bridge.GuardedAsyncTask;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.common.ReactConstants;
import com.reactnativecommunity.cameraroll.Utils;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Set;

public class SaveToCameraRoll extends GuardedAsyncTask<Void, Void> {

    private final Context mContext;
    private final Uri mUri;
    private final Promise mPromise;
    private final ReadableMap mOptions;

    public SaveToCameraRoll(ReactContext context, Uri uri, ReadableMap options, Promise promise) {
        super(context);
        mContext = context;
        mUri = uri;
        mPromise = promise;
        mOptions = options;
    }

    @Override
    protected void doInBackgroundGuarded(Void... params) {
        File source = new File(mUri.getPath());
        FileInputStream input = null;
        OutputStream output = null;

        String mimeType = Utils.getMimeType(mUri.toString());
        Boolean isVideo = mimeType != null && mimeType.contains("video");

        try {
            String album = mOptions.getString("album");
            boolean isAlbumPresent = !TextUtils.isEmpty(album);

            // Android Q and above
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                ContentValues mediaDetails = new ContentValues();
                if (isAlbumPresent) {
                    String relativePath = Environment.DIRECTORY_DCIM + File.separator + album;
                    mediaDetails.put(MediaStore.MediaColumns.RELATIVE_PATH, relativePath);
                }
                mediaDetails.put(MediaStore.MediaColumns.MIME_TYPE, mimeType);
                mediaDetails.put(MediaStore.Images.Media.DISPLAY_NAME, source.getName());
                mediaDetails.put(MediaStore.Images.Media.IS_PENDING, 1);
                ContentResolver resolver = mContext.getContentResolver();
                Uri mediaContentUri = isVideo
                        ? resolver.insert(MediaStore.Video.Media.EXTERNAL_CONTENT_URI, mediaDetails)
                        : resolver.insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, mediaDetails);
                if (mediaContentUri == null) {
                    mPromise.reject(Definitions.ERROR_UNABLE_TO_LOAD, "ContentResolver#insert() returns null, insert failed");
                }
                output = resolver.openOutputStream(mediaContentUri);
                input = new FileInputStream(source);
                FileUtils.copy(input, output);
                mediaDetails.clear();
                mediaDetails.put(MediaStore.Images.Media.IS_PENDING, 0);
                resolver.update(mediaContentUri, mediaDetails, null, null);

                WritableMap asset = getSingleAssetInfo(mediaContentUri);
                mPromise.resolve(asset);
            } else {
                final File environment;
                // Media is not saved into an album when using Environment.DIRECTORY_DCIM.
                if (isAlbumPresent) {
                    if ("video".equals(mOptions.getString("type"))) {
                        environment = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_MOVIES);
                    } else {
                        environment = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES);
                    }
                } else {
                    environment = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DCIM);
                }
                File exportDir;
                if (isAlbumPresent) {
                    exportDir = new File(environment, album);
                    if (!exportDir.exists() && !exportDir.mkdirs()) {
                        mPromise.reject(Definitions.ERROR_UNABLE_TO_LOAD, "Album Directory not created. Did you request WRITE_EXTERNAL_STORAGE?");
                        return;
                    }
                } else {
                    exportDir = environment;
                }

                if (!exportDir.isDirectory()) {
                    mPromise.reject(Definitions.ERROR_UNABLE_TO_LOAD, "External media storage directory not available");
                    return;
                }

                File dest = new File(exportDir, source.getName());
                int n = 0;
                String fullSourceName = source.getName();
                String sourceName, sourceExt;
                if (fullSourceName.indexOf('.') >= 0) {
                    sourceName = fullSourceName.substring(0, fullSourceName.lastIndexOf('.'));
                    sourceExt = fullSourceName.substring(fullSourceName.lastIndexOf('.'));
                } else {
                    sourceName = fullSourceName;
                    sourceExt = "";
                }
                while (!dest.createNewFile()) {
                    dest = new File(exportDir, sourceName + "_" + (n++) + sourceExt);
                }
                input = new FileInputStream(source);
                output = new FileOutputStream(dest);
                ((FileOutputStream) output).getChannel()
                        .transferFrom(input.getChannel(), 0, input.getChannel().size());
                input.close();
                output.close();


                MediaScannerConnection.scanFile(
                        mContext,
                        new String[]{dest.getAbsolutePath()},
                        null,
                        (path, uri) -> {
                            if (uri != null) {
                                try {
                                    WritableMap asset = getSingleAssetInfo(uri);
                                    mPromise.resolve(asset);
                                } catch (Exception exc) {
                                    mPromise.reject(Definitions.ERROR_UNABLE_TO_SAVE, exc.getMessage());
                                }
                            } else {
                                mPromise.reject(Definitions.ERROR_UNABLE_TO_SAVE, "Could not add image to gallery");
                            }
                        });
            }
        } catch (IOException e) {
            mPromise.reject(e);
        } finally {
            if (input != null) {
                try {
                    input.close();
                } catch (IOException e) {
                    FLog.e(ReactConstants.TAG, "Could not close input channel", e);
                }
            }
            if (output != null) {
                try {
                    output.close();
                } catch (IOException e) {
                    FLog.e(ReactConstants.TAG, "Could not close output channel", e);
                }
            }
        }
    }

    private WritableMap getSingleAssetInfo(Uri assetUri) {
        ContentResolver resolver = mContext.getContentResolver();

        Cursor cursor = resolver.query(
                assetUri,
                Definitions.PROJECTION,
                null,
                null,
                null);
        if (cursor == null) {
            throw new RuntimeException("Failed to find the photo that was just saved!");
        }
        cursor.moveToFirst();
        WritableMap asset = MediaOperations.convertMediaToMap(resolver,
                cursor,
                Set.of(Definitions.INCLUDE_LOCATION,
                        Definitions.INCLUDE_FILENAME,
                        Definitions.INCLUDE_FILE_SIZE,
                        Definitions.INCLUDE_FILE_EXTENSION,
                        Definitions.INCLUDE_IMAGE_SIZE,
                        Definitions.INCLUDE_PLAYABLE_DURATION,
                        Definitions.INCLUDE_ORIENTATION,
                        Definitions.INCLUDE_ALBUMS));
        cursor.close();
        return asset;
    }
}

