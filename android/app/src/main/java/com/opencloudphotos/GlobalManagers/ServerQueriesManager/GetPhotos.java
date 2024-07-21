package com.opencloudphotos.GlobalManagers.ServerQueriesManager;

import android.util.Log;

import androidx.annotation.NonNull;

import com.opencloudphotos.GlobalManagers.HttpManager;
import com.opencloudphotos.GlobalManagers.ServerQueriesManager.Common.PhotoData;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

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

    public boolean[] getPhotosExistById(String[] photosIds) throws Exception {

        JSONObject jsonRequest = new JSONObject();
        JSONObject jsonResponse;

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

        } catch (Exception e) {
            throw new RuntimeException("Error creating JSON request object.");
        }

        jsonResponse = HttpManager.SendRequest(url + "/getPhotosByMediaId", jsonRequest, serverToken);

        try {

            boolean ok = jsonResponse.getBoolean("ok");

            if(!ok){
                String message = jsonResponse.getString("message");
                throw new Exception("GetPhotos.getPhotosExistById: request failed" + message);
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
            throw new RuntimeException("Error parsing json response, expected properties not found.");
        }
    }



}
