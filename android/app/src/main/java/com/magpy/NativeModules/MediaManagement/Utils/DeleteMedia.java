package com.magpy.NativeModules.MediaManagement.Utils;

import static android.app.Activity.RESULT_CANCELED;

import android.content.ContentResolver;
import android.content.ContentUris;
import android.content.Context;
import android.content.Intent;
import android.content.IntentSender;
import android.net.Uri;
import android.os.Build;
import android.provider.MediaStore;

import androidx.activity.result.IntentSenderRequest;
import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableType;

import java.util.ArrayList;

public class DeleteMedia {

    private static final String ERROR_URIS_NOT_FOUND = "ERROR_URIS_NOT_FOUND";
    private static final String ERROR_USER_REJECTED = "ERROR_USER_REJECTED";
    private static final String ERROR_URIS_PARAMETER_NULL = "ERROR_URIS_PARAMETER_NULL";
    private static final String ERROR_URIS_PARAMETER_INVALID = "ERROR_URIS_PARAMETER_INVALID";
    private static final String ERROR_MODULE_NOT_INITIALIZED = "ERROR_MODULE_NOT_INITIALIZED";
    private static final String ERROR_UNEXPECTED = "ERROR_UNEXPECTED";


    private static long[] checkAndParseParams(ReadableArray ids) throws IllegalArgumentException, NullPointerException{

        if(ids == null){
            throw new NullPointerException();
        }

        long[] idsParsed = new long[ids.size()];

        for (int i=0; i<ids.size(); i++){
            if(ids.getType(i) != ReadableType.String){
                throw new IllegalArgumentException("Element " + Integer.toString(i) + " is not a string.");
            }

            long parsed = 0;

            try{
                parsed = Long.parseLong(ids.getString(i));
            }catch (Exception e){
                throw new IllegalArgumentException("Element " + Integer.toString(i) + " is not a valid id number.");
            }

            idsParsed[i] = parsed;
        }
        return idsParsed;
    }

    @RequiresApi(api = Build.VERSION_CODES.R)
    public static void deletePhotos(ReadableArray ids, Context context, Promise promise){

        if(ids.size() == 0){
            promise.resolve(null);
            return;
        }

        long[] idsParsed;

        try{
            idsParsed = checkAndParseParams(ids);
        }catch(IllegalArgumentException e){
            promise.reject(ERROR_URIS_PARAMETER_INVALID, "Error: uris parameter should be an array of valid uri strings");
            return;
        }catch(NullPointerException e){
            promise.reject(ERROR_URIS_PARAMETER_NULL, "Error: uris parameter is null");
            return;
        }


        ContentResolver resolver = context.getContentResolver();
        Uri external_images_uri = MediaStore.Images.Media.EXTERNAL_CONTENT_URI;

        ArrayList<Uri> arrayList = new ArrayList<>();
        for (int i=0; i<ids.size(); i++){
            Uri uri = ContentUris.withAppendedId(external_images_uri, idsParsed[i]);
            arrayList.add(uri);
        }

        IntentSender intentSender = MediaStore.createDeleteRequest(resolver, arrayList).getIntentSender();
        IntentSenderRequest senderRequest = new IntentSenderRequest.Builder(intentSender)
                .setFillInIntent(null)
                .setFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION, 0)
                .build();

        if(!ActivityResultLauncherWrapper.isInitialized()){
            promise.reject(ERROR_MODULE_NOT_INITIALIZED, "Error: the module was not initialized in the MainActivity.java file");
            return;
        }

        ActivityResultLauncherWrapper.setOnResult((boolean success, int error_code) -> {
            if(!success){
                if(error_code == RESULT_CANCELED){
                    promise.reject(ERROR_USER_REJECTED, "The user rejected the deletion of the media");
                }else{
                    promise.reject(ERROR_UNEXPECTED, "OnActivityResult for deleting media activity return error code : " + Integer.toString(error_code));
                }
            }else{
                promise.resolve(null);
            }
        });
        ActivityResultLauncherWrapper.getActivityResultLauncher().launch(senderRequest);
    }
}