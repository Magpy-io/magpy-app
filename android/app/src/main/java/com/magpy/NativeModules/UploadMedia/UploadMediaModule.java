package com.magpy.NativeModules.UploadMedia;

import androidx.annotation.NonNull;
import androidx.work.WorkInfo;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.magpy.Utils.BridgeFunctions;
import com.magpy.Utils.CallbackEmptyWithThrowable;
import com.magpy.Utils.CallbackWithParameterAndThrowable;

public class UploadMediaModule extends ReactContextBaseJavaModule {

    public static final String EVENT_PHOTO_UPLOADED = "PHOTO_UPLOADED_EVENT_NAME";
    public static final String EVENT_WORKER_STATUS_CHANGED = "UPLOAD_WORKER_STATUS_CHANGED";

    public static final String WORKER_ENQUEUED = "WORKER_ENQUEUED";
    public static final String WORKER_RUNNING = "WORKER_RUNNING";
    public static final String WORKER_FAILED = "WORKER_FAILED";
    public static final String WORKER_SUCCESS = "WORKER_SUCCESS";
    public static final String WORKER_CANCELED = "WORKER_CANCELED";

    public static final String EVENT_FIELD_NAME_MEDIA_ID = "mediaId";
    public static final String EVENT_FIELD_NAME_PHOTO = "photo";


    public String workerStatus = WORKER_SUCCESS;

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
        try{
            UploadWorkerManager uploadWorkerManager = new UploadWorkerManager(getReactApplicationContext());

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

            String photosIdsFilePath = data.getString("photosIdsFilePath");
            if(photosIdsFilePath == null){
                mPromise.reject("Error", "photosIdsFilePath not defined in data input object.");
                return;
            }

            uploadWorkerManager.StartWorker(url, serverToken, deviceId, photosIdsFilePath, observerData -> {
                if (observerData.mediaId != null) {
                    SendEventPhotoUploaded(getReactApplicationContext(), observerData.mediaId, observerData.photo);
                }

                boolean hasStatusChanged = CheckStatusChanged(observerData.workerState);
                if (hasStatusChanged) {
                    SendEventStatusChanged(getReactApplicationContext(), workerStatus);
                }
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
        }
        catch(Exception e){
            mPromise.reject("Error", e);
        }
    }

    private boolean CheckStatusChanged(WorkInfo.State newState){
        String newWorkerStatus = "";
        switch (newState) {
            case SUCCEEDED -> newWorkerStatus = WORKER_SUCCESS;
            case ENQUEUED -> newWorkerStatus = WORKER_ENQUEUED;
            case RUNNING -> newWorkerStatus = WORKER_RUNNING;
            case CANCELLED -> newWorkerStatus = WORKER_CANCELED;
            default -> newWorkerStatus = WORKER_FAILED;
        }

        boolean hasStatusChanged = !newWorkerStatus.equals(workerStatus);

        if(hasStatusChanged){
            workerStatus = newWorkerStatus;
        }

        return hasStatusChanged;
    }

    static public void SendEventPhotoUploaded(ReactContext context, String mediaId, String photo){
        WritableMap params = new WritableNativeMap();
        params.putString(EVENT_FIELD_NAME_MEDIA_ID, mediaId);
        params.putString(EVENT_FIELD_NAME_PHOTO, photo);
        BridgeFunctions.sendEvent(context, EVENT_PHOTO_UPLOADED, params);
    }

    static private void SendEventStatusChanged(ReactContext context, String workerStatus){
        WritableMap params = new WritableNativeMap();
        params.putString("status", workerStatus);
        BridgeFunctions.sendEvent(context, EVENT_WORKER_STATUS_CHANGED, params);
    }

    @ReactMethod
    public void IsWorkerAlive(Promise mPromise) {
        UploadWorkerManager uploadWorkerManager = new UploadWorkerManager(getReactApplicationContext());
        uploadWorkerManager.IsWorkerAlive(new CallbackWithParameterAndThrowable<Boolean>() {
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
        UploadWorkerManager uploadWorkerManager = new UploadWorkerManager(getReactApplicationContext());
        uploadWorkerManager.StopWorker(
                new CallbackEmptyWithThrowable() {
                    @Override
                    public void onSuccess() {
                        mPromise.resolve(null);
                    }

                    @Override
                    public void onFailed(Throwable e) {
                        mPromise.reject("Error", e);
                    }
                }
        );
    }
}