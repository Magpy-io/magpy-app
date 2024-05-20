package com.opencloudphotos.GlobalManagers.ServerQueriesManager;

import com.opencloudphotos.GlobalManagers.HttpManager;
import com.opencloudphotos.GlobalManagers.ServerQueriesManager.Common.PhotoData;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class PhotoUploader {

    protected String url;
    protected String deviceId;
    protected String serverToken;

    public PhotoUploader(String url, String serverToken, String deviceId){
        this.url = url;
        this.deviceId = deviceId;
        this.serverToken = serverToken;
    }

    public boolean uploadPhoto(PhotoData photo) throws IOException {

        String transferId;

        JSONObject jsonRequest = new JSONObject();
        JSONObject jsonResponse;

        try {
            jsonRequest.put("name", photo.name);
            jsonRequest.put("fileSize", photo.fileSize);
            jsonRequest.put("width", photo.width);
            jsonRequest.put("height", photo.height);
            jsonRequest.put("mediaId", photo.mediaId);
            jsonRequest.put("date", photo.date);
            jsonRequest.put("image64Len", photo.image64.length());
            jsonRequest.put("deviceUniqueId", deviceId);
        } catch (Exception e) {
            throw new RuntimeException("Error creating JSON request object.");
        }

        jsonResponse = HttpManager.SendRequest(url + "addPhotoInit", jsonRequest, serverToken);

        try {
            boolean ok = jsonResponse.getBoolean("ok");
            if(!ok){
                return false;
            }

            JSONObject data = jsonResponse.getJSONObject("data");
            transferId = data.getString("id");
        } catch (JSONException e) {
            throw new RuntimeException("Error parsing json response, expected properties not found.");
        }

        List<String> parts = splitString(photo.image64);

        for(int i = 0; i<parts.size(); i++){

            String part = parts.get(i);
            jsonRequest = new JSONObject();
            try {
                jsonRequest.put("id", transferId);
                jsonRequest.put("partNumber", i);
                jsonRequest.put("partSize", part.length());
                jsonRequest.put("photoPart", part);
            } catch (Exception e) {
                throw new RuntimeException("Error creating JSON request object.");
            }

            jsonResponse = HttpManager.SendRequest(url + "addPhotoPart", jsonRequest, serverToken);

            try {
                boolean ok = jsonResponse.getBoolean("ok");
                if(!ok){
                    return false;
                }
            } catch (JSONException e) {
                throw new RuntimeException("Error parsing json response, expected properties not found.");
            }
        }

        return true;
    }

    protected List<String> splitString(String str){
        int partSize = 100000;
        int numberOfParts = (int)(str.length() / partSize);

        List<String> parts = new ArrayList<>();

        for(int i = 0; i<numberOfParts; i++){
            parts.add(str.substring(i * partSize, (i+1) * partSize));
        }

        if(str.length() % partSize != 0){
            parts.add(str.substring(numberOfParts * partSize));
        }

        return parts;
    }

}
