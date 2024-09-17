package com.magpy.NativeModules.UploadMedia;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.magpy.Utils.BridgeFunctions;

import java.util.Objects;

public class UploadMediaModule extends ReactContextBaseJavaModule {

    public static final String EVENT_PHOTO_UPLOADED = "PHOTO_UPLOADED_EVENT_NAME";
    public static final String EVENT_WORKER_STATUS_CHANGED = "WORKER_STATUS_CHANGED_NAME";

    public static final String WORKER_ENQUEUED = "WORKER_ENQUEUED";
    public static final String WORKER_RUNNING = "WORKER_RUNNING";
    public static final String WORKER_FAILED = "WORKER_FAILED";
    public static final String WORKER_SUCCESS = "WORKER_SUCCESS";
    public static final String WORKER_CANCELED = "WORKER_CANCELED";

    public String workerStatus = WORKER_SUCCESS;
    public String lastSentMediaId = "";

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
        uploadWorkerManager.StartWorker(url, serverToken, deviceId, photosIds, observerData -> {
            if(observerData.mediaId != null && !Objects.equals(observerData.mediaId, lastSentMediaId)){
                lastSentMediaId = observerData.mediaId;
                WritableMap params = new WritableNativeMap();
                params.putString("mediaId", lastSentMediaId);
                BridgeFunctions.sendEvent(getReactApplicationContext(), EVENT_PHOTO_UPLOADED, params);
            }

            String newWorkerStatus = "";
            switch (observerData.workerState){
                case SUCCEEDED -> newWorkerStatus = WORKER_SUCCESS;
                case ENQUEUED -> newWorkerStatus = WORKER_ENQUEUED;
                case RUNNING -> newWorkerStatus = WORKER_RUNNING;
                case CANCELLED -> newWorkerStatus = WORKER_CANCELED;
                default -> newWorkerStatus = WORKER_FAILED;
            }


            if(!newWorkerStatus.equals(workerStatus)){
                workerStatus = newWorkerStatus;
                WritableMap params = new WritableNativeMap();
                params.putString("status", workerStatus);
                BridgeFunctions.sendEvent(getReactApplicationContext(), EVENT_WORKER_STATUS_CHANGED, params);
            }

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