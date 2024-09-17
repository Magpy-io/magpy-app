package com.magpy.NativeModules.UploadMedia;

import static com.magpy.Workers.UploadWorker.UPLOADED_PHOTO_MEDIA_ID;

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

import com.facebook.react.bridge.Promise;
import com.magpy.GlobalManagers.ExecutorsManager;
import com.magpy.Workers.UploadWorker;

import java.util.List;
import java.util.concurrent.ExecutionException;

public class UploadWorkerManager {

    Context context;
    Promise mPromise;

    public UploadWorkerManager(Context context, Promise promise){
        this.context = context;
        this.mPromise = promise;
    }

    public void StartWorker(String url, String serverToken, String deviceId, String[] photosIds, Observer<ObserverData> observer){

        if(photosIds.length == 0){
            mPromise.resolve(null);
            return;
        }

        OneTimeWorkRequest uploadRequest =
                new OneTimeWorkRequest.Builder(UploadWorker.class)
                        .setExpedited(OutOfQuotaPolicy.RUN_AS_NON_EXPEDITED_WORK_REQUEST)
                        .setInputData(
                                new Data.Builder()
                                        .putString(UploadWorker.DATA_KEY_URL, url)
                                        .putString(UploadWorker.DATA_KEY_SERVER_TOKEN, serverToken)
                                        .putString(UploadWorker.DATA_KEY_DEVICE_UNIQUE_ID, deviceId)
                                        .putStringArray(UploadWorker.DATA_KEY_PHOTOS_IDS, photosIds)
                                        .build()
                        )
                        .build();

        ExecutorsManager.ExecuteOnBackgroundThread(() -> {
            try {
                if(!WorkManager.isInitialized()){
                    WorkManager.initialize(context, new Configuration.Builder().setExecutor(ExecutorsManager.executorService).build());
                }

                WorkManager.getInstance(context).enqueueUniqueWork(UploadWorker.WORKER_NAME, ExistingWorkPolicy.REPLACE, uploadRequest).getResult().get();
                SetupWorkerObserver(observer);
            } catch (ExecutionException | InterruptedException e) {
                mPromise.reject("Error", e);
            }
        });
    }

    private void SetupWorkerObserver(Observer<ObserverData> observer){
        ExecutorsManager.ExecuteOnMainThread(() -> {
            try {
                WorkInfo result = GetWorker();
                WorkManager.getInstance(context).getWorkInfoByIdLiveData(result.getId()).observe(ProcessLifecycleOwner.get(), (workInfo -> {
                    if (workInfo != null) {

                        ObserverData data = new ObserverData();
                        data.workerState = workInfo.getState();

                        Data progress = workInfo.getProgress();
                        String uploadedMediaId = progress.getString(UPLOADED_PHOTO_MEDIA_ID);
                        if(uploadedMediaId != null){
                            data.mediaId = uploadedMediaId;
                        }

                        observer.onChanged(data);
                    }
                }));
            } catch (ExecutionException | InterruptedException e) {
                mPromise.reject("Error", e);
            }
            mPromise.resolve(null);
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
                mPromise.reject("Error", e);
            }
        });
    }

    public void StopWorker(){
        ExecutorsManager.ExecuteOnBackgroundThread(() -> {
            try {
                WorkManager.getInstance(context).cancelUniqueWork(UploadWorker.WORKER_NAME).getResult().get();
                mPromise.resolve(null);
            } catch (ExecutionException | InterruptedException e) {
                mPromise.reject("Error", e);
            }
        });
    }


    public class ObserverData{
        public String mediaId;
        public WorkInfo.State workerState;
    }

}
