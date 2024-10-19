package com.magpy.NativeModules.AutoBackup;

import static com.magpy.Workers.AutoBackupWorker.UPLOADED_PHOTO_MEDIA_ID;
import static com.magpy.Workers.UploadWorker.UPLOADED_PHOTO_STRING;

import android.content.Context;

import androidx.lifecycle.Observer;
import androidx.lifecycle.ProcessLifecycleOwner;
import androidx.work.Configuration;
import androidx.work.Constraints;
import androidx.work.Data;
import androidx.work.ExistingPeriodicWorkPolicy;
import androidx.work.NetworkType;
import androidx.work.PeriodicWorkRequest;
import androidx.work.WorkInfo;
import androidx.work.WorkManager;

import com.magpy.GlobalManagers.ExecutorsManager;
import com.magpy.Utils.CallbackEmptyWithThrowable;
import com.magpy.Utils.CallbackWithParameterAndThrowable;
import com.magpy.Workers.AutoBackupWorker;

import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

public class AutoBackupWorkerManager {

    Context context;

    public AutoBackupWorkerManager(Context context){
        this.context = context;
    }

    public void StartWorker(String url, String serverToken, String deviceId, Observer<ObserverData> observer, CallbackEmptyWithThrowable callback){

        Constraints constraints = new Constraints.Builder()
                .setRequiredNetworkType(NetworkType.UNMETERED)
                .build();

        PeriodicWorkRequest uploadRequest =
                new PeriodicWorkRequest.Builder(AutoBackupWorker.class, 15, TimeUnit.MINUTES)
                        .setInputData(
                                new Data.Builder()
                                        .putString(AutoBackupWorker.DATA_KEY_URL, url)
                                        .putString(AutoBackupWorker.DATA_KEY_SERVER_TOKEN, serverToken)
                                        .putString(AutoBackupWorker.DATA_KEY_DEVICE_UNIQUE_ID, deviceId)
                                        .build()
                        )
                        .setConstraints(constraints)
                        .build();

        ExecutorsManager.ExecuteOnBackgroundThread(() -> {
            try {
                if(!WorkManager.isInitialized()){
                    WorkManager.initialize(context, new Configuration.Builder().setExecutor(ExecutorsManager.executorService).build());
                }

                WorkManager.getInstance(context).enqueueUniquePeriodicWork(AutoBackupWorker.WORKER_NAME, ExistingPeriodicWorkPolicy.UPDATE, uploadRequest).getResult().get();
                SetupWorkerObserver(observer, callback);
            } catch (Exception e) {
                callback.onFailed(e);
            }
        });
    }

    private void SetupWorkerObserver(Observer<ObserverData> observer, CallbackEmptyWithThrowable callback) {
        ExecutorsManager.ExecuteOnMainThread(() -> {
            try {
                WorkInfo result = getWorker();

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

    public void GetWorker(CallbackWithParameterAndThrowable<WorkInfo> callback){
        ExecutorsManager.ExecuteOnBackgroundThread(() -> {
            try {
                WorkInfo workInfo = getWorker();
                callback.onSuccess(workInfo);
            } catch (Exception e) {
                callback.onFailed(e);
            }
        });
    }

    private WorkInfo getWorker() throws ExecutionException, InterruptedException {
        List<WorkInfo> result = WorkManager
                .getInstance(context)
                .getWorkInfosForUniqueWork(AutoBackupWorker.WORKER_NAME)
                .get();

        if(result.isEmpty()){
            return null;
        }

        return result.get(0);
    }

    public void IsWorkerAlive(CallbackWithParameterAndThrowable<Boolean> callback) {
        ExecutorsManager.ExecuteOnBackgroundThread(() -> {
            try {
                WorkInfo workInfo = getWorker();

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

    public void StopWorker(CallbackEmptyWithThrowable callback) {
        ExecutorsManager.ExecuteOnBackgroundThread(() -> {
            try {
                WorkManager.getInstance(context).cancelUniqueWork(AutoBackupWorker.WORKER_NAME).getResult().get();
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
