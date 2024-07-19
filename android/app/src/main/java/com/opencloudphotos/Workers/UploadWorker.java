package com.opencloudphotos.Workers;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.net.Uri;
import android.os.Build;
import android.util.Base64;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.core.app.NotificationCompat;
import androidx.work.Data;
import androidx.work.ForegroundInfo;
import androidx.work.WorkManager;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.opencloudphotos.GlobalManagers.ServerQueriesManager.Common.PhotoData;
import com.opencloudphotos.GlobalManagers.ServerQueriesManager.GetPhotos;
import com.opencloudphotos.GlobalManagers.ServerQueriesManager.PhotoUploader;
import com.opencloudphotos.NativeModules.MediaManagement.Utils.Definitions;
import com.opencloudphotos.NativeModules.MediaManagement.Utils.GetMediaTask;
import com.opencloudphotos.R;
import com.opencloudphotos.Utils.FileOperations;

import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class UploadWorker extends Worker {
    final int NOTIFICATION_ID = 1003;
    final String CHANNEL_ID = "UPLOAD CHANNEL";

    public static final String UPLOADED_PHOTO_MEDIA_ID = "UPLOADED_PHOTO_MEDIA_ID";

    public static final String WORKER_NAME = "UPLOAD_WORKER_NAME";
    public static final String DATA_KEY_URL = "URL";
    public static final String DATA_KEY_SERVER_TOKEN = "SERVER_TOKEN";
    public static final String DATA_KEY_DEVICE_UNIQUE_ID = "DEVICE_UNIQUE_ID";
    public static final String DATA_KEY_PHOTOS_IDS = "PHOTOS_IDS";


    protected String url;
    protected String serverToken;
    protected String deviceId;
    protected String[] photosIds;

    NotificationCompat.Builder notificationBuilder;

    public UploadWorker(
            @NonNull Context context,
            @NonNull WorkerParameters params) {
        super(context, params);
    }

    protected boolean parseInputData(){
        url = getInputData().getString(DATA_KEY_URL);
        serverToken = getInputData().getString(DATA_KEY_SERVER_TOKEN);
        deviceId = getInputData().getString(DATA_KEY_DEVICE_UNIQUE_ID);
        photosIds = getInputData().getStringArray(DATA_KEY_PHOTOS_IDS);

        return url != null && serverToken != null && deviceId != null && photosIds != null;
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    @NonNull
    @Override
    public Result doWork() {
        Log.d("UploadWorker", "Work started.");

        boolean dataParsed = parseInputData();
        if(!dataParsed) {
            return Result.failure();
        }

        Context context = getApplicationContext();

        PendingIntent cancelIntent = WorkManager.getInstance(context)
                .createCancelPendingIntent(getId());

        String title = "Uploading photos";
        String cancel = "Cancel";

        createChannel();

        notificationBuilder = new NotificationCompat.Builder(context, CHANNEL_ID)
                .setOnlyAlertOnce(true)
                .setContentTitle(title)
                .setTicker(title)
                .setContentText("Staring photos upload")
                .setSmallIcon(R.drawable.ic_notification)
                .setOngoing(true)
                .addAction(android.R.drawable.ic_delete, cancel, cancelIntent);

        setForegroundAsync(new ForegroundInfo(NOTIFICATION_ID, notificationBuilder.build()));

        WritableArray include = Arguments.createArray();
        include.pushString("fileSize");
        include.pushString("filename");
        include.pushString("imageSize");

        PhotoUploader photoUploader = new PhotoUploader(
                url,
                serverToken,
                deviceId);

        for (int i=0; i<photosIds.length; i++) {
            String mediaId = photosIds[i];

            notificationBuilder.setContentText("Uploaded " + i + " photo out of " + photosIds.length);
            getApplicationContext().getSystemService(NotificationManager.class).notify(NOTIFICATION_ID, notificationBuilder.build());

            try {
                WritableMap result = new GetMediaTask(
                        context,
                        mediaId,
                        1,
                        null,
                        null,
                        null,
                        Definitions.ASSET_TYPE_PHOTOS,
                        0,
                        0,
                        include)
                        .execute();

                PhotoData photoData = parseResult(result);

                if(photoData == null){
                    continue;
                }

                if(isStopped()){
                    Log.d("UploadWorker", "Stopped");
                    getApplicationContext().getSystemService(NotificationManager.class).cancel(NOTIFICATION_ID);
                    break;
                }

                photoUploader.uploadPhoto(photoData);
                setProgressAsync(new Data.Builder().putString(UPLOADED_PHOTO_MEDIA_ID, mediaId).build());
            } catch (Exception e) {
                throw new RuntimeException(e);
            }

        }

        return Result.success(new Data.Builder().putString(UPLOADED_PHOTO_MEDIA_ID, photosIds[photosIds.length - 1]).build());
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    private PhotoData parseResult(WritableMap result) throws IOException {
        ReadableArray edges = result.getArray("edges");

        if(edges == null){
            throw new RuntimeException("UploadWorker: in parseResult edges found null.");
        }

        if(edges.size() == 0){
            return null;
        }

        if(edges.size() > 1){
            throw new RuntimeException("UploadWorker: in parseResult found more than on result for a mediaId");
        }

        ReadableMap item = edges.getMap(0);
        ReadableMap node = item.getMap("node");

        if(node == null){
            throw new RuntimeException("UploadWorker: in parseResult node found null.");
        }

        ReadableMap image = node.getMap("image");
        PhotoData photoData = new PhotoData();

        double timestamp = node.getDouble("timestamp");
        double modificationTimestamp = node.getDouble("modificationTimestamp");

        double correctTimestamp = Math.min(timestamp, modificationTimestamp);

        Instant instant = Instant.ofEpochSecond((long)correctTimestamp);
        String timestampAsIso = instant.toString();

        photoData.mediaId = node.getString("id");
        photoData.uri = image.getString("uri");
        photoData.fileSize = image.getDouble("fileSize");
        photoData.height = image.getDouble("height");
        photoData.width = image.getDouble("width");
        photoData.name = image.getString("filename");
        photoData.date = timestampAsIso;

        photoData.image64 = FileOperations.getBase64FromUri(getApplicationContext(), photoData.uri);

        return photoData;
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