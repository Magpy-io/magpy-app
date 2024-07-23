package com.opencloudphotos.GlobalManagers.ServerQueriesManager.Common;

import androidx.annotation.Nullable;

public class ResponseNotOkException extends Exception{
    String mErrorCode;
    String mMessage;

    public ResponseNotOkException(String errorCode, String message){
        mErrorCode = errorCode;
        mMessage = message;
    }

    @Nullable
    @Override
    public String getMessage() {
        return mErrorCode + ": " + mMessage;
    }
}
