package com.opencloudphotos.GlobalManagers;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class ExecutorsManager {
    public static ExecutorService executorService = Executors.newFixedThreadPool(4);
}
