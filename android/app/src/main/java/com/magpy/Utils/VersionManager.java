package com.magpy.Utils;

import android.content.Context;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.Build;

public class VersionManager {

    public static int GetAndroidApiVersion(){
        return Build.VERSION.SDK_INT;
    }

    public static PackageInfo GetPackageInfo(Context context){
        try{
            return context.getPackageManager().getPackageInfo(context.getPackageName(), 0);
        }catch (PackageManager.NameNotFoundException e) {
            return null;
        }
    }
}
