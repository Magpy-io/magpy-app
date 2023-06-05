package com.opencloudphotos;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.os.IBinder;
import android.util.Log;

import androidx.annotation.RequiresApi;
import androidx.core.app.NotificationCompat;

import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;
import com.facebook.react.bridge.Arguments;

public class SendingMediaForegroundService extends HeadlessJsTaskService {

    private static SendingMediaForegroundService instance;

    public Bundle bundle;
    public String[] ids;
    public String[] names;
    public String[] dates;
    public String[] paths ;
    public int[] widths;
    public int[] heights;
    public int[] sizes;
    private Thread mainThread;
    private MyRunnable runnable;
    public Notification notification;
    public NotificationCompat.Builder notificationBuilder;
    public int index;

    @Override
    public void onCreate() {
        instance = this;
        super.onCreate();
    }

    @Override
    public void onDestroy() {
        instance = null;
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

        runnable = new MyRunnable();
        mainThread = new Thread(
                runnable
        );
        mainThread.start();

        return super.onStartCommand(intent, flags, startId);
    }

    public void startNextTask(){
        Bundle b = new Bundle();
        b.putString("index", Integer.toString(index));
        startTask(new HeadlessJsTaskConfig("MyTask", Arguments.fromBundle(b), 50000, true));
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    @Override
    public void onHeadlessJsTaskFinish(int taskId) {
        index++;

        notificationBuilder.setProgress(ids.length, index, false);
        this.getSystemService(NotificationManager.class).notify(1001, notificationBuilder.build());

        if(index < ids.length){
            startNextTask();
        }else{
            // Stop the foreground service and remove its notification
            stopForeground(true);
            // Stop the service
            stopSelf();
        }
    }

    public void sendDataToThread(Bundle b){
        bundle = b;
    }

    public String[] getIds(){
        return ids;
    }

    public int getCurrentIndex(){
        return index;
    }

    private class MyRunnable implements Runnable {

        @RequiresApi(api = Build.VERSION_CODES.M)
        @Override
        public void run() {
            Log.d("Service", "Started");

            SendingMediaForegroundService service = SendingMediaForegroundService.getInstance();

            try {
                Thread.sleep(3000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }

            notificationBuilder.setProgress(100, 0, false);
            ((Context)service).getSystemService(NotificationManager.class).notify(1001, notificationBuilder.build());


            int waitCounter = 0;
            while(service.bundle == null && waitCounter < 10){
                waitCounter++;
                Log.d("Service", Integer.toString(waitCounter));
                try {
                    Thread.sleep(100);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }

            if(waitCounter >= 10){
                Log.e("Service", "Exception in MyRunnable:SendingMediaForegroundService, bundle not received in time");
                stopForeground(true);
                stopSelf();
                return;
            }

            service.ids = service.bundle.getStringArray("ids");
            service.names = service.bundle.getStringArray("names");
            service.dates = service.bundle.getStringArray("dates");
            service.paths = service.bundle.getStringArray("paths");
            service.widths = service.bundle.getIntArray("widths");
            service.heights = service.bundle.getIntArray("heights");
            service.sizes = service.bundle.getIntArray("sizes");

            startNextTask();
            return;
            /*
            int nbPhotos = names.length;
            int lastProgress = 0;
            int newProgress = 0;
            for (int i=0; i<nbPhotos; i++) {
                Log.d("Service", names[i]);
                try {
                    Thread.sleep(3000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }

                index = i+1;

                newProgress = ((i+1) * 100)/nbPhotos;
                if(newProgress != lastProgress){
                    notificationBuilder.setProgress(100, newProgress, false);
                    ((Context)service).getSystemService(NotificationManager.class).notify(1001, notificationBuilder.build());
                    lastProgress = newProgress;
                }

            }
            Log.d("Service", "Finished");


            notificationBuilder.setProgress(100, 100, false);
            notificationBuilder.setContentText("Upload finished");
            ((Context)service).getSystemService(NotificationManager.class).notify(1001, notificationBuilder.build());

            try {
                Thread.sleep(3000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }


            // Stop the foreground service and remove its notification
            stopForeground(true);
            // Stop the service
            stopSelf();*/
        }
    }
}