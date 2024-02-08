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
import android.content.ContentUris;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
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

    private static final String[] PROJECTION = {
            Images.Media._ID,
            Images.Media.MIME_TYPE,
            Images.Media.BUCKET_DISPLAY_NAME,
            Images.Media.DATE_TAKEN,
            MediaStore.MediaColumns.DATE_ADDED,
            MediaStore.MediaColumns.DATE_MODIFIED,
            MediaStore.MediaColumns.WIDTH,
            MediaStore.MediaColumns.HEIGHT,
            MediaStore.MediaColumns.SIZE,
            MediaStore.MediaColumns.DATA,
            MediaStore.MediaColumns.ORIENTATION,
    };

    @ReactMethod
    public void getPhotoById(String id, Promise mPromise) {
        Uri external_images_uri = MediaStore.Files.getContentUri("external");
        Uri imageUri = Uri.withAppendedPath(external_images_uri, id);
        ContentResolver cr = getReactApplicationContext().getContentResolver();

        Cursor cursor = cr.query(
                imageUri,
                PROJECTION,
                null,
                null,
                null);

        if(cursor != null){
            try
            {
                if (cursor.moveToFirst()) {
                    WritableMap node = new WritableNativeMap();

                    int idIndex = cursor.getColumnIndex(Images.Media._ID);
                    int mimeTypeIndex = cursor.getColumnIndex(Images.Media.MIME_TYPE);
                    int groupNameIndex = cursor.getColumnIndex(Images.Media.BUCKET_DISPLAY_NAME);
                    int dateTakenIndex = cursor.getColumnIndex(Images.Media.DATE_TAKEN);
                    int dateAddedIndex = cursor.getColumnIndex(MediaStore.MediaColumns.DATE_ADDED);
                    int dateModifiedIndex = cursor.getColumnIndex(MediaStore.MediaColumns.DATE_MODIFIED);
                    int widthIndex = cursor.getColumnIndex(MediaStore.MediaColumns.WIDTH);
                    int heightIndex = cursor.getColumnIndex(MediaStore.MediaColumns.HEIGHT);
                    int sizeIndex = cursor.getColumnIndex(MediaStore.MediaColumns.SIZE);
                    int dataIndex = cursor.getColumnIndex(MediaStore.MediaColumns.DATA);
                    int orientationIndex = cursor.getColumnIndex(MediaStore.MediaColumns.ORIENTATION);


                    long idNumber = cursor.getLong(idIndex);
                    String mimeType = cursor.getString(mimeTypeIndex);
                    boolean isVideo = mimeType != null && mimeType.startsWith("video");


                    node.putString("id", Long.toString(idNumber));
                    node.putString("type", mimeType);
                    WritableArray group_name = Arguments.createArray();
                    group_name.pushString(cursor.getString(groupNameIndex));
                    node.putArray("group_name", group_name);
                    long dateTaken = cursor.getLong(dateTakenIndex);
                    if (dateTaken == 0L) {
                        //date added is in seconds, date taken in milliseconds, thus the multiplication
                        dateTaken = cursor.getLong(dateAddedIndex) * 1000;
                    }
                    node.putDouble("timestamp", dateTaken / 1000d);
                    node.putDouble("modificationTimestamp", cursor.getLong(dateModifiedIndex));

                    Uri photoUri = Uri.parse("file://" + cursor.getString(dataIndex));
                    node.putString("uri", photoUri.toString());

                    File file = new File(cursor.getString(dataIndex));
                    String strFileName = file.getName();
                    node.putString("filename", strFileName);

                    node.putDouble("fileSize", cursor.getLong(sizeIndex));

                    int width = cursor.getInt(widthIndex);
                    int height = cursor.getInt(heightIndex);

                    if(!cursor.isNull(orientationIndex)) {
                        int orientation = cursor.getInt(orientationIndex);
                        if (orientation >= 0 && orientation % 180 != 0) {
                            int temp = width;
                            width = height;
                            height = temp;
                        }
                    }

                    node.putDouble("width", width);
                    node.putDouble("height", height);

                    if(width <= 0 || height <= 0){
                        Log.d("Tag", "no width or height");
                        throw new Exception("Media height or width not found.");
                    }

                    mPromise.resolve(node);
                }else{
                    Log.d("Tag", "Media id not found");
                    mPromise.reject("GetPhotoByIdError", "Media id not found");
                }
            }
            catch(Exception e){
                Log.d("Tag", e.toString());
                mPromise.reject("GetPhotoByIdError", e);
            }
            finally {
                cursor.close();
            }
        }else{
            mPromise.reject("GetPhotoByIdError", "Could not get cursor from ContentProvider query.");
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
    public void startSendingMediaService(ReadableArray photos, Promise promise){
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

        String[] ids = new String[photos.size()];
        String[] names = new String[photos.size()];
        String[] dates = new String[photos.size()];
        String[] paths = new String[photos.size()];
        int[] widths = new int[photos.size()];
        int[] heights = new int[photos.size()];
        int[] sizes = new int[photos.size()];

        for(int i=0; i<photos.size(); i++){
            ids[i] = photos.getMap(i).getString("id");
            names[i] = photos.getMap(i).getString("name");
            dates[i] = photos.getMap(i).getString("date");
            paths[i] = photos.getMap(i).getString("path");
            widths[i] = photos.getMap(i).getInt("width");
            heights[i] = photos.getMap(i).getInt("height");
            sizes[i] = photos.getMap(i).getInt("size");
        }

        Bundle b = new Bundle();
        b.putStringArray("ids", ids);
        b.putStringArray("names", names);
        b.putStringArray("dates", dates);
        b.putStringArray("paths", paths);
        b.putIntArray("widths", widths);
        b.putIntArray("heights", heights);
        b.putIntArray("sizes", sizes);


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