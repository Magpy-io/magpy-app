package com.magpy.NativeModules.AutoBackup;

import static com.magpy.Workers.AutoBackupWorker.UPLOADED_PHOTO_MEDIA_ID;

import android.content.Context;
import android.util.Log;

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
import com.magpy.Workers.AutoBackupWorker;

import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

public class AutoBackupWorkerManager {

    Context context;

    public AutoBackupWorkerManager(Context context){
        this.context = context;
    }

    public void StartWorker(String url, String serverToken, String deviceId, Observer<String> observer) throws ExecutionException, InterruptedException {

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

        if(!WorkManager.isInitialized()){
            WorkManager.initialize(context, new Configuration.Builder().setExecutor(ExecutorsManager.executorService).build());
        }

        WorkManager.getInstance(context).enqueueUniquePeriodicWork(AutoBackupWorker.WORKER_NAME, ExistingPeriodicWorkPolicy.UPDATE, uploadRequest).getResult().get();
        SetupWorkerObserver(observer);
    }

    private void SetupWorkerObserver(Observer<String> observer) throws ExecutionException, InterruptedException {
        WorkInfo result = GetWorker();
        ExecutorsManager.ExecuteOnMainThread(() -> {
            try{
                WorkManager.getInstance(context).getWorkInfoByIdLiveData(result.getId()).observe(ProcessLifecycleOwner.get(), (workInfo -> {
                    if (workInfo != null) {
                        Data progress = workInfo.getProgress();
                        String uploadedMediaId = progress.getString(UPLOADED_PHOTO_MEDIA_ID);

                        if(uploadedMediaId != null){
                            observer.onChanged(uploadedMediaId);
                        }
                    }
                }));
            }catch (Exception e){
                Log.d("AutoBackupWorker", e.toString());
            }
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

    public boolean IsWorkerAlive() throws ExecutionException, InterruptedException {
        WorkInfo workInfo = GetWorker();

        if(workInfo == null){
            return false;
        }

        return !workInfo.getState().isFinished();
    }

    public void StopWorker() throws ExecutionException, InterruptedException {
        WorkManager.getInstance(context).cancelUniqueWork(AutoBackupWorker.WORKER_NAME).getResult().get();
    }
}
