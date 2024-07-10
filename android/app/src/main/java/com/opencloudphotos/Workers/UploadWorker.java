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
                .setContentTitle(title)
                .setTicker(title)
                .setContentText("Staring photos upload")
                .setSmallIcon(R.mipmap.ic_launcher)
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

            WritableMap result;
            try {
                result = new GetMediaTask(
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
            } catch (GetMediaTask.RejectionException e) {
                throw new RuntimeException(e);
            }

            PhotoData photoData = parseResult(result);

            if(photoData == null){
                throw new RuntimeException("UploadWorker: mediaId not found in device.");
            }

            if(isStopped()){
                Log.d("UploadWorker", "Stopped");
                break;
            }

            notificationBuilder.setContentText("Backing up " + (i+1) + "/" + photosIds.length);
            getApplicationContext().getSystemService(NotificationManager.class).notify(NOTIFICATION_ID, notificationBuilder.build());

            try {
                photoUploader.uploadPhoto(photoData);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }

        return Result.success();
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    private PhotoData parseResult(WritableMap result){
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


        InputStream inputStream = null;
        try {
            inputStream = getApplicationContext().getContentResolver().openInputStream(Uri.parse(photoData.uri));
        } catch (FileNotFoundException e) {
            throw new RuntimeException("Media file not found.", e);
        }
        ByteArrayOutputStream byteBuffer = new ByteArrayOutputStream();

        int bufferSize = 1024;
        byte[] buffer = new byte[bufferSize];

        int len = 0;

        try{
            while ((len = inputStream.read(buffer)) != -1) {
                byteBuffer.write(buffer, 0, len);
            }
        } catch (IOException e) {
            throw new RuntimeException("Error while reading media file.", e);
        }

        byte[] b = byteBuffer.toByteArray();

        photoData.image64 = Base64.encodeToString(b, 0);

        return photoData;
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    private void treatReturnedMedia(WritableMap result){
        String[] ids = getIdsFromGetMedia(result);

        GetPhotos getPhotos = new GetPhotos(
                url,
                serverToken,
                deviceId);

        boolean[] photosExist;

        try {
            photosExist = getPhotos.getPhotosExistById(ids);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        List<PhotoData> missingPhotos = getPhotosDataFromGetMediaIfNotInServer(result, photosExist, 1);

        PhotoUploader photoUploader = new PhotoUploader(
                url,
                serverToken,
                deviceId);

        for (int i=0; i<missingPhotos.size(); i++) {
            PhotoData photoData = missingPhotos.get(i);
            if(isStopped()){
                Log.d("main", "Stopped");
                break;
            }

            notificationBuilder.setContentText("Backing up " + (i+1) + "/" + missingPhotos.size());
            getApplicationContext().getSystemService(NotificationManager.class).notify(NOTIFICATION_ID, notificationBuilder.build());

            try {
                photoUploader.uploadPhoto(photoData);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
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

    public String[] getIdsFromGetMedia(WritableMap result){
        ReadableArray edges = result.getArray("edges");

        String[] ids = new String[edges.size()];

        for(int i = 0; i< edges.size(); i++){
            ReadableMap item = edges.getMap(i);
            ReadableMap node = item.getMap("node");
            String id = node.getString("id");
            ids[i] = id;
        }
        return ids;
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    public List<PhotoData> getPhotosDataFromGetMediaIfNotInServer(WritableMap result, boolean[] photosExist, int numberOfPhotosToReturn){
        ReadableArray edges = result.getArray("edges");

        List<PhotoData> missingPhotos = new ArrayList<>();

        for(int i = 0; i< photosExist.length; i++) {
            boolean exists = photosExist[i];
            if(!exists){
                ReadableMap item = edges.getMap(i);
                ReadableMap node = item.getMap("node");
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


                InputStream inputStream = null;
                try {
                    inputStream = getApplicationContext().getContentResolver().openInputStream(Uri.parse(photoData.uri));
                } catch (FileNotFoundException e) {
                    throw new RuntimeException("Media file not found.", e);
                }
                ByteArrayOutputStream byteBuffer = new ByteArrayOutputStream();

                int bufferSize = 1024;
                byte[] buffer = new byte[bufferSize];

                int len = 0;

                try{
                    while ((len = inputStream.read(buffer)) != -1) {
                        byteBuffer.write(buffer, 0, len);
                    }
                } catch (IOException e) {
                    throw new RuntimeException("Error while reading media file.", e);
                }

                byte[] b = byteBuffer.toByteArray();

                photoData.image64 = Base64.encodeToString(b, 0);

                missingPhotos.add(photoData);

                if(missingPhotos.size() >= numberOfPhotosToReturn){
                    break;
                }
            }
        }
        return missingPhotos;
    }

}