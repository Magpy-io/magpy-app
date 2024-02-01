package com.opencloudphotos;

import com.facebook.common.logging.FLog;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.common.ReactConstants;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.reactnativecommunity.cameraroll.Utils;

import android.app.ActivityManager;
import android.content.ContentResolver;
import android.content.Context;
import android.content.Intent;
import android.media.ExifInterface;
import android.os.Build;
import android.os.Bundle;
import android.os.FileUtils;
import android.provider.MediaStore.Images;

import android.content.ContentValues;
import android.net.Uri;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import android.os.Environment;
import android.provider.MediaStore;
import android.text.TextUtils;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;

public class MainModule extends ReactContextBaseJavaModule{
    MainModule(ReactApplicationContext context) {
        super(context);
    }


    @NonNull
    @Override
    public String getName() {
        return "MainModule";
    }

    public static void sendEvent(ReactContext reactContext, String eventName, @Nullable WritableMap params){
        if(reactContext != null) {
            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(eventName, params);
        }
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

            } catch (Exception e) {
                Log.e("Tag", e.getMessage());
                if(source.exists()) {
                    datetime_original = source.lastModified();
                }
            }

            mediaDetails.clear();
            mediaDetails.put(Images.Media.IS_PENDING, 0);
            if(datetime_original != 0){
                mediaDetails.put(MediaStore.MediaColumns.DATE_ADDED, datetime_original/1000);
            }
            resolver.update(mediaContentUri, mediaDetails, null, null);
            mPromise.resolve(getRestoredMediaAbsolutePathPrivate() + File.separator + name);
        } catch (Exception e) {
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

    @RequiresApi(api = Build.VERSION_CODES.Q)
    public boolean isServiceRunningInner(){
        //TODO change how to check for service running (maybe using broadcast receivers), getRunningServices is deprecated
        ReactContext context = getReactApplicationContext();
        ActivityManager activityManager = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
        for(ActivityManager.RunningServiceInfo service: activityManager.getRunningServices(Integer.MAX_VALUE)) {
            if(SendingMediaForegroundService.class.getName().equals(service.service.getClassName())) {
                return true;
            }
        }
        return false;
    }

    @RequiresApi(api = Build.VERSION_CODES.Q)
    @ReactMethod
    public void getServiceState(Promise promise){
        if(!isServiceRunningInner()){
            promise.resolve("DESTROYED");
        }else{
            if(SendingMediaForegroundService.getInstance() != null){
                promise.resolve(SendingMediaForegroundService.getInstance().state);
            }else{
                promise.resolve("DESTROYED");
                Log.e("Service", "getServiceState: isServiceRunningInner true but instance is null");
            }
        }
    }

    @RequiresApi(api = Build.VERSION_CODES.Q)
    @ReactMethod
    public void getIds(Promise promise){
        if(!isServiceRunningInner()){
            promise.reject("SERVICE_NOT_RUNNING", "Service not running");
            return;
        }
        String[] ids = SendingMediaForegroundService.getInstance().getIds();

        if(ids == null){
            ids = new String[0];
        }

        WritableArray retArray = Arguments.createArray();

        for (String id : ids) {
            retArray.pushString(id);
        }
        promise.resolve((retArray));
    }

    @RequiresApi(api = Build.VERSION_CODES.Q)
    @ReactMethod
    public void getCurrentIndex(Promise promise){
        if(!isServiceRunningInner()){
            promise.reject("SERVICE_NOT_RUNNING", "Service not running");
            return;
        }

        double index = (double)SendingMediaForegroundService.getInstance().getCurrentIndex();
        promise.resolve(index);
    }

    @RequiresApi(api = Build.VERSION_CODES.Q)
    @ReactMethod
    public void startSendingMediaService(ReadableArray photoMediaIds, Promise promise){
        Log.d("Service", "startSendingMediaService: started");
        if(isServiceRunningInner()){
            Log.d("Service", "startSendingMediaService: error server running");
            promise.reject("SERVICE_RUNNING", "Service running");
            return;
        }

        ReactContext context = getReactApplicationContext();
        Intent serviceIntent = new Intent(context,
                SendingMediaForegroundService.class);

        Log.d("Service", "startSendingMediaService: Start foreground service");
        context.startForegroundService(serviceIntent);

        String[] ids = new String[photoMediaIds.size()];

        for(int i=0; i<photoMediaIds.size(); i++){
            ids[i] = photoMediaIds.getString(i);
        }

        Bundle b = new Bundle();
        b.putStringArray("ids", ids);

        Log.d("Service", "startSendingMediaService: waiting for instance creation");
        int waitCounter = 0;
        while((SendingMediaForegroundService.getInstance() == null || SendingMediaForegroundService.getInstance().state != "INACTIVE") && waitCounter < 10){
            waitCounter++;
            Log.d("Service", "startSendingMediaService: waitCounter : " + Integer.toString(waitCounter));
            try {
                Thread.sleep(10);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        if(waitCounter >= 10){
            promise.reject("ERROR_INIT_SERVICE_IN_TIME","Exception in startSendingMediaService. SendingMediaForegroundService not initialized before trying to send data to thread (sendDataToThread)");
            Log.e("Service", "Exception in startSendingMediaService. SendingMediaForegroundService not initialized before trying to send data to thread (sendDataToThread)");
            context.stopService(serviceIntent);
            return;
        }else{
            Log.d("Service", "startSendingMediaService: service instance created");
        }
        Log.d("Service", "startSendingMediaService: sending photos to foreground service");
        SendingMediaForegroundService.getInstance().sendPhotos(b);
        promise.resolve(null);
        Log.d("Service", "startSendingMediaService: finished");
    }

    @RequiresApi(api = Build.VERSION_CODES.Q)
    @ReactMethod
    public void onJsTaskFinished(ReadableMap data){
        Log.d("Service", "onJsTaskFinished: started");
        String returnCode = data.getString("code");
        String serverId = data.getString("id");
        if(isServiceRunningInner()){
            Log.d("Service", "onJsTaskFinished: isServiceRunningInner true");
            if(SendingMediaForegroundService.getInstance() != null){
                if(SendingMediaForegroundService.getInstance().state.equals("ACTIVE")){
                    Log.d("Service", "onJsTaskFinished: calling sendingMediaServiceOnTaskFinished");
                    SendingMediaForegroundService.getInstance().onTaskFinished(returnCode, serverId);
                }else{
                    Log.d("Service", "onJsTaskFinished: service isServiceRunningInner but not active");
                }
            }else{
                Log.e("Service", "onJsTaskFinished: Service isServiceRunningInner but instance is null");
            }
        }else{
            Log.d("Service", "onJsTaskFinished: isServiceRunningInner false");
        }

        Log.d("Service", "onJsTaskFinished: finished");
    }

    @RequiresApi(api = Build.VERSION_CODES.Q)
    @ReactMethod
    public void stopSendingMediaService(Promise promise){
        Log.d("Service", "stopSendingMediaService: started");
        if(!isServiceRunningInner()){
            Log.d("Service", "stopSendingMediaService: cannot stop, already stopped");
            promise.reject("SERVICE_NOT_RUNNING", "Service not running");
            return;
        }
        Log.d("Service", "stopSendingMediaService: stopping service");
        SendingMediaForegroundService.getInstance().stopService();
        promise.resolve(null);
        Log.d("Service", "stopSendingMediaService: finished");
    }

    @ReactMethod
    public void enableFullScreen(Promise promise){
        UiThreadUtil.runOnUiThread(
                new Runnable() {
                    @Override
                    public void run() {
                        WindowInsetsControllerCompat windowInsetsController =
                                WindowCompat.getInsetsController(getCurrentActivity().getWindow(), getCurrentActivity().getWindow().getDecorView());
                        windowInsetsController.hide(WindowInsetsCompat.Type.systemBars());
                    }
                }
        );
        promise.resolve(null);
    }

    @ReactMethod
    public void disableFullScreen(Promise promise){
        UiThreadUtil.runOnUiThread(
                new Runnable() {
                    @Override
                    public void run() {
                        WindowInsetsControllerCompat windowInsetsController =
                                WindowCompat.getInsetsController(getCurrentActivity().getWindow(), getCurrentActivity().getWindow().getDecorView());
                        windowInsetsController.show(WindowInsetsCompat.Type.systemBars());
                    }
                }
        );
        promise.resolve(null);
    }

    @ReactMethod
    public void getWindowInsets(Promise promise){
        WritableMap insets = new WritableNativeMap();
        boolean valid = MyStaticClasses.GetWindowInsets.getTop() != null &&
                MyStaticClasses.GetWindowInsets.getBottom() != null &&
                MyStaticClasses.GetWindowInsets.getRight() != null &&
                MyStaticClasses.GetWindowInsets.getLeft() != null;

        insets.putBoolean("valid", valid);
        if(valid){
            insets.putInt("top", MyStaticClasses.GetWindowInsets.getTop());
            insets.putInt("bottom", MyStaticClasses.GetWindowInsets.getBottom());
            insets.putInt("right", MyStaticClasses.GetWindowInsets.getRight());
            insets.putInt("left", MyStaticClasses.GetWindowInsets.getLeft());
            insets.putBoolean("isFullScreen", MyStaticClasses.GetWindowInsets.IsFullScreen());
        }

        promise.resolve(insets);
    }
}