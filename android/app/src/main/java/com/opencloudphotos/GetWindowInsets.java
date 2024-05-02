package com.opencloudphotos;

import android.app.Activity;
import android.util.Log;

import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;

import javax.annotation.Nullable;

public class GetWindowInsets{

    private static Integer top = null;
    private static Integer bottom = null;
    private static Integer right = null;
    private static Integer left = null;
    private static boolean isFullScreen = false;

    @Nullable
    public static Integer getTop() {
        return top;
    }
    @Nullable
    public static Integer getBottom() {
        return bottom;
    }
    @Nullable
    public static Integer getRight() {
        return right;
    }
    @Nullable
    public static Integer getLeft() {
        return left;
    }

    public static boolean IsFullScreen(){
        return isFullScreen;
    }

    public static void initGetWindowInsets(Activity activity){
        ViewCompat.setOnApplyWindowInsetsListener(activity.getWindow().getDecorView().findViewById(android.R.id.content), (v, windowInsets) -> {
            Insets insets = windowInsets.getInsets(WindowInsetsCompat.Type.systemBars());

            if(insets.top != 0){
                top = insets.top;
            }

            if(insets.bottom != 0){
                bottom = insets.bottom;
            }

            right = insets.right;
            left = insets.left;

            isFullScreen = insets.bottom == 0 && insets.top == 0;

            ReactContext reactContext;

            try{
                MainApplication application = (MainApplication) activity.getApplication();

                ReactNativeHost reactNativeHost = application.getReactNativeHost();
                ReactInstanceManager reactInstanceManager = reactNativeHost.getReactInstanceManager();
                reactContext = reactInstanceManager.getCurrentReactContext();
            }catch (Exception ex){
                Log.e("GetWindowInsets", "Exception while getting react context.");
                return WindowInsetsCompat.CONSUMED;
            }

            if (reactContext != null) {
                WritableMap params = new WritableNativeMap();
                params.putBoolean("isFullScreen", isFullScreen);
                MainModule.sendEvent(reactContext, "FullScreenChanged", params);
            }else{
                Log.e("GetWindowInsets", "React context is null.");
            }

            Log.d("GetWindowInsets", "OnApplyWindowInsetsListener executed.");
            // Return CONSUMED if you don't want want the window insets to keep being
            // passed down to descendant views.
            return WindowInsetsCompat.CONSUMED;
        });
    }
}
