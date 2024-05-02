package com.opencloudphotos.Services;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import android.util.Log;
import com.opencloudphotos.Utils.BridgeFunctions;

import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;
import androidx.core.app.NotificationCompat;

import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;
import com.facebook.react.bridge.Arguments;
import com.opencloudphotos.R;

import java.util.Objects;

public class SendingMediaForegroundService extends HeadlessJsTaskService {

    private class MyRunnable implements Runnable {

        SendingMediaForegroundService service;

        public MyRunnable(SendingMediaForegroundService p_service){
            service = p_service;
        }

        @Override
        public void run() {
            Log.d("Service", "runnable: upload timed out stopping service");
            // Stop the foreground service and remove its notification
            service.stopForeground(true);

            // TODO Send event

            service.state = "FAILED";
        }
    }

    private static SendingMediaForegroundService instance;

    public String[] ids;
    public int index;

    public String state = "DESTROYED";

    public Notification notification;
    public NotificationCompat.Builder notificationBuilder;

    private Handler handler;
    private MyRunnable timeoutRunnable;

    @Override
    public void onCreate() {
        Log.d("Service", "SendingMediaForegroundService: onCreate");
        instance = this;
        handler = new Handler();
        timeoutRunnable = new MyRunnable(this);
        super.onCreate();
    }

    @Override
    public void onDestroy() {
        Log.d("Service", "SendingMediaForegroundService: onDestroy");
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
        Log.d("Service", "onStartCommand: started");
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

        state = "INACTIVE";
        Log.d("Service", "onStartCommand: finished");
        return super.onStartCommand(intent, flags, startId);
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    public void sendPhotos(Bundle b){
        Log.d("Service", "service sendPhotos: started");

        ids = b.getStringArray("ids");

        state = "ACTIVE";

        Log.d("Service", "service sendPhotos: startNextTask");
        startNextTask();

        Log.d("Service", "service sendPhotos: creating notification");
        notificationBuilder
                .setProgress(ids.length, 0, false)
                .setContentText("Uploading photos ( " + Integer.toString(0) + " out of " + Integer.toString(ids.length) + " )");

        getSystemService(NotificationManager.class).notify(1001, notificationBuilder.build());

        Log.d("Service", "service sendPhotos: finished");
    }

    public void startNextTask(){
        //TODO add timer
        Log.d("Service", "service startNextTask: started");
        handler.postDelayed(timeoutRunnable, 60000);

        Bundle b = new Bundle();

        b.putString("mediaId", ids[index]);

        Log.d("Service", "service startNextTask: start js task");
        try{
            Runnable myRunnable = new Runnable() {
                @Override
                public void run() {
                    startTask(new HeadlessJsTaskConfig("MyTask", Arguments.fromBundle(b), 59000, true));
                }
            };

            UiThreadUtil.runOnUiThread(myRunnable);


        }catch (Exception e){
            Log.e("Service", e.getMessage());
        }
        Log.d("Service", "service startNextTask: finished");
    }

    private void sendEvent(String eventName, @Nullable WritableMap params){
        Log.d("Service", "service sendEvent: started with "+ eventName);
        ReactContext reactContext;
        try{
            ReactInstanceManager reactInstanceManager = getReactNativeHost().getReactInstanceManager();
            reactContext = reactInstanceManager.getCurrentReactContext();
        }catch (Exception e){
            Log.e("Service", "Exception while getting reactContext : " + e.toString());
            return;
        }

        BridgeFunctions.sendEvent(reactContext, eventName, params);
        Log.d("Service", "service sendEvent: finished");
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    public void onTaskFinished(String code, String id){
        Log.d("Service", "service onTaskFinished: started");
        handler.removeCallbacks(timeoutRunnable);

        if(!Objects.equals(state, "ACTIVE")){
            Log.d("Service", "service onTaskFinished, not active, do nothing");
            return;
        }

        if(!Objects.equals(code, "SUCCESS")){

            Log.d("Service", "service onTaskFinished, not success, set state to failed");

            // Stop the foreground service and remove its notification
            stopForeground(true);

            // TODO Send event

            state = "FAILED";
            return;
        }

        Log.d("Service", "service onTaskFinished, send event photoUploaded");

        WritableMap params = new WritableNativeMap();
        params.putString("state", state);
        params.putString("serverId", id);
        params.putString("mediaId", ids[index]);
        sendEvent("PhotoUploaded", params);

        index++;

        notificationBuilder
                .setProgress(ids.length, index, false)
                .setContentText("Uploading photos ( " + Integer.toString(index) + " out of " + Integer.toString(ids.length) + " )");

        getSystemService(NotificationManager.class).notify(1001, notificationBuilder.build());


        if(index < ids.length){
            Log.d("Service", "service onTaskFinished, more photos pending, start next");
            startNextTask();
        }else{
            Log.d("Service", "service onTaskFinished, no more photos, set state to inactive");
            // Stop the foreground service and remove its notification
            stopForeground(true);
            state = "INACTIVE";
            //TODO Send event

            this.stopService();
        }
        Log.d("Service", "service onTaskFinished: finished");
    }

    public void stopService(){
        state = "DESTROYED";
        Log.d("Service", "service stopService");
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
