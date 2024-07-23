package com.opencloudphotos.NativeModules.UploadMedia;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.opencloudphotos.Utils.BridgeFunctions;

public class UploadMediaModule extends ReactContextBaseJavaModule {
    public UploadMediaModule(ReactApplicationContext context) {
        super(context);
    }

    @NonNull
    @Override
    public String getName() {
        return "UploadMediaModule";
    }

    @ReactMethod
    public void StartUploadWorker(ReadableMap data, Promise mPromise) {
        UploadWorkerManager uploadWorkerManager = new UploadWorkerManager(getReactApplicationContext(), mPromise);

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

        ReadableArray photosIdsReadableArray = data.getArray("photosIds");
        if(photosIdsReadableArray == null){
            mPromise.reject("Error", "photosIds not defined in data input object.");
            return;
        }

        String[] photosIds = new String[photosIdsReadableArray.size()];

        try{
            for(int i=0; i<photosIdsReadableArray.size(); i++){
                String photoId = photosIdsReadableArray.getString(i);
                photosIds[i] = photoId;
            }
        }catch (ClassCastException e){
            mPromise.reject("Error", "photosIds should be an array of strings.");
            return;
        }
        uploadWorkerManager.StartWorker(url, serverToken, deviceId, photosIds, mediaId -> {
            WritableMap params = new WritableNativeMap();
            params.putString("mediaId", mediaId);
            BridgeFunctions.sendEvent(getReactApplicationContext(), "PhotoUploaded", params);
        });
    }

    @ReactMethod
    public void IsWorkerAlive(Promise mPromise) {
        UploadWorkerManager uploadWorkerManager = new UploadWorkerManager(getReactApplicationContext(), mPromise);
        uploadWorkerManager.IsWorkerAlive();
    }

    @ReactMethod
    public void StopWorker(Promise mPromise) {
        UploadWorkerManager uploadWorkerManager = new UploadWorkerManager(getReactApplicationContext(), mPromise);
        uploadWorkerManager.StopWorker();
    }
}