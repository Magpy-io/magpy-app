package com.opencloudphotos.NativeModules.MediaManagement;

import android.content.ContentResolver;
import android.database.Cursor;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Base64;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.opencloudphotos.GlobalManagers.ExecutorsManager;
import com.opencloudphotos.GlobalManagers.ServerQueriesManager.GetPhotos;
import com.opencloudphotos.GlobalManagers.ServerQueriesManager.PhotoUploader;
import com.opencloudphotos.NativeModules.MediaManagement.Utils.Definitions;
import com.opencloudphotos.NativeModules.MediaManagement.Utils.DeleteMedia;
import com.opencloudphotos.NativeModules.MediaManagement.Utils.GetMediaTask;
import com.opencloudphotos.NativeModules.MediaManagement.Utils.SaveToCameraRoll;
import com.opencloudphotos.GlobalManagers.ServerQueriesManager.Common.PhotoData;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class MediaManagementModule extends ReactContextBaseJavaModule {
    public MediaManagementModule(ReactApplicationContext context) {
        super(context);
    }

    @NonNull
    @Override
    public String getName() {
        return "MediaManagementModule";
    }


    @ReactMethod
    public void getRestoredMediaAbsolutePath(Promise promise){
        String restoredMediaRelativePath = Environment.DIRECTORY_DCIM + File.separator + "Restored";
        String path = Environment.getExternalStorageDirectory() + File.separator + restoredMediaRelativePath;
        promise.resolve(path);
    }

    @ReactMethod
    public void getPhotoById(String id, final ReadableMap params, Promise promise) {
        String after = params.hasKey("after") ? params.getString("after") : null;
        String groupName = params.hasKey("groupName") ? params.getString("groupName") : null;
        String assetType = params.hasKey("assetType") ? params.getString("assetType") : Definitions.ASSET_TYPE_PHOTOS;
        long fromTime = params.hasKey("fromTime") ? (long) params.getDouble("fromTime") : 0;
        long toTime = params.hasKey("toTime") ? (long) params.getDouble("toTime") : 0;
        ReadableArray mimeTypes = params.hasKey("mimeTypes")
                ? params.getArray("mimeTypes")
                : null;
        ReadableArray include = params.hasKey("include") ? params.getArray("include") : null;

        ExecutorsManager.executorService.execute(new Runnable() {
            @Override
            public void run() {
                try{
                    WritableMap result =  new GetMediaTask(
                            getReactApplicationContext(),
                            id,
                            1,
                            after,
                            groupName,
                            mimeTypes,
                            assetType,
                            fromTime,
                            toTime,
                            include)
                            .execute();
                    promise.resolve(result);
                } catch (GetMediaTask.RejectionException e){
                    promise.reject(e.errorCode, e.errorMessage);
                }
            }
        });
    }

    @ReactMethod
    public void getPhotos(final ReadableMap params, final Promise promise) {
        int first = params.getInt("first");
        String after = params.hasKey("after") ? params.getString("after") : null;
        String groupName = params.hasKey("groupName") ? params.getString("groupName") : null;
        String assetType = params.hasKey("assetType") ? params.getString("assetType") : Definitions.ASSET_TYPE_PHOTOS;
        long fromTime = params.hasKey("fromTime") ? (long) params.getDouble("fromTime") : 0;
        long toTime = params.hasKey("toTime") ? (long) params.getDouble("toTime") : 0;
        ReadableArray mimeTypes = params.hasKey("mimeTypes")
                ? params.getArray("mimeTypes")
                : null;
        ReadableArray include = params.hasKey("include") ? params.getArray("include") : null;

        ExecutorsManager.executorService.execute(new Runnable() {
            @Override
            public void run() {
                try{
                    WritableMap result = new GetMediaTask(
                            getReactApplicationContext(),
                            null,
                            first,
                            after,
                            groupName,
                            mimeTypes,
                            assetType,
                            fromTime,
                            toTime,
                            include)
                            .execute();
                    promise.resolve(result);
                } catch (GetMediaTask.RejectionException e){
                    promise.reject(e.errorCode, e.errorMessage);
                }
            }
        });
    }

    @ReactMethod
    public void saveToCameraRoll(String uri, ReadableMap options, Promise promise) {
        new SaveToCameraRoll(getReactApplicationContext(), Uri.parse(uri), options, promise)
                .executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR);
    }


    @RequiresApi(api = Build.VERSION_CODES.R)
    @ReactMethod
    public void deleteMedia(ReadableArray ids, Promise mPromise) {
        DeleteMedia.deletePhotos(ids, getReactApplicationContext(), mPromise);
    }
}