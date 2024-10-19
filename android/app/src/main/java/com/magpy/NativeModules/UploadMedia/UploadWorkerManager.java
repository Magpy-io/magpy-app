package com.magpy.NativeModules.UploadMedia;

import static com.magpy.Workers.UploadWorker.UPLOADED_PHOTO_MEDIA_ID;
import static com.magpy.Workers.UploadWorker.UPLOADED_PHOTO_STRING;

import android.content.Context;

import androidx.lifecycle.Observer;
import androidx.lifecycle.ProcessLifecycleOwner;
import androidx.work.Configuration;
import androidx.work.Data;
import androidx.work.ExistingWorkPolicy;
import androidx.work.OneTimeWorkRequest;
import androidx.work.OutOfQuotaPolicy;
import androidx.work.WorkInfo;
import androidx.work.WorkManager;

import com.magpy.GlobalManagers.ExecutorsManager;
import com.magpy.Utils.CallbackEmptyWithThrowable;
import com.magpy.Utils.CallbackWithParameterAndThrowable;
import com.magpy.Workers.UploadWorker;

import java.util.List;
import java.util.concurrent.ExecutionException;

public class UploadWorkerManager {

    Context context;

    public UploadWorkerManager(Context context){
        this.context = context;
    }

    public void StartWorker(String url, String serverToken, String deviceId, String photosIdsFilePath, Observer<ObserverData> observer, CallbackEmptyWithThrowable callback){
        OneTimeWorkRequest uploadRequest =
                new OneTimeWorkRequest.Builder(UploadWorker.class)
                        .setExpedited(OutOfQuotaPolicy.RUN_AS_NON_EXPEDITED_WORK_REQUEST)
                        .setInputData(
                                new Data.Builder()
                                        .putString(UploadWorker.DATA_KEY_URL, url)
                                        .putString(UploadWorker.DATA_KEY_SERVER_TOKEN, serverToken)
                                        .putString(UploadWorker.DATA_KEY_DEVICE_UNIQUE_ID, deviceId)
                                        .putString(UploadWorker.DATA_KEY_PHOTOS_IDS_FILE_PATH, photosIdsFilePath)
                                        .build()
                        )
                        .build();

        ExecutorsManager.ExecuteOnBackgroundThread(() -> {
            try {
                if(!WorkManager.isInitialized()){
                    WorkManager.initialize(context, new Configuration.Builder().setExecutor(ExecutorsManager.executorService).build());
                }

                WorkManager.getInstance(context).enqueueUniqueWork(UploadWorker.WORKER_NAME, ExistingWorkPolicy.REPLACE, uploadRequest).getResult().get();
                SetupWorkerObserver(observer, callback);
            } catch (Exception e) {
                callback.onFailed(e);
            }
        });
    }

    private void SetupWorkerObserver(Observer<ObserverData> observer, CallbackEmptyWithThrowable callback){
        ExecutorsManager.ExecuteOnMainThread(() -> {
            try {
                WorkInfo result = GetWorker();

                if(result == null){
                    throw new Exception("Failed to setup WorkerObserver, Worker not found.");
                }

                WorkManager.getInstance(context).getWorkInfoByIdLiveData(result.getId()).observe(ProcessLifecycleOwner.get(), (workInfo -> {
                    if (workInfo != null) {

                        ObserverData data = new ObserverData();
                        data.workerState = workInfo.getState();

                        Data progress = workInfo.getProgress();
                        String uploadedMediaId = progress.getString(UPLOADED_PHOTO_MEDIA_ID);
                        String uploadedPhoto = progress.getString(UPLOADED_PHOTO_STRING);

                        if(uploadedMediaId != null){
                            data.mediaId = uploadedMediaId;
                            data.photo = uploadedPhoto;
                        }

                        observer.onChanged(data);
                    }
                }));
            } catch (Exception e) {
                callback.onFailed(e);
            }
            callback.onSuccess();
        });
    }

    private WorkInfo GetWorker() throws ExecutionException, InterruptedException {
        List<WorkInfo> result = WorkManager
                .getInstance(context)
                .getWorkInfosForUniqueWork(UploadWorker.WORKER_NAME)
                .get();

        if(result.isEmpty()){
            return null;
        }

        return result.get(0);
    }

    public void IsWorkerAlive(CallbackWithParameterAndThrowable<Boolean> callback){
        ExecutorsManager.ExecuteOnBackgroundThread(() -> {
            try {
                WorkInfo workInfo = GetWorker();

                if(workInfo == null){
                    callback.onSuccess(false);
                    return;
                }

                callback.onSuccess(!workInfo.getState().isFinished());
            } catch (Exception e) {
                callback.onFailed(e);
            }
        });
    }

    public void StopWorker(CallbackEmptyWithThrowable callback){
        ExecutorsManager.ExecuteOnBackgroundThread(() -> {
            try {
                WorkManager.getInstance(context).cancelUniqueWork(UploadWorker.WORKER_NAME).getResult().get();
                callback.onSuccess();
            } catch (Exception e) {
                callback.onFailed(e);
            }
        });
    }


    public static class ObserverData{
        public String mediaId;
        public String photo;
        public WorkInfo.State workerState;
    }
}
