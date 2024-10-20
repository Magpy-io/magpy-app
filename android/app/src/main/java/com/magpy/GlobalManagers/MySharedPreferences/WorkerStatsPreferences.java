package com.magpy.GlobalManagers.MySharedPreferences;

import android.content.Context;
import android.content.SharedPreferences;

import com.magpy.NativeModules.AutoBackup.AutoBackupWorkerManager;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;
import java.util.Date;

public class WorkerStatsPreferences extends MyPreferencesBase{

    private static final int NUMBER_EXECUTION_TIME_SAVED = 10;
    private static final String LAST_SUCCESS_RUN_TIME_KEY_NAME_BASE = "lastSuccessRunTime";
    private static final String LAST_SUCCESS_RUN_TIME_SPOT_KEY_NAME = "lastSuccessRunTimeSpot";
    private static final String LAST_FAILED_RUN_ERROR = "lastFailedRunError";
    private static final String LAST_FAILED_RUN_TIME = "lastFailedRunTime";

    public WorkerStatsPreferences(Context context) {
        super(context, PreferencesNames.WorkerStats);
    }

    public long GetLastSuccessRunTime(){
        int lastExecutionSpot = GetLastExecutionTimeSpot();
        if(lastExecutionSpot < 0){
            return -1;
        }

        long lastExecutionTime = GetExecutionTimeN(lastExecutionSpot);
        if(lastExecutionTime < 0){
            throw new RuntimeException("GetLastExecutionTime error, expected key was not found");
        }

        return lastExecutionTime;
    }

    public void SetLastSuccessRunTime(long lastExecutionTime){
        SharedPreferences sharedPref = GetSharedPreferencesHandler();

        int lastExecutionSpot = GetLastExecutionTimeSpot();

        int nextExecutionSpot;
        if (lastExecutionSpot < 0){
            nextExecutionSpot = 0;
        }else{
            nextExecutionSpot = (lastExecutionSpot + 1) % NUMBER_EXECUTION_TIME_SAVED;
        }

        SharedPreferences.Editor editor = sharedPref.edit();

        editor.putLong(GetLastExecutionTimeKeyNameN(nextExecutionSpot), lastExecutionTime);
        editor.putInt(LAST_SUCCESS_RUN_TIME_SPOT_KEY_NAME, nextExecutionSpot);
        editor.apply();
    }

    public void SetLastError(long lastFailedRunTime, AutoBackupWorkerManager.AutobackupWorkerError error){
        SharedPreferences sharedPref = GetSharedPreferencesHandler();

        SharedPreferences.Editor editor = sharedPref.edit();

        editor.putLong(LAST_FAILED_RUN_TIME, lastFailedRunTime);
        editor.putString(LAST_FAILED_RUN_ERROR, error.name());
        editor.apply();
    }

    public AutoBackupWorkerManager.AutobackupWorkerError GetLastError(){
        SharedPreferences sharedPref = GetSharedPreferencesHandler();
        String storedError = sharedPref.getString(LAST_FAILED_RUN_ERROR, AutoBackupWorkerManager.AutobackupWorkerError.UNEXPECTED_ERROR.name());

        return AutoBackupWorkerManager.AutobackupWorkerError.valueOf(storedError);
    }

    public long GetLastErrorTime(){
        SharedPreferences sharedPref = GetSharedPreferencesHandler();
        return sharedPref.getLong(LAST_FAILED_RUN_TIME, -1);
    }

    public Collection<Long> GetAllSuccessRunTimes(){
        Collection<Long> allExecutionTimes = new ArrayList<>(NUMBER_EXECUTION_TIME_SAVED);

        int lastExecutionTime = GetLastExecutionTimeSpot();

        if(lastExecutionTime < 0){
            return allExecutionTimes;
        }

        for (int i = 0; i < NUMBER_EXECUTION_TIME_SAVED; i++){
            int currentIndex = (lastExecutionTime + i + 1) % NUMBER_EXECUTION_TIME_SAVED;
            long currentExecutionTime = GetExecutionTimeN(currentIndex);

            if(currentExecutionTime < 0){
                continue;
            }
            allExecutionTimes.add(currentExecutionTime);
        }

        return allExecutionTimes;
    }

    private long GetExecutionTimeN(int n){
        SharedPreferences sharedPref = GetSharedPreferencesHandler();
        return sharedPref.getLong(GetLastExecutionTimeKeyNameN(n), -1);
    }

    private int GetLastExecutionTimeSpot(){
        SharedPreferences sharedPref = GetSharedPreferencesHandler();
        return sharedPref.getInt(LAST_SUCCESS_RUN_TIME_SPOT_KEY_NAME, -1);
    }

    private static String GetLastExecutionTimeKeyNameN(int n){
        return LAST_SUCCESS_RUN_TIME_KEY_NAME_BASE + String.valueOf(n);
    }
}
