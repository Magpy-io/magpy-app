package com.opencloudphotos.GlobalManagers;

import android.os.Handler;
import android.os.Looper;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class ExecutorsManager {
    private final static ExecutorService executorService = Executors.newFixedThreadPool(4);

    public static void ExecuteOnBackgroundThread(Runnable command){
        executorService.execute(command);
    }

    public static void ExecuteOnMainThread(Runnable command){
        Handler mainHandler = new Handler(Looper.getMainLooper());
        mainHandler.post(command);
    }
}
