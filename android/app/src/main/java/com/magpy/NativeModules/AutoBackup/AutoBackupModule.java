package com.magpy.NativeModules.AutoBackup;

import android.os.Build;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.work.WorkInfo;
import androidx.work.WorkManager;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.magpy.GlobalManagers.ExecutorsManager;
import com.magpy.GlobalManagers.MySharedPreferences.WorkerStatsPreferences;
import com.magpy.NativeModules.UploadMedia.UploadMediaModule;
import com.magpy.Utils.BridgeFunctions;
import com.magpy.Utils.CallbackEmptyWithThrowable;
import com.magpy.Utils.CallbackWithParameterAndThrowable;
import com.magpy.Workers.AutoBackupWorker;

import java.util.Collection;

public class AutoBackupModule extends ReactContextBaseJavaModule {
    public AutoBackupModule(ReactApplicationContext context) {
        super(context);
    }

    @NonNull
    @Override
    public String getName() {
        return "AutoBackupModule";
    }

    @ReactMethod
    public void StartBackupWorker(ReadableMap data, Promise mPromise) {
        try{
            AutoBackupWorkerManager autoBackupWorkerManager = new AutoBackupWorkerManager(getReactApplicationContext());

            String url = data.getString("url");
            if(url == null){
                mPromise.reject("Error", "url not defined in data input object.");
                return;
            }

            String serverToken = data.getString("serverToken");
            if(serverToken == null){
                mPromise.reject("Error", "serverToken not defined in data input object.");
                return;
            }

            String deviceId = data.getString("deviceId");
            if(deviceId == null){
                mPromise.reject("Error", "deviceId not defined in data input object.");
                return;
            }

            autoBackupWorkerManager.StartWorker(url, serverToken, deviceId, observerData -> {
                WritableMap params = new WritableNativeMap();
                params.putString(UploadMediaModule.EVENT_FIELD_NAME_MEDIA_ID, observerData.mediaId);
                params.putString(UploadMediaModule.EVENT_FIELD_NAME_PHOTO, observerData.photo);
                BridgeFunctions.sendEvent(getReactApplicationContext(), UploadMediaModule.EVENT_PHOTO_UPLOADED, params);
            }, new CallbackEmptyWithThrowable() {
                @Override
                public void onSuccess() {
                    mPromise.resolve(null);
                }

                @Override
                public void onFailed(Throwable e) {
                    mPromise.reject("Error", e);
                }
            });

        }catch(Exception e){
            mPromise.reject("Error", e);
        }
    }

    @ReactMethod
    public void IsWorkerAlive(Promise mPromise) {
        AutoBackupWorkerManager autoBackupWorkerManager = new AutoBackupWorkerManager(getReactApplicationContext());
        autoBackupWorkerManager.IsWorkerAlive(new CallbackWithParameterAndThrowable<Boolean>() {
            @Override
            public void onSuccess(Boolean result) {
                mPromise.resolve(result);
            }

            @Override
            public void onFailed(Throwable e) {
                mPromise.reject("Error", e);
            }
        });
    }

    @ReactMethod
    public void StopWorker(Promise mPromise) {
        AutoBackupWorkerManager autoBackupWorkerManager = new AutoBackupWorkerManager(getReactApplicationContext());
        autoBackupWorkerManager.StopWorker(new CallbackEmptyWithThrowable() {
            @Override
            public void onSuccess() {
                mPromise.resolve(null);
            }

            @Override
            public void onFailed(Throwable e) {
                mPromise.reject("Error", e);
            }
        });
    }

    @RequiresApi(api = Build.VERSION_CODES.S)
    @ReactMethod
    public void GetWorkerInfo(Promise mPromise){
        AutoBackupWorkerManager autoBackupWorkerManager = new AutoBackupWorkerManager(getReactApplicationContext());
        autoBackupWorkerManager.GetWorker(new CallbackWithParameterAndThrowable<WorkInfo>() {
            @Override
            public void onSuccess(WorkInfo workInfo) {
                if(workInfo == null){
                    mPromise.resolve(null);
                    return;
                }

                WritableMap workInfoObject = new WritableNativeMap();
                workInfoObject.putString("state", workInfo.getState().name());
                workInfoObject.putDouble("nextScheduleMillis", workInfo.getState() == WorkInfo.State.ENQUEUED ? workInfo.getNextScheduleTimeMillis() : -1);
                workInfoObject.putDouble("repeatIntervalMillis", workInfo.getPeriodicityInfo() != null ? workInfo.getPeriodicityInfo().getRepeatIntervalMillis() : -1);
                workInfoObject.putDouble("stopReason", workInfo.getStopReason());

                mPromise.resolve(workInfoObject);
            }

            @Override
            public void onFailed(Throwable e) {
                mPromise.reject("Error", e);
            }
        });
    }

    @ReactMethod
    public void GetWorkerStats(Promise mPromise) {
        ExecutorsManager.ExecuteOnBackgroundThread(() -> {
            try {
                WorkerStatsPreferences workerStatsPreferences = new WorkerStatsPreferences(getReactApplicationContext());

                WritableMap workStatsObject = parseWorkerStatsPreferences(workerStatsPreferences);
                mPromise.resolve(workStatsObject);
            } catch (Exception e) {
                mPromise.reject("GetWorkerStatsError", e);
            }
        });
    }

    private static @NonNull WritableMap parseWorkerStatsPreferences(WorkerStatsPreferences workerStatsPreferences) {
        long lastExecutionTime = workerStatsPreferences.GetLastExecutionTime();
        Collection<Long> lastExecutionTimes = workerStatsPreferences.GetAllExecutionTimes();

        WritableArray lastExecutionTimesArray = new WritableNativeArray();

        for (Long executionTime: lastExecutionTimes) {
            lastExecutionTimesArray.pushDouble(executionTime);
        }

        WritableMap workStatsObject = new WritableNativeMap();
        if(lastExecutionTime < 0){
            workStatsObject.putNull("lastExecutionTime");
        }else{
            workStatsObject.putDouble("lastExecutionTime", lastExecutionTime);
        }
        workStatsObject.putArray("lastExecutionTimes", lastExecutionTimesArray);
        return workStatsObject;
    }
}