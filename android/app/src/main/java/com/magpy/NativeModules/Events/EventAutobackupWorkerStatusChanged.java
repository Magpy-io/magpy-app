package com.magpy.NativeModules.Events;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.magpy.Utils.BridgeFunctions;

public class EventAutobackupWorkerStatusChanged {

    public static final String EVENT_WORKER_STATUS_CHANGED = "AUTO_BACKUP_WORKER_STATUS_CHANGED";

    static public void Send(ReactContext context, String workerStatus){
        WritableMap params = new WritableNativeMap();
        params.putString("status", workerStatus);
        BridgeFunctions.sendEvent(context, EVENT_WORKER_STATUS_CHANGED, params);
    }
}
