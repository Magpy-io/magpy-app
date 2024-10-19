package com.magpy.NativeModules.Events;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.magpy.Utils.BridgeFunctions;

public class EventPhotoUploaded {

    static final String EVENT_PHOTO_UPLOADED = "PHOTO_UPLOADED_EVENT_NAME";
    static final String EVENT_FIELD_NAME_MEDIA_ID = "mediaId";
    static final String EVENT_FIELD_NAME_PHOTO = "photo";

    static public void Send(ReactContext context, String mediaId, String photo){
        WritableMap params = new WritableNativeMap();
        params.putString(EVENT_FIELD_NAME_MEDIA_ID, mediaId);
        params.putString(EVENT_FIELD_NAME_PHOTO, photo);
        BridgeFunctions.sendEvent(context, EVENT_PHOTO_UPLOADED, params);
    }
}
