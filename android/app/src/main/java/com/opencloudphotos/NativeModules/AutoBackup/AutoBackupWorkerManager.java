package com.opencloudphotos.NativeModules.AutoBackup;

import android.content.Context;

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

    public void RestartWorker(){

        Context context = this.context;
        Promise promise = this.mPromise;

        PeriodicWorkRequest uploadRequest =
                new PeriodicWorkRequest.Builder(AutoBackupWorker.class, 15, TimeUnit.MINUTES)
                        .addTag(AutoBackupWorker.WORKER_TAG)
                        .build();

        ExecutorsManager.executorService.execute(() -> {
            try {
                WorkManager.getInstance(context).cancelAllWorkByTag(AutoBackupWorker.WORKER_TAG).getResult().get();
                WorkManager.getInstance(context).enqueue(uploadRequest);
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
                        .getWorkInfosByTag(AutoBackupWorker.WORKER_TAG)
                        .get();
            } catch (ExecutionException | InterruptedException e) {
                promise.reject("Error", e.toString());
                return;
            }

            for (WorkInfo workinfo:result) {
                if(workinfo.getState() == WorkInfo.State.RUNNING || workinfo.getState() == WorkInfo.State.ENQUEUED){
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
                WorkManager.getInstance(context).cancelAllWorkByTag(AutoBackupWorker.WORKER_TAG).getResult().get();
            } catch (ExecutionException | InterruptedException e) {
                promise.reject("Error", e.toString());
            }
        });
    }

}
