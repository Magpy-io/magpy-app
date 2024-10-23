package com.magpy.GlobalManagers.ServerQueriesManager;

import com.magpy.GlobalManagers.HttpManager;
import com.magpy.GlobalManagers.ServerQueriesManager.Common.ResponseNotOkException;

import org.json.JSONException;
import org.json.JSONObject;

public class WhoAmI {

    protected String url;
    protected String serverToken;

    public WhoAmI(String url, String serverToken){
        this.url = url;
        this.serverToken = serverToken;
    }

    public void Send() throws ResponseNotOkException, HttpManager.ServerUnreachable {

        JSONObject jsonResponse = HttpManager.SendRequest(url + "/whoAmI", new JSONObject(), serverToken);

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
    }
}
