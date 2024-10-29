package com.magpy.GlobalManagers.Logging;

import static com.magpy.Utils.VersionManager.GetAndroidApiVersion;
import static com.magpy.Utils.VersionManager.GetPackageInfo;

import android.content.Context;
import android.content.pm.PackageInfo;
import android.util.Log;

import androidx.annotation.NonNull;

import com.magpy.Utils.FileOperations;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class Logger {
    public static final String LOGS_FOLDER_NAME = "logs";
    public static final String LOGGER_DEFAULT_BASE_NAME = "log";

    public boolean ShouldLogConsole;

    private File _loggerFile;
    private final String _loggerBaseName;
    private final Context _context;
    private final String _logPath;

    public Logger(Context context, String loggerBaseName, String logPath, boolean shouldLogConsole){
        _logPath = logPath;
        _context = context;
        ShouldLogConsole = shouldLogConsole;
        _loggerBaseName = loggerBaseName;
        setLoggerFile(loggerBaseName);
    }

    private void setLoggerFile(String loggerBaseName){
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd_HH-mm-ss-SSS", Locale.FRANCE);
        String formattedDate = sdf.format(new Date());

        String _loggerFileName = loggerBaseName + "_" + formattedDate + ".txt";

        File logsFolder = new File(_context.getExternalFilesDir(null), LOGS_FOLDER_NAME);
        logsFolder = new File(logsFolder, _logPath);

        _loggerFile = new File(logsFolder, _loggerFileName);
    }

    public void Log(String log){

        try {
            Log.d(_loggerBaseName, log);
        }catch(Exception e){
            Log.e("Logger", "Error while logging to console.", e);
        }

        try {
            File folder = _loggerFile.getParentFile();

            FileOperations.createFolder(folder);

            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd_HH-mm-ss-SSS", Locale.FRANCE);
            String formattedDate = "[ " + sdf.format(new Date()) + " ]: ";

            FileOperations.writeToFile(_loggerFile, formattedDate + log + '\n');
        }catch(Exception e){
            Log.e("Logger", "Error while logging to file.", e);
        }
    }

    public void Log(String log, @NonNull Throwable e){
        Log(log + '\n' + e.getMessage());
    }

    public void LogVersion(){
        int ApiVersion = GetAndroidApiVersion();
        PackageInfo packageInfo = GetPackageInfo(_context);

        Log("Android API: " + ApiVersion);

        if(packageInfo != null){
            Log("Package version: " + packageInfo.versionName);
            Log("Package version number: " + packageInfo.versionCode);
        }else{
            Log("Could not retrieve package version.");
        }
    }
}
