package com.magpy.NativeModules.MediaManagement.Utils;

import static android.app.Activity.RESULT_OK;

import androidx.activity.result.ActivityResult;
import androidx.activity.result.ActivityResultCallback;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.IntentSenderRequest;
import androidx.activity.result.contract.ActivityResultContracts;

import com.facebook.react.ReactActivity;

public class ActivityResultLauncherWrapper {
    public interface ResultCallback{
        void onResult(boolean success, int error_code);
    }

    private ActivityResultLauncher<IntentSenderRequest> resultLauncher;
    private ResultCallback onResultCallback;
    private static final ActivityResultLauncherWrapper ourInstance = new ActivityResultLauncherWrapper();
    public static ActivityResultLauncherWrapper getInstance() {
        return ourInstance;
    }
    private ActivityResultLauncherWrapper() {
        onResultCallback = (success, error_code) -> {

        };
    }

    public static boolean isInitialized(){
        return getInstance().resultLauncher != null;
    }

    public static void init(ReactActivity activity) {
        getInstance().resultLauncher = activity.registerForActivityResult(
                new ActivityResultContracts.StartIntentSenderForResult(),
                new ActivityResultCallback<ActivityResult>() {
                    @Override
                    public void onActivityResult(ActivityResult result) {
                        if (result.getResultCode() == RESULT_OK){
                            getInstance().onResultCallback.onResult(true, result.getResultCode());
                        }else{
                            getInstance().onResultCallback.onResult(false, result.getResultCode());
                        }
                    }
                }
        );
    }

    public static void setOnResult(ResultCallback callback){
        getInstance().onResultCallback = callback;
    }

    public static void clearOnResult(){
        getInstance().onResultCallback = (success, error_code) -> {

        };
    }

    public static ActivityResultLauncher<IntentSenderRequest> getActivityResultLauncher() {
        return getInstance().resultLauncher;
    }
}
