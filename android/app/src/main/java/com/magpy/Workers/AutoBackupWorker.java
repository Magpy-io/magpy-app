package com.magpy.Workers;

import static android.content.pm.ServiceInfo.FOREGROUND_SERVICE_TYPE_DATA_SYNC;
import static com.magpy.Workers.UploadWorker.UPLOAD_FAIL_PHOTO_MEDIA_ID;
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
import com.facebook.react.bridge.WritableNativeArray;
import com.magpy.GlobalManagers.HttpManager;
import com.magpy.GlobalManagers.Logging.Logger;
import com.magpy.GlobalManagers.MySharedPreferences.WorkerStatsPreferences;
import com.magpy.GlobalManagers.ServerQueriesManager.Common.PhotoData;
import com.magpy.GlobalManagers.ServerQueriesManager.Common.ResponseNotOkException;
import com.magpy.GlobalManagers.ServerQueriesManager.GetPhotos;
import com.magpy.GlobalManagers.ServerQueriesManager.PhotoUploader;
import com.magpy.GlobalManagers.ServerQueriesManager.WhoAmI;
import com.magpy.NativeModules.AutoBackup.AutoBackupWorkerManager;
import com.magpy.NativeModules.MediaManagement.Utils.Definitions;
import com.magpy.NativeModules.MediaManagement.Utils.GetMediaTask;
import com.magpy.R;
import com.magpy.Utils.MediaParser;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

public class AutoBackupWorker extends Worker {
    final int NOTIFICATION_ID = 1002;
    final String CHANNEL_ID = "AUTO BACKUP CHANNEL";

    public static final String WORKER_NAME = "AUTO_BACKUP_WORKER_NAME";
    public static final String DATA_KEY_URL = "URL";
    public static final String DATA_KEY_SERVER_TOKEN = "SERVER_TOKEN";
    public static final String DATA_KEY_DEVICE_UNIQUE_ID = "DEVICE_UNIQUE_ID";

    public static final String UPLOADED_PHOTO_MEDIA_ID = "UPLOADED_PHOTO_MEDIA_ID";
    public static final String UPLOADED_PHOTO_STRING = "UPLOADED_PHOTO_STRING";
    public static final String WORKER_ERROR = "WORKER_ERROR";

    protected final int MAX_MISSING_PHOTOS_TO_UPLOAD = 5000;
    protected final int MAX_GALLERY_PHOTOS_TO_UPLOAD = 5000;

    protected String url;
    protected String serverToken;
    protected String deviceId;

    NotificationCompat.Builder notificationBuilder;

    Logger _logger;

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

    @RequiresApi(api = Build.VERSION_CODES.Q)
    @NonNull
    @Override
    public Result doWork() {
        _logger = new Logger(getApplicationContext(), "AutoBackupWorker");
        _logger.Log("Work started.");
        Log.d("AutoBackupWorker", "Work started.");

        try {
            if (!parseInputData()) {
                throw new Exception("Error parsing worker input data.");
            }

            boolean isServerReachable = isServerReachable();

            if(!isServerReachable){
                Log.d("AutoBackupWorker", "Server not reachable.");
                _logger.Log("Server not reachable");
                return Result.failure();
            }

            WritableMap result = getMedia();

            treatReturnedMedia(result);

            Log.d("AutoBackupWorker", "Work finished.");
            _logger.Log("Work finished.");
            recordSuccessRunTime();
            return Result.success();
        }catch(HttpManager.ServerUnreachable e){
            Log.e("AutoBackupWorker", "Server unreachable, Exception thrown: ", e);
            _logger.Log("Server unreachable");
            recordError(AutoBackupWorkerManager.AutobackupWorkerError.SERVER_NOT_REACHABLE);
            sendProgressError(AutoBackupWorkerManager.AutobackupWorkerError.SERVER_NOT_REACHABLE);
            return Result.failure();
        }catch(Exception e){
            Log.e("AutoBackupWorker", "Exception thrown: ", e);
            _logger.Log("Exception thrown");
            recordError(AutoBackupWorkerManager.AutobackupWorkerError.UNEXPECTED_ERROR);
            sendProgressError(AutoBackupWorkerManager.AutobackupWorkerError.UNEXPECTED_ERROR);
            return Result.failure();
        }finally {
            getApplicationContext().getSystemService(NotificationManager.class).cancel(NOTIFICATION_ID);
        }
    }

    private boolean isServerReachable(){
        WhoAmI whoAmIRequest = new WhoAmI(url, serverToken);

        try{
            whoAmIRequest.Send();
            return true;
        } catch(HttpManager.ServerUnreachable | ResponseNotOkException ignored){
            return false;
        }
    }

