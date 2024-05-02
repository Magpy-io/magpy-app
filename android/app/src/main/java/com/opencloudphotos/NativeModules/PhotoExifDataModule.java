package com.opencloudphotos.NativeModules;

import android.media.ExifInterface;
import android.net.Uri;
import android.os.Build;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

public class PhotoExifDataModule extends ReactContextBaseJavaModule {
    public PhotoExifDataModule(ReactApplicationContext context) {
        super(context);
    }

    @NonNull
    @Override
    public String getName() {
        return "PhotoExifDataModule";
    }

    @RequiresApi(api = Build.VERSION_CODES.N)
    @ReactMethod
    public void getPhotoExifDate(String uri, Promise mPromise) {
        try {

            Uri mUri = Uri.parse(uri);
            ExifInterface exifInterface = new ExifInterface(mUri.getPath());

            String date_time = exifInterface.getAttribute(
                    ExifInterface.TAG_DATETIME_ORIGINAL);

            DateFormat df = new SimpleDateFormat("yyyy:MM:dd HH:mm:ss");
            Date date = df.parse(date_time);

            if(date == null){
                Log.e("Tag", "Could not parse date from exif data");
            }else{
                mPromise.resolve((double)(date.getTime() / 1000));
            }

        } catch (Exception e) {
            mPromise.resolve(-1);
        }
    }
}