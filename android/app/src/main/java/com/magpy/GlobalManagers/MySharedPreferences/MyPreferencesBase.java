package com.magpy.GlobalManagers.MySharedPreferences;

import android.content.Context;
import android.content.SharedPreferences;

public class MyPreferencesBase {
    protected final PreferencesNames preferencesNames;
    private final SharedPreferences sharedPreferencesHandler;

    protected MyPreferencesBase(Context context, PreferencesNames p_preferencesNames){
        this.preferencesNames = p_preferencesNames;
        this.sharedPreferencesHandler = context.getSharedPreferences(this.preferencesNames.ToString(context), 0);
    }

    protected SharedPreferences GetSharedPreferencesHandler(){
        return this.sharedPreferencesHandler;
    }
}