    private WritableMap getMedia() throws GetMediaTask.RejectionException {
        WritableArray include = new WritableNativeArray();
        include.pushString("fileSize");
        include.pushString("filename");
        include.pushString("imageSize");

        WritableArray mimeTypes = new WritableNativeArray();
        mimeTypes.pushString("image/jpeg");
        mimeTypes.pushString("image/png");

        return new GetMediaTask(
                getApplicationContext(),
                null,
                MAX_GALLERY_PHOTOS_TO_UPLOAD,
                null,
                null,
                mimeTypes,
                Definitions.ASSET_TYPE_PHOTOS,
                0,
                0,
                include)
                .execute();
    }

    @RequiresApi(api = Build.VERSION_CODES.Q)
    private void treatReturnedMedia(WritableMap result) throws Exception {
        String[] ids = getIdsFromGetMedia(result);

        GetPhotos getPhotos = new GetPhotos(
                url,
                serverToken,
                deviceId);

        boolean[] photosExist = getPhotos.getPhotosExistByIdBatched(ids);

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
                _logger.Log("Worker stopped");
                break;
            }

            Log.d("AutoBackupWorker", "Progress " + progress);
            _logger.Log("Progress " + progress);

            updateNotification(progress, missingPhotos.size());

            try{
                String photoUploaded = photoUploader.uploadPhoto(photoData);
                sendProgressPhotoUploaded(photoData.mediaId, photoUploaded);
            }
            catch (ResponseNotOkException e){
                Log.e("AutoBackupWorker", "Failed upload of photo with mediaId: " + photoData.mediaId, e);
                _logger.Log("Failed upload of photo with mediaId: " + photoData.mediaId);
                sendProgressPhotoUploadFailed(photoData.mediaId);
            }

            progress++;
        }

        // Wait time to avoid the worker finishing before the progress is received by the AutoBackupWorkerManager
        sleep(500);
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
                NotificationManager.IMPORTANCE_MIN
        );

        getApplicationContext().getSystemService(NotificationManager.class).createNotificationChannel(channel);
    }

    @RequiresApi(api = Build.VERSION_CODES.Q)
    private void createNotification(){
        Context context = getApplicationContext();
        PendingIntent cancelIntent = WorkManager.getInstance(context)
                .createCancelPendingIntent(getId());

        createChannel();

        notificationBuilder = new NotificationCompat.Builder(context, CHANNEL_ID)
                .setProgress(0, 0, true)
                .setOnlyAlertOnce(true)
                .setContentTitle("Backing up your media")
                .setSmallIcon(R.drawable.ic_notification)
                .setSilent(true)
                .setOngoing(true)
                .addAction(android.R.drawable.ic_delete, "Cancel", cancelIntent);

        try {
            setForegroundAsync(new ForegroundInfo(NOTIFICATION_ID, notificationBuilder.build(), FOREGROUND_SERVICE_TYPE_DATA_SYNC)).get();
        } catch (ExecutionException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    private void updateNotification(int progress, int total){
        notificationBuilder.setProgress(total, progress, false);
        getApplicationContext().getSystemService(NotificationManager.class).notify(NOTIFICATION_ID, notificationBuilder.build());
    }

    private void recordSuccessRunTime(){
        try{
            Date currentTime = Calendar.getInstance().getTime();

            WorkerStatsPreferences workerStatsPreferences = new WorkerStatsPreferences(getApplicationContext());
            workerStatsPreferences.SetLastSuccessRunTime(currentTime.getTime());
        }catch (Exception e){
            Log.e("AutoBackupWorker", e.toString());
        }
    }

    private void recordError(AutoBackupWorkerManager.AutobackupWorkerError error){
        try{
            Date currentTime = Calendar.getInstance().getTime();

            WorkerStatsPreferences workerStatsPreferences = new WorkerStatsPreferences(getApplicationContext());
            workerStatsPreferences.SetLastError(currentTime.getTime(), error);
        }catch (Exception e){
            Log.e("AutoBackupWorker", e.toString());
        }
    }

    private void sendProgressError(AutoBackupWorkerManager.AutobackupWorkerError error){
        Data progressData = new Data.Builder()
                .putString(WORKER_ERROR, error.name())
                .build();
        try{
            setProgressAsync(progressData).get();
            // Wait time to avoid the worker finishing before the progress is received by the WorkerManager
            sleep(500);
        }catch(Exception e){
            Log.e("AutoBackupWorker", e.toString());
        }
    }

    private void sendProgressPhotoUploaded(String mediaId, String photoUploaded){
        Data progressData = new Data.Builder()
                .putString(UPLOADED_PHOTO_MEDIA_ID, mediaId)
                .putString(UPLOADED_PHOTO_STRING, photoUploaded)
                .build();
        try{
            setProgressAsync(progressData).get();
        }catch(Exception e){
            Log.e("AutoBackupWorker", e.toString());
        }
    }

    private void sendProgressPhotoUploadFailed(String mediaId){
        Data progressData = new Data.Builder()
                .putString(UPLOAD_FAIL_PHOTO_MEDIA_ID, mediaId)
                .build();
        try{
            setProgressAsync(progressData).get();
        }catch(Exception e){
            Log.e("AutoBackupWorker", e.toString());
        }
    }
}