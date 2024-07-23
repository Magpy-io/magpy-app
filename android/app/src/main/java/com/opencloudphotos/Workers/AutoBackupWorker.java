package com.opencloudphotos.Workers;

import static java.lang.Thread.sleep;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.net.Uri;
import android.os.AsyncTask;
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
import com.opencloudphotos.GlobalManagers.ExecutorsManager;
import com.opencloudphotos.GlobalManagers.ServerQueriesManager.Common.PhotoData;
import com.opencloudphotos.GlobalManagers.ServerQueriesManager.Common.ResponseNotOkException;
import com.opencloudphotos.GlobalManagers.ServerQueriesManager.GetPhotos;
import com.opencloudphotos.GlobalManagers.ServerQueriesManager.PhotoUploader;
import com.opencloudphotos.NativeModules.MediaManagement.Utils.Definitions;
import com.opencloudphotos.NativeModules.MediaManagement.Utils.GetMediaTask;
import com.opencloudphotos.R;
import com.opencloudphotos.Utils.FileOperations;
import com.opencloudphotos.Utils.MediaParser;

import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class AutoBackupWorker extends Worker {
    final int NOTIFICATION_ID = 1002;
    final String CHANNEL_ID = "AUTO BACKUP CHANNEL";

    public static final String WORKER_NAME = "AUTO_BACKUP_WORKER_NAME";
    public static final String DATA_KEY_URL = "URL";
    public static final String DATA_KEY_SERVER_TOKEN = "SERVER_TOKEN";
    public static final String DATA_KEY_DEVICE_UNIQUE_ID = "DEVICE_UNIQUE_ID";

    public static final String UPLOADED_PHOTO_MEDIA_ID = "UPLOADED_PHOTO_MEDIA_ID";

    protected final int MAX_MISSING_PHOTOS_TO_UPLOAD = 500;
    protected final int MAX_GALLERY_PHOTOS_TO_UPLOAD = 5000;

    protected String url;
    protected String serverToken;
    protected String deviceId;

    NotificationCompat.Builder notificationBuilder;

    public AutoBackupWorker(
            @NonNull Context context,
            @NonNull WorkerParameters params) {
        super(context, params);
    }

    protected boolean parseInputData(){
        url = getInputData().getString(DATA_KEY_URL);
        serverToken = getInputData().getString(DATA_KEY_SERVER_TOKEN);
        deviceId = getInputData().getString(DATA_KEY_DEVICE_UNIQUE_ID);

        return url != null && serverToken != null && deviceId != null;
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    @NonNull
    @Override
    public Result doWork() {
        Log.d("AutoBackupWorker", "Work started.");

        try {
            if(!parseInputData()) {
                return Result.failure();
            }

            Context context = getApplicationContext();

            WritableArray include = Arguments.createArray();
            include.pushString("fileSize");
            include.pushString("filename");
            include.pushString("imageSize");

            WritableMap result = new GetMediaTask(
                    context,
                    null,
                    MAX_GALLERY_PHOTOS_TO_UPLOAD,
                    null,
                    null,
                    null,
                    Definitions.ASSET_TYPE_PHOTOS,
                    0,
                    0,
                    include)
                    .execute();

            treatReturnedMedia(result);

            // Wait time to avoid the worker finishing before the progress is received by the AutoBackupWorkerManager
            sleep(500);
            Log.d("AutoBackupWorker", "Work finished.");
            return Result.success();
        }catch(Exception e){
            Log.e("AutoBackupWorker", "Exception thrown: ", e);
            return Result.failure();
        }finally {
            getApplicationContext().getSystemService(NotificationManager.class).cancel(NOTIFICATION_ID);
        }
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    private void treatReturnedMedia(WritableMap result) throws Exception {
        String[] ids = getIdsFromGetMedia(result);

        GetPhotos getPhotos = new GetPhotos(
                url,
                serverToken,
                deviceId);

        boolean[] photosExist;

        photosExist = getPhotos.getPhotosExistById(ids);

        List<PhotoData> missingPhotos = getPhotosDataFromGetMediaIfNotInServer(result, photosExist, MAX_MISSING_PHOTOS_TO_UPLOAD);

        if(missingPhotos.isEmpty()){
            return;
        }

        createNotification();

        PhotoUploader photoUploader = new PhotoUploader(
                getApplicationContext(),
                url,
                serverToken,
                deviceId);

        int progress = 0;
        for (PhotoData photoData:missingPhotos) {

            if(isStopped()){
                Log.d("AutoBackupWorker", "Worker stopped");
                break;
            }

            updateNotification(progress, missingPhotos.size());

            try{
                photoUploader.uploadPhoto(photoData);
                setProgressAsync(new Data.Builder().putString(UPLOADED_PHOTO_MEDIA_ID, photoData.mediaId).build());
            }catch (ResponseNotOkException e){
                Log.e("UploadWorker", "Failed upload of photo with mediaId: " + photoData.mediaId, e);
            }

            progress++;
        }
    }

    public String[] getIdsFromGetMedia(WritableMap result){
        ReadableArray edges = result.getArray("edges");

        if(edges == null){
            throw new RuntimeException("AutoBackupWorker: edges found null.");
        }

        String[] ids = new String[edges.size()];

        for(int i = 0; i< edges.size(); i++){
            ReadableMap item = edges.getMap(i);
            ReadableMap node = item.getMap("node");
            if(node == null){
                throw new RuntimeException("AutoBackupWorker: node found null.");
            }

            ids[i] = node.getString("id");
        }
        return ids;
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    public List<PhotoData> getPhotosDataFromGetMediaIfNotInServer(WritableMap result, boolean[] photosExist, int numberOfPhotosToReturn) {
        ReadableArray edges = result.getArray("edges");
        if(edges == null){
            throw new RuntimeException("AutoBackupWorker: edges found null.");
        }

        List<PhotoData> missingPhotos = new ArrayList<>();

        for(int i = 0; i< photosExist.length; i++) {
            boolean exists = photosExist[i];
            if(!exists){
                ReadableMap item = edges.getMap(i);
                ReadableMap node = item.getMap("node");

                PhotoData photoData = MediaParser.parsePhotoData(node);
                missingPhotos.add(photoData);

                if(missingPhotos.size() >= numberOfPhotosToReturn){
                    break;
                }
            }
        }
        return missingPhotos;
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

    @RequiresApi(api = Build.VERSION_CODES.O)
    private void createNotification(){
        Context context = getApplicationContext();
        PendingIntent cancelIntent = WorkManager.getInstance(context)
                .createCancelPendingIntent(getId());

        String title = "Backing up your media";
        String cancel = "Cancel";

        createChannel();

        notificationBuilder = new NotificationCompat.Builder(context, CHANNEL_ID)
                .setOnlyAlertOnce(true)
                .setContentTitle(title)
                .setSilent(true)
                .setContentText("Starting backup of your media.")
                .setSmallIcon(R.drawable.ic_notification)
                .setOngoing(true)
                .addAction(android.R.drawable.ic_delete, cancel, cancelIntent);

        setForegroundAsync(new ForegroundInfo(NOTIFICATION_ID, notificationBuilder.build()));
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    private void updateNotification(int progress, int total){
        notificationBuilder.setContentText("Backed up " + progress + " photos out of " + total).setSilent(true);
        getApplicationContext().getSystemService(NotificationManager.class).notify(NOTIFICATION_ID, notificationBuilder.build());
    }

}