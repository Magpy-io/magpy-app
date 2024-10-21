package com.magpy.NativeModules.Events;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.magpy.Utils.BridgeFunctions;

public class EventPhotoUploadFailed {

    static final String EVENT_PHOTO_UPLOAD_FAILED = "PHOTO_UPLOAD_FAILED_EVENT_NAME";
    static final String EVENT_FIELD_NAME_MEDIA_ID = "mediaId";

    static public void Send(ReactContext context, String mediaId){
        WritableMap params = new WritableNativeMap();
        params.putString(EVENT_FIELD_NAME_MEDIA_ID, mediaId);
        BridgeFunctions.sendEvent(context, EVENT_PHOTO_UPLOAD_FAILED, params);
    }
}
