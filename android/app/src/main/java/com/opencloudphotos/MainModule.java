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
import android.media.ExifInterface;
import android.os.Build;
import android.os.FileUtils;
import android.provider.MediaStore.Images;

import android.content.ContentValues;
import android.net.Uri;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.security.Timestamp;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Locale;
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
                    : resolver.insert(Images.Media.EXTERNAL_CONTENT_URI, mediaDetails);
            output = resolver.openOutputStream(mediaContentUri);
            input = new FileInputStream(source);
            FileUtils.copy(input, output);

            long datetime_original = 0L;
            try {
                ExifInterface exifInterface = new ExifInterface(source.getPath());

                String date_time = exifInterface.getAttribute(
                        ExifInterface.TAG_DATETIME_ORIGINAL);

                DateFormat df = new SimpleDateFormat("yyyy:MM:dd HH:mm:ss");
                Date date = df.parse(date_time);

                if(date == null){
                    Log.e("Tag", "Could not parse date from exif data");
                }else{
                    datetime_original = date.getTime();
                }

            } catch (IOException | ParseException e) {
                Log.e("Tag", e.getMessage());
            }

            mediaDetails.clear();
            mediaDetails.put(Images.Media.IS_PENDING, 0);
            if(datetime_original != 0){
                mediaDetails.put(MediaStore.MediaColumns.DATE_ADDED, datetime_original/1000);
            }
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