package com.magpy.GlobalManagers;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

import okhttp3.Call;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class HttpManager {

    private static HttpManager instance = null;
    private static final MediaType JSON = MediaType.get("application/json");

    OkHttpClient client;

    public static HttpManager getInstance(){
        if(instance == null){
            instance = new HttpManager();
        }

        return instance;
    }

    private HttpManager(){
        client = new OkHttpClient();
    }

    public static JSONObject SendRequest(String url, JSONObject bodyJson, String token) throws ServerUnreachable {

        RequestBody body = RequestBody.create(bodyJson.toString(), JSON);

        Request request = new Request.Builder()
                .url(url)
                .post(body)
                .addHeader("x-authorization","Bearer " + token)
                .build();

        Call call = getInstance().client.newCall(request);
        try (Response response = call.execute()){
            String responseString = response.body().string();
            return new JSONObject(responseString);
        } catch (JSONException e) {
            throw new RuntimeException("HttpManager.SendRequest: error while parsing response to Json object.", e);
        }catch(IOException e){
            throw new ServerUnreachable(e);
        }
    }

    public static JSONObject SendRequest(String url, byte[] bodyArray, String token) throws ServerUnreachable {

        RequestBody body = RequestBody.create(bodyArray, JSON);

        Request request = new Request.Builder()
                .url(url)
                .post(body)
                .addHeader("x-authorization","Bearer " + token)
                .build();

        Call call = getInstance().client.newCall(request);
        try (Response response = call.execute()){
            String responseString = response.body().string();
            return new JSONObject(responseString);
        } catch (JSONException e) {
            throw new RuntimeException("HttpManager.SendRequest: error while parsing response to Json object.", e);
        } catch(IOException e){
            throw new ServerUnreachable(e);
        }
    }

    public static class ServerUnreachable extends Exception{
        public ServerUnreachable(Throwable e){
            super(e);
        }
    }
}
