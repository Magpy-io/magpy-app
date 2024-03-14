package com.opencloudphotos;

import static android.app.Activity.RESULT_CANCELED;

import android.content.ContentResolver;
import android.content.ContentUris;
import android.content.Context;
import android.content.Intent;
import android.content.IntentSender;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.provider.MediaStore;

import androidx.activity.result.IntentSenderRequest;
import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableType;

import java.util.ArrayList;
import java.util.Collections;

public class DeleteMedia {

    private static final String ERROR_URIS_NOT_FOUND = "ERROR_URIS_NOT_FOUND";
    private static final String ERROR_USER_REJECTED = "ERROR_USER_REJECTED";
    private static final String ERROR_URIS_PARAMETER_NULL = "ERROR_URIS_PARAMETER_NULL";
    private static final String ERROR_URIS_PARAMETER_INVALID = "ERROR_URIS_PARAMETER_INVALID";
    private static final String ERROR_MODULE_NOT_INITIALIZED = "ERROR_MODULE_NOT_INITIALIZED";
    private static final String ERROR_UNEXPECTED = "ERROR_UNEXPECTED";


    private static String[] checkAndParseParams(ReadableArray urisString) throws IllegalArgumentException, NullPointerException{

        if(urisString == null){
            throw new NullPointerException();
        }

        String[] uris = new String[urisString.size()];

        for (int i=0; i<urisString.size(); i++){
            if(urisString.getType(i) != ReadableType.String){
                throw new IllegalArgumentException("Element " + Integer.toString(i) + " is not a string.");
            }
            uris[i] = urisString.getString(i);
        }
        return uris;
    }

    @RequiresApi(api = Build.VERSION_CODES.R)
    public static void deletePhotos(ReadableArray urisString, Context context, Promise promise){

        if(urisString.size() == 0){
            promise.resolve(null);
            return;
        }

        String[] urisParsed;

        try{
            urisParsed = checkAndParseParams(urisString);
        }catch(IllegalArgumentException e){
            promise.reject(ERROR_URIS_PARAMETER_INVALID, "Error: uris parameter should be an array of valid uri strings");
            return;
        }catch(NullPointerException e){
            promise.reject(ERROR_URIS_PARAMETER_NULL, "Error: uris parameter is null");
            return;
        }

        ContentResolver resolver = context.getContentResolver();
        // Set up the projection (we only need the ID)
        String[] projection = { MediaStore.Images.Media._ID };

        // Match on the file path
        String innerWhere = "?";
        for(int i=1; i<urisParsed.length; i++){
            innerWhere += ", ?";
        }

        String selection = MediaStore.Images.Media.DATA + " IN (" + innerWhere + ")";
        // Query for the ID of the media matching the file path
        Uri queryUri = MediaStore.Images.Media.EXTERNAL_CONTENT_URI;

        
        String[] selectionArgs = new String[urisParsed.length];

        for(int i=0; i<urisParsed.length; i++){
            Uri uri = Uri.parse(urisParsed[i]);
            selectionArgs[i] = uri.getPath();
        }

        Cursor cursor = resolver.query(queryUri, projection, selection, selectionArgs, null);

        ArrayList<Uri> arrayList = new ArrayList<>();
        while(cursor.moveToNext()){
            long id = cursor.getLong(cursor.getColumnIndexOrThrow(MediaStore.Images.Media._ID));
            Uri deleteUri = ContentUris.withAppendedId(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, id);
            arrayList.add(deleteUri);
        }

        if(arrayList.size() != urisParsed.length){
            promise.reject(ERROR_URIS_NOT_FOUND, "Error: some uris were not found on device");
            return;
        }

        Collections.addAll(arrayList);
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