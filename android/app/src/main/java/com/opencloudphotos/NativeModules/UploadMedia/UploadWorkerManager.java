package com.opencloudphotos.NativeModules.UploadMedia;

import android.content.Context;

import androidx.work.Data;
import androidx.work.ExistingWorkPolicy;
import androidx.work.OneTimeWorkRequest;
import androidx.work.WorkInfo;
import androidx.work.WorkManager;

import com.facebook.react.bridge.Promise;
import com.opencloudphotos.GlobalManagers.ExecutorsManager;
import com.opencloudphotos.Workers.UploadWorker;

import java.util.List;
import java.util.concurrent.ExecutionException;

public class UploadWorkerManager {

    Context context;
    Promise mPromise;

    public UploadWorkerManager(Context context, Promise promise){
        this.context = context;
        this.mPromise = promise;
    }

    public void StartWorker(String url, String serverToken, String deviceId, String[] photosIds){

        Context context = this.context;
        Promise promise = this.mPromise;

        OneTimeWorkRequest uploadRequest =
                new OneTimeWorkRequest.Builder(UploadWorker.class)
                        .setInputData(
                                new Data.Builder()
                                        .putString(UploadWorker.DATA_KEY_URL, url)
                                        .putString(UploadWorker.DATA_KEY_SERVER_TOKEN, serverToken)
                                        .putString(UploadWorker.DATA_KEY_DEVICE_UNIQUE_ID, deviceId)
                                        .putStringArray(UploadWorker.DATA_KEY_PHOTOS_IDS, photosIds)
                                        .build()
                        )
                        .build();

        ExecutorsManager.executorService.execute(() -> {
            try {
                WorkManager.getInstance(context).enqueueUniqueWork(UploadWorker.WORKER_NAME, ExistingWorkPolicy.REPLACE, uploadRequest).getResult().get();
                promise.resolve(null);
            } catch (ExecutionException | InterruptedException e) {
                promise.reject("Error", e.toString());
            }
        });
    }

    public void IsWorkerAlive(){
        Context context = this.context;
        Promise promise = this.mPromise;

        ExecutorsManager.executorService.execute(() -> {
            List<WorkInfo> result;
            try {
                result = WorkManager
                        .getInstance(context)
                        .getWorkInfosForUniqueWork(UploadWorker.WORKER_NAME)
                        .get();
            } catch (ExecutionException | InterruptedException e) {
                promise.reject("Error", e.toString());
                return;
            }

            for (WorkInfo workinfo:result) {
                if(!workinfo.getState().isFinished()){
                    promise.resolve(true);
                    return;
                }
            }

            promise.resolve(false);
        });
    }

    public void StopWorker(){
        Context context = this.context;
        Promise promise = this.mPromise;

        ExecutorsManager.executorService.execute(() -> {
            try {
                WorkManager.getInstance(context).cancelUniqueWork(UploadWorker.WORKER_NAME).getResult().get();
                promise.resolve(null);
            } catch (ExecutionException | InterruptedException e) {
                promise.reject("Error", e.toString());
            }
        });
    }

}
