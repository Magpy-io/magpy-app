package com.opencloudphotos.GlobalManagers.ServerQueriesManager;

import android.content.Context;

import com.opencloudphotos.GlobalManagers.HttpManager;
import com.opencloudphotos.GlobalManagers.ServerQueriesManager.Common.PhotoData;
import com.opencloudphotos.GlobalManagers.ServerQueriesManager.Common.ResponseNotOkException;
import com.opencloudphotos.Utils.FileOperations;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class PhotoUploader {

    protected String url;
    protected String deviceId;
    protected String serverToken;
    protected Context context;
    ByteArrayOutputStream byteBuffer = new ByteArrayOutputStream();

    public PhotoUploader(Context context, String url, String serverToken, String deviceId){
        this.context = context;
        this.url = url;
        this.deviceId = deviceId;
        this.serverToken = serverToken;
    }

    public void uploadPhoto(PhotoData photo) throws ResponseNotOkException, IOException {
        byte[] image64 = FileOperations.getBase64FromUri(context, photo.uri);

        JSONObject jsonRequest = formatJsonRequestAddPhotoInit(photo, image64);
        JSONObject jsonResponse = HttpManager.SendRequest(url + "/addPhotoInit", jsonRequest, serverToken);

        String transferId;
        try {
            boolean ok = jsonResponse.getBoolean("ok");
            if(!ok){
                String errorCode = jsonResponse.getString("errorCode");
                String message = jsonResponse.getString("message");
                throw new ResponseNotOkException(errorCode, message);
            }

            JSONObject data = jsonResponse.getJSONObject("data");
            transferId = data.getString("id");
        } catch (JSONException e) {
            throw new RuntimeException("Error parsing json response, expected properties not found.", e);
        }


        List<byte[]> parts = splitBytes(image64);

        int partNumber = 0;
        for(byte[] part:parts){
            jsonRequest = new JSONObject();
            try {
                jsonRequest.put("id", transferId);
                jsonRequest.put("partNumber", partNumber);
                jsonRequest.put("partSize", part.length);
                jsonRequest.put("photoPart", "");
            } catch (JSONException e) {
                throw new RuntimeException("Error creating JSON request object.", e);
            }

            byte[] jsonRequestByteArray = jsonRequest.toString().getBytes();

            byteBuffer.reset();

            byteBuffer.write(jsonRequestByteArray, 0, jsonRequestByteArray.length - 2);
            byteBuffer.write(part);
            byteBuffer.write('"');
            byteBuffer.write('}');

            jsonResponse = HttpManager.SendRequest(url + "/addPhotoPart", byteBuffer.toByteArray(), serverToken);

            try {
                boolean ok = jsonResponse.getBoolean("ok");
                if(!ok){
                    String errorCode = jsonResponse.getString("errorCode");
                    String message = jsonResponse.getString("message");
                    throw new ResponseNotOkException(errorCode, message);
                }
            } catch (JSONException e) {
                throw new RuntimeException("Error parsing json response, expected properties not found.", e);
            }

            partNumber++;
        }
    }

    private List<byte[]> splitBytes(byte[] bytes){
        int partSize = 100000;
        int numberOfParts = (int)(bytes.length / partSize);

        List<byte[]> parts = new ArrayList<>();

        for(int i = 0; i<numberOfParts; i++){
            parts.add(Arrays.copyOfRange(bytes, i * partSize, (i+1) * partSize));
        }

        if(bytes.length % partSize != 0){
            parts.add(Arrays.copyOfRange(bytes, numberOfParts * partSize, bytes.length));
        }

        return parts;
    }

    private JSONObject formatJsonRequestAddPhotoInit(PhotoData photo, byte[] image64){
        JSONObject jsonRequest = new JSONObject();

        try {
            jsonRequest.put("name", photo.name);
            jsonRequest.put("fileSize", photo.fileSize);
            jsonRequest.put("width", photo.width);
            jsonRequest.put("height", photo.height);
            jsonRequest.put("mediaId", photo.mediaId);
            jsonRequest.put("date", photo.date);
            jsonRequest.put("image64Len", image64.length);
            jsonRequest.put("deviceUniqueId", deviceId);
        } catch (JSONException e) {
            throw new RuntimeException("Error creating JSON request object.", e);
        }
        return jsonRequest;
    }

}
