package com.magpy.GlobalManagers.Logging;

import android.content.Context;
import android.util.Log;

import com.magpy.Utils.FileOperations;

import java.io.File;
import java.io.FileOutputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class Logger {
    private static final String LOGS_FOLDER_NAME = "logs";
    private File _loggerFile;
    private final Context _context;

    public Logger(Context context, String loggerBaseName){
        _context = context;
        setLoggerFile(loggerBaseName);
    }

    private void setLoggerFile(String loggerBaseName){
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd-HH-mm-ss-SSS", Locale.FRANCE);
        String formattedDate = sdf.format(new Date());

        String _loggerFileName = loggerBaseName + "_" + formattedDate + ".txt";

        File logsFolder = new File(_context.getExternalFilesDir(null), LOGS_FOLDER_NAME);
        _loggerFile = new File(logsFolder, _loggerFileName);
    }

    public void Log(String log){
        try {
            File folder = _loggerFile.getParentFile();

            if (!folder.exists()) {
                if (!folder.mkdirs()) {
                    Log.e("Logger", "Failed to create logs folder.");
                    return;
                }
            }

            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd-HH-mm-ss-SSS", Locale.FRANCE);
            String formattedDate = "[ " + sdf.format(new Date()) + " ]: ";

            FileOperations.writeToFile(_loggerFile, formattedDate + log + '\n');
        }catch(Exception e){
            Log.e("Logger", "Error while logging to file.", e);
        }
    }
}
