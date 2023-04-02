package com.opencloudphotos;
import com.facebook.common.logging.FLog;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.common.ReactConstants;
import com.reactnativecommunity.cameraroll.Utils;

import android.content.ContentResolver;
import android.os.Build;
import android.os.FileUtils;
import android.provider.MediaStore.Images;

import android.content.ContentValues;
import android.net.Uri;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Map;
import java.util.HashMap;

import android.os.Environment;
import android.provider.MediaStore;
import android.text.TextUtils;
import android.util.Log;

import androidx.annotation.RequiresApi;

public class MainModule extends ReactContextBaseJavaModule{
    MainModule(ReactApplicationContext context) {
        super(context);
    }


    @Override
    public String getName() {
        return "MainModule";
    }

    private String getRestoredMediaAbsolutePathPrivate(){
        return Environment.getExternalStorageDirectory() + File.separator + getRestoredMediaRelativePath();
    }

    @ReactMethod
    public void getRestoredMediaAbsolutePath(Promise promise){
        promise.resolve(getRestoredMediaAbsolutePathPrivate());
    }

    private String getRestoredMediaRelativePath(){
        return Environment.DIRECTORY_DCIM + File.separator + "Restored";
    }

    @RequiresApi(api = Build.VERSION_CODES.Q)
    @ReactMethod
    public void saveToRestored(String uri, ReadableMap mOptions, Promise mPromise) {
        Uri mUri = Uri.parse(uri);
        ReactContext mContext = getReactApplicationContext();
        File source = new File(mUri.getPath());
        FileInputStream input = null;
        OutputStream output = null;

        String mimeType = Utils.getMimeType(mUri.getPath());
        Boolean isVideo = mimeType != null && mimeType.contains("video");

        try {
            String name = mOptions.getString("name");
            boolean isNamePresent = !TextUtils.isEmpty(name);

            ContentValues mediaDetails = new ContentValues();
            String relativePath = getRestoredMediaRelativePath();
            mediaDetails.put(MediaStore.MediaColumns.RELATIVE_PATH, relativePath);
            mediaDetails.put(MediaStore.MediaColumns.MIME_TYPE, mimeType);

            if(!isNamePresent){
                name = source.getName();
            }
            mediaDetails.put(Images.Media.DISPLAY_NAME, name);

            mediaDetails.put(Images.Media.IS_PENDING, 1);
            ContentResolver resolver = mContext.getContentResolver();
            Uri mediaContentUri = isVideo
                    ? resolver.insert(MediaStore.Video.Media.EXTERNAL_CONTENT_URI, mediaDetails)
                    : resolver.insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, mediaDetails);
            output = resolver.openOutputStream(mediaContentUri);
            input = new FileInputStream(source);
            FileUtils.copy(input, output);
            mediaDetails.clear();
            mediaDetails.put(MediaStore.Images.Media.IS_PENDING, 0);
            resolver.update(mediaContentUri, mediaDetails, null, null);
            mPromise.resolve(getRestoredMediaAbsolutePathPrivate() + File.separator + name);
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
}