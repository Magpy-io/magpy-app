package com.magpy.GlobalManagers.ServerQueriesManager;

import androidx.annotation.NonNull;

import com.google.common.primitives.Booleans;
import com.magpy.GlobalManagers.HttpManager;
import com.magpy.GlobalManagers.ServerQueriesManager.Common.ResponseNotOkException;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;

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

    public boolean[] getPhotosExistByIdBatched(String[] photosIds) throws ResponseNotOkException, IOException {
        int BATCH_SIZE = 500;

        ArrayList<Boolean> ret = new ArrayList<>(photosIds.length);

        int nbBatches = photosIds.length / BATCH_SIZE;

        for(int i = 0; i<nbBatches; i++){
            boolean[] ret_i = getPhotosExistById(Arrays.copyOfRange(photosIds, i * BATCH_SIZE, (i+1) * BATCH_SIZE));
            for (boolean b:ret_i){
                ret.add(b);
            }
        }

        int leftOvers = photosIds.length % BATCH_SIZE;

        if(leftOvers != 0){
            boolean[] ret_i = getPhotosExistById(Arrays.copyOfRange(photosIds, nbBatches * BATCH_SIZE, photosIds.length));
            for (boolean b:ret_i){
                ret.add(b);
            }
        }
        return Booleans.toArray(ret);
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
