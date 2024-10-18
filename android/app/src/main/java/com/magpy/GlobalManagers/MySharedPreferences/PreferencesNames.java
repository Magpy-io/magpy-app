package com.magpy.GlobalManagers.MySharedPreferences;

import android.content.Context;

public class PreferencesNames {

    public static final PreferencesNames WorkerStats = new PreferencesNames("workerstats");

    private final String name;

    private PreferencesNames(String name){
        this.name = name;
    }

    public String ToString(Context context){
        return context.getPackageName() + "." + name;
    }
}
