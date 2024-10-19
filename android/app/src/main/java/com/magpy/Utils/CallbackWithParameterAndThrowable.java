package com.magpy.Utils;


public interface CallbackWithParameterAndThrowable<T> {
    public void onSuccess(T result);
    public void onFailed(Throwable e);
}
