package com.magpy.NativeModules.AutoBackup;

import android.os.Build;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.work.WorkInfo;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.magpy.GlobalManagers.ExecutorsManager;
import com.magpy.NativeModules.UploadMedia.UploadMediaModule;
import com.magpy.Utils.BridgeFunctions;

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

        ExecutorsManager.ExecuteOnBackgroundThread(() -> {
            try {
                autoBackupWorkerManager.StartWorker(url, serverToken, deviceId, observerData -> {
                    WritableMap params = new WritableNativeMap();
                    params.putString(UploadMediaModule.EVENT_FIELD_NAME_MEDIA_ID, observerData.mediaId);
                    params.putString(UploadMediaModule.EVENT_FIELD_NAME_PHOTO, observerData.photo);
                    BridgeFunctions.sendEvent(getReactApplicationContext(), UploadMediaModule.EVENT_PHOTO_UPLOADED, params);
                });
                mPromise.resolve(null);
            } catch (Exception e) {
                mPromise.reject("Error", e);
            }
        });
    }

    @ReactMethod
    public void IsWorkerAlive(Promise mPromise) {
        AutoBackupWorkerManager autoBackupWorkerManager = new AutoBackupWorkerManager(getReactApplicationContext());

        ExecutorsManager.ExecuteOnBackgroundThread(() -> {
            try {
                boolean isWorkerAlive = autoBackupWorkerManager.IsWorkerAlive();
                mPromise.resolve(isWorkerAlive);
            } catch (Exception e) {
                mPromise.reject("Error", e);
            }
        });
    }

    @ReactMethod
    public void StopWorker(Promise mPromise) {
        AutoBackupWorkerManager autoBackupWorkerManager = new AutoBackupWorkerManager(getReactApplicationContext());

        ExecutorsManager.ExecuteOnBackgroundThread(() -> {
            try {
                autoBackupWorkerManager.StopWorker();
                mPromise.resolve(null);
            } catch (Exception e) {
                mPromise.reject("Error", e);
            }
        });
    }

    @RequiresApi(api = Build.VERSION_CODES.S)
    @ReactMethod
    public void GetWorkerInfo(Promise mPromise){
        AutoBackupWorkerManager autoBackupWorkerManager = new AutoBackupWorkerManager(getReactApplicationContext());

        ExecutorsManager.ExecuteOnBackgroundThread(() -> {
            try {
                WorkInfo workInfo = autoBackupWorkerManager.GetWorker();
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
            } catch (Exception e) {
                mPromise.reject("Error", e);
            }
        });
    }
}