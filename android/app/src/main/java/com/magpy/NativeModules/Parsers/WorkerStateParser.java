package com.magpy.NativeModules.Parsers;

import androidx.work.WorkInfo;

public class WorkerStateParser {
    static final String WORKER_ENQUEUED = "WORKER_ENQUEUED";
    static final String WORKER_RUNNING = "WORKER_RUNNING";
    static final String WORKER_FAILED = "WORKER_FAILED";
    static final String WORKER_SUCCESS = "WORKER_SUCCESS";
    static final String WORKER_CANCELED = "WORKER_CANCELED";

    static public String ParseWorkerState(WorkInfo.State state){
        String stateParsed;
        switch (state) {
            case SUCCEEDED -> stateParsed = WORKER_SUCCESS;
            case ENQUEUED -> stateParsed = WORKER_ENQUEUED;
            case RUNNING -> stateParsed = WORKER_RUNNING;
            case CANCELLED -> stateParsed = WORKER_CANCELED;
            default -> stateParsed = WORKER_FAILED;
        }

        return stateParsed;
    }
}
