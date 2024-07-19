package com.opencloudphotos.NativeModules.UploadMedia;

import static com.opencloudphotos.Workers.UploadWorker.UPLOADED_PHOTO_MEDIA_ID;

import android.content.Context;

import androidx.annotation.Nullable;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ProcessLifecycleOwner;
import androidx.work.Data;
import androidx.work.ExistingWorkPolicy;
import androidx.work.OneTimeWorkRequest;
import androidx.work.WorkInfo;
import androidx.work.WorkManager;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
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

    public void StartWorker(String url, String serverToken, String deviceId, String[] photosIds, Observer<String> observer){
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

        ExecutorsManager.ExecuteOnBackgroundThread(() -> {
            try {
                WorkManager.getInstance(context).enqueueUniqueWork(UploadWorker.WORKER_NAME, ExistingWorkPolicy.REPLACE, uploadRequest).getResult().get();
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
                mPromise.reject("Error", e.toString());
            }
        });
    }

    public void StopWorker(){
        ExecutorsManager.ExecuteOnBackgroundThread(() -> {
            try {
                WorkManager.getInstance(context).cancelUniqueWork(UploadWorker.WORKER_NAME).getResult().get();
                mPromise.resolve(null);
            } catch (ExecutionException | InterruptedException e) {
                mPromise.reject("Error", e.toString());
            }
        });
    }

}
