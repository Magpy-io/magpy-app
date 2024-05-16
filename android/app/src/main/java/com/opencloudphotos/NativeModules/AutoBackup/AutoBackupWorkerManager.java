package com.opencloudphotos.NativeModules.AutoBackup;

import android.content.Context;

import androidx.work.Data;
import androidx.work.ExistingPeriodicWorkPolicy;
import androidx.work.PeriodicWorkRequest;
import androidx.work.WorkInfo;
import androidx.work.WorkManager;

import com.facebook.react.bridge.Promise;
import com.google.common.util.concurrent.FutureCallback;
import com.google.common.util.concurrent.Futures;
import com.google.common.util.concurrent.ListenableFuture;
import com.google.common.util.concurrent.ListeningExecutorService;
import com.opencloudphotos.GlobalManagers.ExecutorsManager;
import com.opencloudphotos.Workers.AutoBackupWorker;

import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;

public class AutoBackupWorkerManager {

    Context context;
    Promise mPromise;

    public AutoBackupWorkerManager(Context context, Promise promise){
        this.context = context;
        this.mPromise = promise;
    }

    public void StartWorker(String url, String serverToken, String deviceId){

        Context context = this.context;
        Promise promise = this.mPromise;

        PeriodicWorkRequest uploadRequest =
                new PeriodicWorkRequest.Builder(AutoBackupWorker.class, 15, TimeUnit.MINUTES)
                        .setInputData(
                                new Data.Builder()
                                        .putString(AutoBackupWorker.DATA_KEY_URL, url)
                                        .putString(AutoBackupWorker.DATA_KEY_SERVER_TOKEN, serverToken)
                                        .putString(AutoBackupWorker.DATA_KEY_DEVICE_UNIQUE_ID, deviceId)
                                        .build()
                        )
                        .build();

        ExecutorsManager.executorService.execute(() -> {
            try {
                WorkManager.getInstance(context).enqueueUniquePeriodicWork(AutoBackupWorker.WORKER_NAME, ExistingPeriodicWorkPolicy.UPDATE, uploadRequest).getResult().get();
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
                        .getWorkInfosForUniqueWork(AutoBackupWorker.WORKER_NAME)
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
                WorkManager.getInstance(context).cancelUniqueWork(AutoBackupWorker.WORKER_NAME).getResult().get();
            } catch (ExecutionException | InterruptedException e) {
                promise.reject("Error", e.toString());
            }
        });
    }

}
