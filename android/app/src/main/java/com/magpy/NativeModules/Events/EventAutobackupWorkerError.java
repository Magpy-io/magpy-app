package com.magpy.NativeModules.Events;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.magpy.NativeModules.AutoBackup.AutoBackupWorkerManager;
import com.magpy.Utils.BridgeFunctions;

public class EventAutobackupWorkerError {

    public static final String EVENT_WORKER_ERROR_NAME = "AUTO_BACKUP_WORKER_ERROR";

    static public void Send(ReactContext context, WorkerError error){
        WritableMap params = new WritableNativeMap();
        params.putString("error", error.name());
        BridgeFunctions.sendEvent(context, EVENT_WORKER_ERROR_NAME, params);
    }

    static public void Send(ReactContext context, AutoBackupWorkerManager.AutobackupWorkerError error){
        Send(context, ParseWorkerError(error));
    }

    static public WorkerError ParseWorkerError(AutoBackupWorkerManager.AutobackupWorkerError error){
        WorkerError result = WorkerError.ERROR_AUTOBACKUP_WORKER_UNEXPECTED;

        switch (error) {
            case SERVER_NOT_REACHABLE -> result = WorkerError.ERROR_AUTOBACKUP_WORKER_SERVER_UNREACHABLE;
            case UNEXPECTED_ERROR -> result = WorkerError.ERROR_AUTOBACKUP_WORKER_UNEXPECTED;
        }
        return result;
    }

    public enum WorkerError{
        ERROR_AUTOBACKUP_WORKER_SERVER_UNREACHABLE,
        ERROR_AUTOBACKUP_WORKER_UNEXPECTED
    }
}
