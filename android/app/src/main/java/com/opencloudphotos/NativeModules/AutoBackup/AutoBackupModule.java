package com.opencloudphotos.NativeModules.AutoBackup;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.opencloudphotos.NativeModules.UploadMedia.UploadMediaModule;
import com.opencloudphotos.Utils.BridgeFunctions;

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
        AutoBackupWorkerManager autoBackupWorkerManager = new AutoBackupWorkerManager(getReactApplicationContext(), mPromise);

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

        autoBackupWorkerManager.StartWorker(url, serverToken, deviceId, mediaId -> {
            WritableMap params = new WritableNativeMap();
            params.putString("mediaId", mediaId);
            BridgeFunctions.sendEvent(getReactApplicationContext(), UploadMediaModule.EVENT_PHOTO_UPLOADED, params);
        });
    }

    @ReactMethod
    public void IsWorkerAlive(Promise mPromise) {
        AutoBackupWorkerManager autoBackupWorkerManager = new AutoBackupWorkerManager(getReactApplicationContext(), mPromise);
        autoBackupWorkerManager.IsWorkerAlive();
    }

    @ReactMethod
    public void StopWorker(Promise mPromise) {
        AutoBackupWorkerManager autoBackupWorkerManager = new AutoBackupWorkerManager(getReactApplicationContext(), mPromise);
        autoBackupWorkerManager.StopWorker();
    }
}