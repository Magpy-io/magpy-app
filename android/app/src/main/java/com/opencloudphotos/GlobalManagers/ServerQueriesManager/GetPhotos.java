package com.opencloudphotos.GlobalManagers.ServerQueriesManager;

import androidx.annotation.NonNull;

import com.opencloudphotos.GlobalManagers.HttpManager;
import com.opencloudphotos.GlobalManagers.ServerQueriesManager.Common.ResponseNotOkException;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

public class GetPhotos {

    public enum PhotoType {
        DATA("data"),
        COMPRESSED("compressed"),
        ORIGINAL("original"),
        THUMBNAIL("thumbnail");

        private final String text;

        PhotoType(final String text) {
            this.text = text;
        }

        @NonNull
        @Override
        public String toString() {
            return text;
        }
    }

    protected String url;
    protected String deviceId;
    protected String serverToken;

    public GetPhotos(String url, String serverToken, String deviceId){
        this.url = url;
        this.deviceId = deviceId;
        this.serverToken = serverToken;
    }

    public boolean[] getPhotosExistById(String[] photosIds) throws ResponseNotOkException, IOException {

        JSONObject jsonRequest = formatJsonRequest(photosIds);

        JSONObject jsonResponse = HttpManager.SendRequest(url + "/getPhotosByMediaId", jsonRequest, serverToken);

        try {
            boolean ok = jsonResponse.getBoolean("ok");
            if(!ok){
                String errorCode = jsonResponse.getString("errorCode");
                String message = jsonResponse.getString("message");
                throw new ResponseNotOkException(errorCode, message);
            }

            JSONObject data = jsonResponse.getJSONObject("data");
            JSONArray photos = data.getJSONArray("photos");

            boolean[] response = new boolean[photos.length()];

            for(int i = 0; i< photos.length(); i++) {
                JSONObject photo = photos.getJSONObject(i);
                response[i] = photo.getBoolean("exists");
            }

            return response;
        } catch (JSONException e) {
            throw new RuntimeException("Error parsing json response, expected properties not found.", e);
        }
    }

    private @NonNull JSONObject formatJsonRequest(String[] photosIds) {
        JSONObject jsonRequest = new JSONObject();

        try {
            jsonRequest.put("photoType", PhotoType.DATA.toString());
            jsonRequest.put("deviceUniqueId", deviceId);

            JSONArray photosData = new JSONArray();

            for (String id : photosIds) {
                JSONObject photosDataElement = new JSONObject();
                photosDataElement.put("mediaId", id);

                photosData.put(photosDataElement);
            }

            jsonRequest.put("photosData", photosData);
        } catch (JSONException e) {
            throw new RuntimeException("Error creating JSON request object.", e);
        }
        return jsonRequest;
    }
}
