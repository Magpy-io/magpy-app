package com.opencloudphotos.NativeModules.AutoBackup;

import static com.opencloudphotos.Workers.AutoBackupWorker.UPLOADED_PHOTO_MEDIA_ID;

import android.content.Context;

import androidx.lifecycle.Observer;
import androidx.lifecycle.ProcessLifecycleOwner;
import androidx.work.Data;
import androidx.work.ExistingPeriodicWorkPolicy;
import androidx.work.PeriodicWorkRequest;
import androidx.work.WorkInfo;
import androidx.work.WorkManager;

import com.facebook.react.bridge.Promise;
import com.opencloudphotos.GlobalManagers.ExecutorsManager;
import com.opencloudphotos.Workers.AutoBackupWorker;

import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

public class AutoBackupWorkerManager {

    Context context;
    Promise mPromise;

    public AutoBackupWorkerManager(Context context, Promise promise){
        this.context = context;
        this.mPromise = promise;
    }

    public void StartWorker(String url, String serverToken, String deviceId, Observer<String> observer){
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

        ExecutorsManager.ExecuteOnBackgroundThread(() -> {
            try {
                WorkManager.getInstance(context).enqueueUniquePeriodicWork(AutoBackupWorker.WORKER_NAME, ExistingPeriodicWorkPolicy.CANCEL_AND_REENQUEUE, uploadRequest).getResult().get();
                SetupWorkerObserver(observer);
                mPromise.resolve(null);
            } catch (ExecutionException | InterruptedException e) {
                mPromise.reject("Error", e.toString());
            }
        });
    }

    private void SetupWorkerObserver(Observer<String> observer){
        ExecutorsManager.ExecuteOnMainThread(() -> {
            try {
                WorkInfo result = GetWorker();
                WorkManager.getInstance(context).getWorkInfoByIdLiveData(result.getId()).observe(ProcessLifecycleOwner.get(), (workInfo -> {
                    if (workInfo != null) {
                        Data progress;

                        if(workInfo.getState().isFinished()){
                            progress = workInfo.getOutputData();
                        }else{
                            progress = workInfo.getProgress();
                        }

                        String uploadedMediaId = progress.getString(UPLOADED_PHOTO_MEDIA_ID);

                        if(uploadedMediaId != null){
                            observer.onChanged(uploadedMediaId);
                        }
                    }
                }));
            } catch (ExecutionException | InterruptedException e) {
                mPromise.reject("Error", e.toString());
            }
            mPromise.resolve(null);
        });
    }

    public WorkInfo GetWorker() throws ExecutionException, InterruptedException {
        List<WorkInfo> result = WorkManager
                .getInstance(context)
                .getWorkInfosForUniqueWork(AutoBackupWorker.WORKER_NAME)
                .get();


        if(result.isEmpty()){
            return null;
        }

        return result.get(0);
    }

    public void IsWorkerAlive(){
        ExecutorsManager.ExecuteOnBackgroundThread(() -> {
            try {
                WorkInfo workInfo = GetWorker();

                if(workInfo == null){
                    mPromise.resolve(false);
                    return;
                }

                if(!workInfo.getState().isFinished()){
                    mPromise.resolve(true);
                    return;
                }
                mPromise.resolve(false);

            } catch (ExecutionException | InterruptedException e) {
                mPromise.reject("Error", e.toString());
            }
        });
    }

    public void StopWorker(){
        ExecutorsManager.ExecuteOnBackgroundThread(() -> {
            try {
                WorkManager.getInstance(context).cancelUniqueWork(AutoBackupWorker.WORKER_NAME).getResult().get();
                mPromise.resolve(null);
            } catch (ExecutionException | InterruptedException e) {
                mPromise.reject("Error", e.toString());
            }
        });
    }

}
