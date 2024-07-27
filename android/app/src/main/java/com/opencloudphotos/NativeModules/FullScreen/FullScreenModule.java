package com.opencloudphotos.NativeModules.FullScreen;

import androidx.annotation.NonNull;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;


public class FullScreenModule extends ReactContextBaseJavaModule {

    public static final String EVENT_FULL_SCREEN_CHANGED = "FULL_SCREEN_CHANGED_EVENT";

    public FullScreenModule(ReactApplicationContext context) {
        super(context);
    }

    @NonNull
    @Override
    public String getName() {
        return "FullScreenModule";
    }

    @ReactMethod
    public void enableFullScreen(Promise promise){
        UiThreadUtil.runOnUiThread(
                new Runnable() {
                    @Override
                    public void run() {
                        WindowInsetsControllerCompat windowInsetsController =
                                WindowCompat.getInsetsController(getCurrentActivity().getWindow(), getCurrentActivity().getWindow().getDecorView());
                        windowInsetsController.hide(WindowInsetsCompat.Type.systemBars());
                    }
                }
        );
        promise.resolve(null);
    }

    @ReactMethod
    public void disableFullScreen(Promise promise){
        UiThreadUtil.runOnUiThread(
                new Runnable() {
                    @Override
                    public void run() {
                        WindowInsetsControllerCompat windowInsetsController =
                                WindowCompat.getInsetsController(getCurrentActivity().getWindow(), getCurrentActivity().getWindow().getDecorView());
                        windowInsetsController.show(WindowInsetsCompat.Type.systemBars());
                    }
                }
        );
        promise.resolve(null);
    }

    @ReactMethod
    public void getWindowInsets(Promise promise){
        WritableMap insets = new WritableNativeMap();
        boolean valid = GetWindowInsets.getTop() != null &&
                GetWindowInsets.getBottom() != null &&
                GetWindowInsets.getRight() != null &&
                GetWindowInsets.getLeft() != null;

        insets.putBoolean("valid", valid);
        if(valid){
            insets.putInt("top", GetWindowInsets.getTop());
            insets.putInt("bottom", GetWindowInsets.getBottom());
            insets.putInt("right", GetWindowInsets.getRight());
            insets.putInt("left", GetWindowInsets.getLeft());
            insets.putBoolean("isFullScreen", GetWindowInsets.IsFullScreen());
        }

        promise.resolve(insets);
    }
}