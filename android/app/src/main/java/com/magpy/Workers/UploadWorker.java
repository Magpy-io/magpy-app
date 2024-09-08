package com.magpy.Workers;

import static java.lang.Thread.sleep;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.os.Build;
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
import com.magpy.GlobalManagers.ServerQueriesManager.Common.PhotoData;
import com.magpy.GlobalManagers.ServerQueriesManager.Common.ResponseNotOkException;
import com.magpy.GlobalManagers.ServerQueriesManager.PhotoUploader;
import com.magpy.NativeModules.MediaManagement.Utils.Definitions;
import com.magpy.NativeModules.MediaManagement.Utils.GetMediaTask;
import com.magpy.R;
import com.magpy.Utils.MediaParser;

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

        try{
            if(!parseInputData()) {
                return Result.failure();
            }

            Context context = getApplicationContext();

            createNotification();

            PhotoUploader photoUploader = new PhotoUploader(
                    getApplicationContext(),
                    url,
                    serverToken,
                    deviceId);

            WritableArray include = Arguments.createArray();
            include.pushString("fileSize");
            include.pushString("filename");
            include.pushString("imageSize");

            for (int i=0; i<photosIds.length; i++) {

                if(isStopped()){
                    Log.d("UploadWorker", "Work stopped");
                    break;
                }

                String mediaId = photosIds[i];
                updateNotification(i);

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
                    Log.d("UploadWorker", "PhotoData not found for photo with mediaId: " + mediaId);
                    continue;
                }

                try{
                    photoUploader.uploadPhoto(photoData);
                    setProgressAsync(new Data.Builder().putString(UPLOADED_PHOTO_MEDIA_ID, mediaId).build());
                }
                catch (ResponseNotOkException e){
                    if(e.GetErrorCode().equals("PHOTO_EXISTS")){
                        setProgressAsync(new Data.Builder().putString(UPLOADED_PHOTO_MEDIA_ID, mediaId).build());
                        Log.i("UploadWorker", "Failed upload of photo with mediaId: " + mediaId + " because it already exists in server.", e);
                    }else{
                        Log.e("UploadWorker", "Failed upload of photo with mediaId: " + mediaId, e);
                    }
                }
            }

            // Wait time to avoid the worker finishing before the progress is received by the UploadWorkerManager
            sleep(500);
            Log.d("UploadWorker", "Work finished.");
            return Result.success();
        }catch(Exception e){
            Log.e("UploadWorker", "Exception thrown: ", e);
            return Result.failure();
        }finally {
            getApplicationContext().getSystemService(NotificationManager.class).cancel(NOTIFICATION_ID);
        }
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    private PhotoData parseResult(WritableMap result)  {
        ReadableArray edges = result.getArray("edges");

        if(edges == null){
            throw new RuntimeException("UploadWorker: edges found null.");
        }

        if(edges.size() == 0){
            return null;
        }

        if(edges.size() > 1){
            Log.i("UploadWorker", "Found more than on result for a mediaId");
        }

        ReadableMap item = edges.getMap(0);
        ReadableMap node = item.getMap("node");
        if(node == null){
            throw new RuntimeException("UploadWorker: node found null.");
        }

        ReadableMap image = node.getMap("image");
        if(image == null){
            throw new RuntimeException("UploadWorker: image found null.");
        }

        return MediaParser.parsePhotoData(node);
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    private void createChannel() {
        NotificationChannel channel = new NotificationChannel(
                CHANNEL_ID,
                CHANNEL_ID,
                NotificationManager.IMPORTANCE_MIN
        );

        getApplicationContext().getSystemService(NotificationManager.class).createNotificationChannel(channel);
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    private void createNotification(){
        Context context = getApplicationContext();

        PendingIntent cancelIntent = WorkManager.getInstance(context)
                .createCancelPendingIntent(getId());

        createChannel();

        notificationBuilder = new NotificationCompat.Builder(context, CHANNEL_ID)
                .setProgress(0,0,true)
                .setOnlyAlertOnce(true)
                .setContentTitle("Uploading photos")
                .setSmallIcon(R.drawable.ic_notification)
                .setOngoing(true)
                .setSilent(true)
                .addAction(android.R.drawable.ic_delete, "Cancel", cancelIntent);

        setForegroundAsync(new ForegroundInfo(NOTIFICATION_ID, notificationBuilder.build()));
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    private void updateNotification(int progress){
        boolean intermediate = photosIds.length == 1;

        notificationBuilder.setProgress(photosIds.length, progress, intermediate);
        getApplicationContext().getSystemService(NotificationManager.class).notify(NOTIFICATION_ID, notificationBuilder.build());
    }

}