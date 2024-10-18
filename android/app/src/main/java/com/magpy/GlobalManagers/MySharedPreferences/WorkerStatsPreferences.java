package com.magpy.GlobalManagers.MySharedPreferences;

import android.content.Context;
import android.content.SharedPreferences;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;
import java.util.Date;
import java.util.List;

public class WorkerStatsPreferences extends MyPreferencesBase{

    private static final int NUMBER_EXECUTION_TIME_SAVED = 5;
    private static final String LAST_EXECUTION_TIME_KEY_NAME_BASE = "lastExecutionTime";
    private static final String LAST_EXECUTION_TIME_SPOT_KEY_NAME = "lastExecutionTimeSpot";

    public WorkerStatsPreferences(Context context) {
        super(context, PreferencesNames.WorkerStats);
        Date currentTime = Calendar.getInstance().getTime();
    }

    public long GetLastExecutionTime(){
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

    public void SetLastExecutionTime(long lastExecutionTime){
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
        editor.putInt(LAST_EXECUTION_TIME_SPOT_KEY_NAME, nextExecutionSpot);
        editor.apply();
    }

    public Collection<Long> GetAllExecutionTimes(){
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
        return sharedPref.getInt(LAST_EXECUTION_TIME_SPOT_KEY_NAME, -1);
    }

    private static String GetLastExecutionTimeKeyNameN(int n){
        return LAST_EXECUTION_TIME_KEY_NAME_BASE + String.valueOf(n);
    }
}
