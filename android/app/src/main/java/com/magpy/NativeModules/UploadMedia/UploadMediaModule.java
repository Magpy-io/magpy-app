package com.magpy.NativeModules.UploadMedia;

import static com.magpy.NativeModules.Parsers.WorkerStateParser.ParseWorkerState;

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
import com.magpy.NativeModules.Events.EventAutobackupWorkerStatusChanged;
import com.magpy.NativeModules.Events.EventPhotoUploaded;
import com.magpy.NativeModules.Events.EventUploadWorkerStatusChanged;
import com.magpy.Utils.BridgeFunctions;
import com.magpy.Utils.CallbackEmptyWithThrowable;
import com.magpy.Utils.CallbackWithParameterAndThrowable;

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
                    EventPhotoUploaded.Send(getReactApplicationContext(), observerData.mediaId, observerData.photo);
                }

                if(observerData.workerState != null){
                    EventUploadWorkerStatusChanged.Send(getReactApplicationContext(), ParseWorkerState(observerData.workerState));
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