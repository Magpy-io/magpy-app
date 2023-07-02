package com.opencloudphotos;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import android.util.Log;

import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;
import androidx.core.app.NotificationCompat;

import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.Objects;

public class SendingMediaForegroundService extends HeadlessJsTaskService {

    private class MyRunnable implements Runnable {

        SendingMediaForegroundService service;

        public MyRunnable(SendingMediaForegroundService p_service){
            service = p_service;
        }

        @Override
        public void run() {
            // Stop the foreground service and remove its notification
            service.stopForeground(true);

            // TODO Send event

            service.state = "FAILED";
        }
    }

    private static SendingMediaForegroundService instance;

    public String[] ids;
    public String[] names;
    public String[] dates;
    public String[] paths ;
    public int[] widths;
    public int[] heights;
    public int[] sizes;
    public int index;

    public String state;

    public Notification notification;
    public NotificationCompat.Builder notificationBuilder;

    private Handler handler;
    private MyRunnable timeoutRunnable;

    @Override
    public void onCreate() {
        instance = this;
        handler = new Handler();
        timeoutRunnable = new MyRunnable(this);
        super.onCreate();
    }

    @Override
    public void onDestroy() {
        instance = null;
        if(handler != null && timeoutRunnable != null){
            handler.removeCallbacks(timeoutRunnable);
        }
        super.onDestroy();
    }

    public static SendingMediaForegroundService getInstance(){
        return  instance;
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {

        state = "STARTUP";

        final String CHANNEL_ID = "Foreground Service ID";
        NotificationChannel channel = new NotificationChannel(
                CHANNEL_ID,
                CHANNEL_ID,
                NotificationManager.IMPORTANCE_HIGH
        );

        getSystemService(NotificationManager.class).createNotificationChannel(channel);

        notificationBuilder = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("OpenCloudPhotos")
                .setContentText("Uploading photos")
                .setSmallIcon(R.mipmap.ic_launcher)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setProgress(100, 0, true);

        notification = notificationBuilder.build();
        startForeground(1001, notification);

        return super.onStartCommand(intent, flags, startId);
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    public void sendPhotos(Bundle b){
        ids = b.getStringArray("ids");
        names = b.getStringArray("names");
        dates = b.getStringArray("dates");
        paths = b.getStringArray("paths");
        widths = b.getIntArray("widths");
        heights = b.getIntArray("heights");
        sizes = b.getIntArray("sizes");

        state = "ACTIVE";

        startNextTask();

        notificationBuilder
                .setProgress(ids.length, 0, false)
                .setContentText("Uploading photos ( " + Integer.toString(0) + " out of " + Integer.toString(ids.length) + " )");

        getSystemService(NotificationManager.class).notify(1001, notificationBuilder.build());
    }

    public void startNextTask(){
        //TODO add timer

        handler.postDelayed(timeoutRunnable, 10000);

        Bundle b = new Bundle();

        b.putString("path", paths[index]);
        b.putString("name", names[index]);
        b.putString("date", dates[index]);
        b.putInt("height", heights[index]);
        b.putInt("width", widths[index]);
        b.putInt("size", sizes[index]);

        try{
            startTask(new HeadlessJsTaskConfig("MyTask", Arguments.fromBundle(b), 9000, true));
        }catch (Exception e){
            Log.e("Service", e.getMessage());
        }

    }

    private void sendEvent(String eventName, @Nullable WritableMap params){

        ReactContext reactContext;
        try{
            ReactInstanceManager reactInstanceManager = getReactNativeHost().getReactInstanceManager();
            reactContext = reactInstanceManager.getCurrentReactContext();
        }catch (Exception e){
            Log.e("Service", "Exception while getting reactContext : " + e.toString());
            return;
        }

        if(reactContext != null) {
            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(eventName, params);
        }
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    public void onTaskFinished(String code){

        handler.removeCallbacks(timeoutRunnable);

        if(!Objects.equals(state, "ACTIVE")){
            return;
        }

        if(!Objects.equals(code, "SUCCESS")){
            // Stop the foreground service and remove its notification
            stopForeground(true);

            // TODO Send event

            state = "FAILED";
            return;
        }
        index++;

        WritableMap params = new WritableNativeMap();
        params.putString("state", state);

        sendEvent("PhotoUploaded", params);


        notificationBuilder
                .setProgress(ids.length, index, false)
                .setContentText("Uploading photos ( " + Integer.toString(index) + " out of " + Integer.toString(ids.length) + " )");

        getSystemService(NotificationManager.class).notify(1001, notificationBuilder.build());

        if(index < ids.length){
            startNextTask();
        }else{
            // Stop the foreground service and remove its notification
            stopForeground(true);
            state = "INACTIVE";
            //TODO Send event
        }
    }

    public void stopService(){
        state = "DESTROYED";
        Log.d("Service", "Killing service");
        stopSelf();
    }

    @Override
    public void onHeadlessJsTaskFinish(int taskId) {

    }

    public String[] getIds(){
        return ids;
    }

    public int getCurrentIndex(){
        return index;
    }
}
