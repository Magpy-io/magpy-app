package com.opencloudphotos.NativeModules;

import android.app.ActivityManager;
import android.content.Context;
import android.content.Intent;
import android.media.ExifInterface;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.opencloudphotos.Services.SendingMediaForegroundService;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

public class SendingMediaServiceModule extends ReactContextBaseJavaModule{
    public SendingMediaServiceModule(ReactApplicationContext context) {
        super(context);
    }

    @NonNull
    @Override
    public String getName() {
        return "SendingMediaServiceModule";
    }

    @RequiresApi(api = Build.VERSION_CODES.Q)
    public static boolean isServiceRunningInner(ReactContext context){
        //TODO change how to check for service running (maybe using broadcast receivers), getRunningServices is deprecated
        ActivityManager activityManager = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
        for(ActivityManager.RunningServiceInfo service: activityManager.getRunningServices(Integer.MAX_VALUE)) {
            if(SendingMediaForegroundService.class.getName().equals(service.service.getClassName())) {
                return true;
            }
        }
        return false;
    }

    @RequiresApi(api = Build.VERSION_CODES.Q)
    @ReactMethod
    public void getServiceState(Promise promise){
        if(!isServiceRunningInner(getReactApplicationContext())){
            promise.resolve("DESTROYED");
        }else{
            if(SendingMediaForegroundService.getInstance() != null){
                promise.resolve(SendingMediaForegroundService.getInstance().state);
            }else{
                promise.resolve("DESTROYED");
                Log.e("Service", "getServiceState: isServiceRunningInner true but instance is null");
            }
        }
    }

    @RequiresApi(api = Build.VERSION_CODES.Q)
    @ReactMethod
    public void getIds(Promise promise){
        if(!isServiceRunningInner(getReactApplicationContext())){
            promise.reject("SERVICE_NOT_RUNNING", "Service not running");
            return;
        }
        String[] ids = SendingMediaForegroundService.getInstance().getIds();

        if(ids == null){
            ids = new String[0];
        }

        WritableArray retArray = Arguments.createArray();

        for (String id : ids) {
            retArray.pushString(id);
        }
        promise.resolve((retArray));
    }

    @RequiresApi(api = Build.VERSION_CODES.Q)
    @ReactMethod
    public void getCurrentIndex(Promise promise){
        if(!isServiceRunningInner(getReactApplicationContext())){
            promise.reject("SERVICE_NOT_RUNNING", "Service not running");
            return;
        }

        double index = (double)SendingMediaForegroundService.getInstance().getCurrentIndex();
        promise.resolve(index);
    }

    @RequiresApi(api = Build.VERSION_CODES.Q)
    @ReactMethod
    public void startSendingMediaService(ReadableArray photos, Promise promise){
        Log.d("Service", "startSendingMediaService: started");
        if(isServiceRunningInner(getReactApplicationContext())){
            Log.d("Service", "startSendingMediaService: error server running");
            promise.reject("SERVICE_RUNNING", "Service running");
            return;
        }

        ReactContext context = getReactApplicationContext();
        Intent serviceIntent = new Intent(context,
                SendingMediaForegroundService.class);

        Log.d("Service", "startSendingMediaService: Start foreground service");
        context.startForegroundService(serviceIntent);

        String[] ids = new String[photos.size()];

        for(int i=0; i<photos.size(); i++){
            ids[i] = photos.getMap(i).getString("id");
        }

        Bundle b = new Bundle();
        b.putStringArray("ids", ids);


        Log.d("Service", "startSendingMediaService: waiting for instance creation");
        int waitCounter = 0;
        while((SendingMediaForegroundService.getInstance() == null || SendingMediaForegroundService.getInstance().state != "INACTIVE") && waitCounter < 10){
            waitCounter++;
            Log.d("Service", "startSendingMediaService: waitCounter : " + Integer.toString(waitCounter));
            try {
                Thread.sleep(10);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        if(waitCounter >= 10){
            promise.reject("ERROR_INIT_SERVICE_IN_TIME","Exception in startSendingMediaService. SendingMediaForegroundService not initialized before trying to send data to thread (sendDataToThread)");
            Log.e("Service", "Exception in startSendingMediaService. SendingMediaForegroundService not initialized before trying to send data to thread (sendDataToThread)");
            context.stopService(serviceIntent);
            return;
        }else{
            Log.d("Service", "startSendingMediaService: service instance created");
        }
        Log.d("Service", "startSendingMediaService: sending photos to foreground service");
        SendingMediaForegroundService.getInstance().sendPhotos(b);
        promise.resolve(null);
        Log.d("Service", "startSendingMediaService: finished");
    }

    @RequiresApi(api = Build.VERSION_CODES.Q)
    @ReactMethod
    public void onJsTaskFinished(ReadableMap data){
        Log.d("Service", "onJsTaskFinished: started");
        String returnCode = data.getString("code");
        String serverId = data.getString("id");
        if(isServiceRunningInner(getReactApplicationContext())){
            Log.d("Service", "onJsTaskFinished: isServiceRunningInner true");
            if(SendingMediaForegroundService.getInstance() != null){
                if(SendingMediaForegroundService.getInstance().state.equals("ACTIVE")){
                    Log.d("Service", "onJsTaskFinished: calling sendingMediaServiceOnTaskFinished");
                    SendingMediaForegroundService.getInstance().onTaskFinished(returnCode, serverId);
                }else{
                    Log.d("Service", "onJsTaskFinished: service isServiceRunningInner but not active");
                }
            }else{
                Log.e("Service", "onJsTaskFinished: Service isServiceRunningInner but instance is null");
            }
        }else{
            Log.d("Service", "onJsTaskFinished: isServiceRunningInner false");
        }

        Log.d("Service", "onJsTaskFinished: finished");
    }

    @RequiresApi(api = Build.VERSION_CODES.Q)
    @ReactMethod
    public void stopSendingMediaService(Promise promise){
        Log.d("Service", "stopSendingMediaService: started");
        if(!isServiceRunningInner(getReactApplicationContext())){
            Log.d("Service", "stopSendingMediaService: cannot stop, already stopped");
            promise.reject("SERVICE_NOT_RUNNING", "Service not running");
            return;
        }
        Log.d("Service", "stopSendingMediaService: stopping service");
        SendingMediaForegroundService.getInstance().stopService();
        promise.resolve(null);
        Log.d("Service", "stopSendingMediaService: finished");
    }
}