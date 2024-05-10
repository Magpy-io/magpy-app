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
import androidx.annotation.Nullable;
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
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.opencloudphotos.NativeModules.MediaManagement.Utils.Definitions;
import com.opencloudphotos.NativeModules.MediaManagement.Utils.DeleteMedia;
import com.opencloudphotos.NativeModules.MediaManagement.Utils.GetMediaTask;
import com.opencloudphotos.NativeModules.MediaManagement.Utils.SaveToCameraRoll;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;

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
    public void getPhotoById(String id, Promise mPromise) {
        Uri external_images_uri = MediaStore.Files.getContentUri("external");
        Uri imageUri = Uri.withAppendedPath(external_images_uri, id);
        ContentResolver cr = getReactApplicationContext().getContentResolver();

        Cursor cursor = cr.query(
                imageUri,
                Definitions.PROJECTION,
                null,
                null,
                null);

        if(cursor != null){
            try
            {
                if (cursor.moveToFirst()) {
                    WritableMap node = new WritableNativeMap();

                    int idIndex = cursor.getColumnIndex(MediaStore.Images.Media._ID);
                    int mimeTypeIndex = cursor.getColumnIndex(MediaStore.Images.Media.MIME_TYPE);
                    int groupNameIndex = cursor.getColumnIndex(MediaStore.Images.Media.BUCKET_DISPLAY_NAME);
                    int dateTakenIndex = cursor.getColumnIndex(MediaStore.Images.Media.DATE_TAKEN);
                    int dateAddedIndex = cursor.getColumnIndex(MediaStore.MediaColumns.DATE_ADDED);
                    int dateModifiedIndex = cursor.getColumnIndex(MediaStore.MediaColumns.DATE_MODIFIED);
                    int widthIndex = cursor.getColumnIndex(MediaStore.MediaColumns.WIDTH);
                    int heightIndex = cursor.getColumnIndex(MediaStore.MediaColumns.HEIGHT);
                    int sizeIndex = cursor.getColumnIndex(MediaStore.MediaColumns.SIZE);
                    int dataIndex = cursor.getColumnIndex(MediaStore.MediaColumns.DATA);
                    int orientationIndex = cursor.getColumnIndex(MediaStore.MediaColumns.ORIENTATION);


                    long idNumber = cursor.getLong(idIndex);
                    String mimeType = cursor.getString(mimeTypeIndex);
                    boolean isVideo = mimeType != null && mimeType.startsWith("video");


                    node.putString("id", Long.toString(idNumber));
                    node.putString("type", mimeType);
                    WritableArray group_name = Arguments.createArray();
                    group_name.pushString(cursor.getString(groupNameIndex));
                    node.putArray("group_name", group_name);
                    long dateTaken = cursor.getLong(dateTakenIndex);
                    if (dateTaken == 0L) {
                        //date added is in seconds, date taken in milliseconds, thus the multiplication
                        dateTaken = cursor.getLong(dateAddedIndex) * 1000;
                    }
                    node.putDouble("timestamp", dateTaken / 1000d);
                    node.putDouble("modificationTimestamp", cursor.getLong(dateModifiedIndex));

                    Uri photoUri = Uri.parse("file://" + cursor.getString(dataIndex));
                    node.putString("uri", photoUri.toString());

                    File file = new File(cursor.getString(dataIndex));
                    String strFileName = file.getName();
                    node.putString("filename", strFileName);

                    node.putDouble("fileSize", cursor.getLong(sizeIndex));

                    int width = cursor.getInt(widthIndex);
                    int height = cursor.getInt(heightIndex);

                    if(!cursor.isNull(orientationIndex)) {
                        int orientation = cursor.getInt(orientationIndex);
                        if (orientation >= 0 && orientation % 180 != 0) {
                            int temp = width;
                            width = height;
                            height = temp;
                        }
                    }

                    node.putDouble("width", width);
                    node.putDouble("height", height);

                    if(width <= 0 || height <= 0){
                        Log.d("Tag", "no width or height");
                        throw new Exception("Media height or width not found.");
                    }

                    mPromise.resolve(node);
                }else{
                    Log.d("Tag", "Media id not found");
                    mPromise.reject("GetPhotoByIdError", "Media id not found");
                }
            }
            catch(Exception e){
                Log.d("Tag", e.toString());
                mPromise.reject("GetPhotoByIdError", e);
            }
            finally {
                cursor.close();
            }
        }else{
            mPromise.reject("GetPhotoByIdError", "Could not get cursor from ContentProvider query.");
        }
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

        GetMediaTask.ResultCallback resultCallback = new GetMediaTask.ResultCallback(){

            @Override
            public void reject(String s, String s1) {
                promise.reject(s,s1);
            }

            @Override
            public void resolve(WritableMap result) {
                promise.resolve(result);
            }
        };

        new GetMediaTask(
                getReactApplicationContext(),
                first,
                after,
                groupName,
                mimeTypes,
                assetType,
                fromTime,
                toTime,
                include,
                resultCallback)
                .executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR);
    }

    @ReactMethod
    public void saveToCameraRoll(String uri, ReadableMap options, Promise promise) {
        new SaveToCameraRoll(getReactApplicationContext(), Uri.parse(uri), options, promise)
                .executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR);
    }

    @ReactMethod
    public void testFunction(){

        class PhotoData{
            public String name;
            public double fileSize;
            public double width;
            public double height;
            public String mediaId;
            public String date;
            public String image64;
            public String uri;

        }

        GetMediaTask.ResultCallback resultCallback = new GetMediaTask.ResultCallback(){

            @Override
            public void reject(String s, String s1) {
                throw new RuntimeException(s1);
            }

            @RequiresApi(api = Build.VERSION_CODES.O)
            @Override
            public void resolve(WritableMap result) {
                ReadableArray edges = result.getArray("edges");

                String[] ids = new String[edges.size()];

                for(int i = 0; i< edges.size(); i++){
                    ReadableMap item = edges.getMap(i);
                    ReadableMap node = item.getMap("node");
                    String id = node.getString("id");
                    ids[i] = id;
                }

                MediaType JSON = MediaType.get("application/json");
                OkHttpClient client = new OkHttpClient();

                JSONObject jsonRequest = new JSONObject();
                try {
                    jsonRequest.put("photoType", "data");
                    jsonRequest.put("deviceUniqueId", "7a83660e-9509-4e94-9dc8-7c5ef3dbef83");

                    JSONArray photosData = new JSONArray();

                    for (String id : ids) {
                        JSONObject photosDataElement = new JSONObject();
                        photosDataElement.put("mediaId", id);

                        photosData.put(photosDataElement);
                    }

                    jsonRequest.put("photosData", photosData);

                } catch (Exception e) {
                    Log.d("main", e.getMessage());
                }

                RequestBody body = RequestBody.create(jsonRequest.toString(), JSON);
                Request request = new Request.Builder()
                        .url("http://192.168.0.15:8000/getPhotosByMediaId")
                        .post(body)
                        .addHeader("x-authorization","Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ODg0OGM0ZDE0ODUxMTIxMzMwZWMzZSIsImlhdCI6MTcxNTI5NDkwNywiZXhwIjoxNzE1MzgxMzA3fQ.2ym3CzGYG83puxzCTqkoAxYx7iid4uSKDqC1UCf9_xc")
                        .build();

                String ret = null;
                Response response = null;
                try {
                    response = client.newCall(request).execute();
                    ret = response.body().string();
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }

                JSONArray photos;
                try {
                    JSONObject jsonResponse = new JSONObject(ret);
                    JSONObject data = jsonResponse.getJSONObject("data");
                    photos = data.getJSONArray("photos");
                } catch (JSONException e) {
                    throw new RuntimeException(e);
                }

                List<PhotoData> missingPhotos = new ArrayList<PhotoData>();

                try {
                    for(int i = 0; i< photos.length(); i++) {
                        JSONObject photo = photos.getJSONObject(i);
                        boolean exists = photo.getBoolean("exists");
                        String id = photo.getString("mediaId");
                        if(!exists){
                            ReadableMap item = edges.getMap(i);
                            ReadableMap node = item.getMap("node");
                            ReadableMap image = node.getMap("image");
                            PhotoData photoData = new PhotoData();


                            Double timestamp = node.getDouble("timestamp");
                            Double modificationTimestamp = node.getDouble("modificationTimestamp");

                            Double correctTimestamp = Math.min(timestamp, modificationTimestamp);

                            Instant instant = Instant.ofEpochSecond(correctTimestamp.longValue());
                            String timestampAsIso = instant.toString();

                            photoData.mediaId = id;
                            photoData.uri = image.getString("uri");
                            photoData.fileSize = image.getDouble("fileSize");
                            photoData.height = image.getDouble("height");
                            photoData.width = image.getDouble("width");
                            photoData.name = image.getString("filename");
                            photoData.date = timestampAsIso;


                            InputStream inputStream = getReactApplicationContext().getContentResolver().openInputStream(Uri.parse(photoData.uri));
                            ByteArrayOutputStream byteBuffer = new ByteArrayOutputStream();

                            int bufferSize = 1024;
                            byte[] buffer = new byte[bufferSize];

                            int len = 0;
                            while ((len = inputStream.read(buffer)) != -1) {
                                byteBuffer.write(buffer, 0, len);
                            }

                            byte[] b = byteBuffer.toByteArray();

                            photoData.image64  = Base64.encodeToString(b, 0);

                            missingPhotos.add(photoData);
                        }
                    }
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }


                Log.d("main", ret);


            }
        };

        WritableArray include = Arguments.createArray();
        include.pushString("fileSize");
        include.pushString("filename");
        include.pushString("imageSize");


        new GetMediaTask(
                getReactApplicationContext(),
                10,
                null,
                null,
                null,
                Definitions.ASSET_TYPE_PHOTOS,
                0,
                0,
                include,
                resultCallback)
                .executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR);
    }

    @RequiresApi(api = Build.VERSION_CODES.R)
    @ReactMethod
    public void deleteMedia(ReadableArray ids, Promise mPromise) {
        DeleteMedia.deletePhotos(ids, getReactApplicationContext(), mPromise);
    }
}