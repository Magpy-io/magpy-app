package com.opencloudphotos.Workers;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.os.Build;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.core.app.NotificationCompat;
import androidx.work.ForegroundInfo;
import androidx.work.WorkManager;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

import com.opencloudphotos.R;

public class AutoBackupWorker extends Worker {
    final int NOTIFICATION_ID = 1002;
    final String CHANNEL_ID = "AUTO BACKUP CHANNEL";

    public static final String WORKER_NAME = "AUTO_BACKUP_WORKER_NAME";

    public static final String DATA_KEY_URL = "URL";
    public static final String DATA_KEY_SERVER_TOKEN = "SERVER_TOKEN";
    public static final String DATA_KEY_DEVICE_UNIQUE_ID = "DEVICE_UNIQUE_ID";


    public AutoBackupWorker(
            @NonNull Context context,
            @NonNull WorkerParameters params) {
        super(context, params);
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    @NonNull
    @Override
    public Result doWork() {
        Log.d("AutoBackupWorker", "Work started.");

        Context context = getApplicationContext();

        PendingIntent cancelIntent = WorkManager.getInstance(context)
                .createCancelPendingIntent(getId());

        String title = "Backing up your media";
        String cancel = "Cancel";

        createChannel();

        NotificationCompat.Builder notificationBuilder = new NotificationCompat.Builder(context, CHANNEL_ID)
                .setContentTitle(title)
                .setTicker(title)
                .setContentText("Starting backup of your media.")
                .setSmallIcon(R.mipmap.ic_launcher)
                .setOngoing(true)
                .addAction(android.R.drawable.ic_delete, cancel, cancelIntent);

        setForegroundAsync(new ForegroundInfo(NOTIFICATION_ID, notificationBuilder.build()));

        for(int i = 0; i<10; i++){
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
            if(isStopped()){
                Log.d("main", "Stopped");
                break;
            }

            notificationBuilder.setContentText("Backed up " + i);

            context.getSystemService(NotificationManager.class).notify(NOTIFICATION_ID, notificationBuilder.build());
        }

        Log.d("main", "Work finished.");
        return Result.success();
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    private void createChannel() {
        NotificationChannel channel = new NotificationChannel(
                CHANNEL_ID,
                CHANNEL_ID,
                NotificationManager.IMPORTANCE_HIGH
        );

        getApplicationContext().getSystemService(NotificationManager.class).createNotificationChannel(channel);
    }
}