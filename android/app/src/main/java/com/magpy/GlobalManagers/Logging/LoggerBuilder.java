package com.magpy.GlobalManagers.Logging;

import static com.magpy.GlobalManagers.Logging.Logger.LOGGER_DEFAULT_BASE_NAME;
import android.content.Context;

public class LoggerBuilder {

    private String _loggerBaseName = null;
    private Context _context = null;
    private String _logPath = null;
    private boolean _shouldLogConsole = false;

    public LoggerBuilder(Context context){
        _context = context;
    }

    public LoggerBuilder setLoggerBaseName(String loggerBaseName){
        _loggerBaseName = loggerBaseName;
        return this;
    }

    public LoggerBuilder setLogPath(String logPath){
        _logPath = logPath;
        return this;
    }

    public LoggerBuilder setShouldLogConsole(boolean shouldLogConsole){
        _shouldLogConsole = shouldLogConsole;
        return this;
    }

    public Logger Build(){
        String loggerBaseName = _loggerBaseName != null ? _loggerBaseName : LOGGER_DEFAULT_BASE_NAME;
        String logPath = _logPath != null ? _logPath : "";

        return new Logger(_context, loggerBaseName, logPath, _shouldLogConsole);
    }

}
