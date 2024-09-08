package com.magpy.GlobalManagers.ServerQueriesManager.Common;

import androidx.annotation.Nullable;

public class ResponseNotOkException extends Exception{
    String mErrorCode;
    String mMessage;

    public ResponseNotOkException(String errorCode, String message){
        mErrorCode = errorCode;
        mMessage = message;
    }

    public String GetErrorCode(){
        return mErrorCode;
    }

    @Nullable
    @Override
    public String getMessage() {
        return mErrorCode + ": " + mMessage;
    }
}
