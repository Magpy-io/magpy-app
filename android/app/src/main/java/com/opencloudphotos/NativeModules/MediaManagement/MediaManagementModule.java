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

    public String[] getIdsFromGetMedia(WritableMap result){
        ReadableArray edges = result.getArray("edges");

        String[] ids = new String[edges.size()];

        for(int i = 0; i< edges.size(); i++){
            ReadableMap item = edges.getMap(i);
            ReadableMap node = item.getMap("node");
            String id = node.getString("id");
            ids[i] = id;
        }
        return ids;
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    public List<PhotoData> getPhotosDataFromGetMediaIfNotInServer(WritableMap result, boolean[] photosExist, int numberOfPhotosToReturn){
        ReadableArray edges = result.getArray("edges");

        List<PhotoData> missingPhotos = new ArrayList<>();

        for(int i = 0; i< photosExist.length; i++) {
            boolean exists = photosExist[i];
            if(!exists){
                ReadableMap item = edges.getMap(i);
                ReadableMap node = item.getMap("node");
                ReadableMap image = node.getMap("image");
                PhotoData photoData = new PhotoData();

                double timestamp = node.getDouble("timestamp");
                double modificationTimestamp = node.getDouble("modificationTimestamp");

                double correctTimestamp = Math.min(timestamp, modificationTimestamp);

                Instant instant = Instant.ofEpochSecond((long)correctTimestamp);
                String timestampAsIso = instant.toString();

                photoData.mediaId = node.getString("id");
                photoData.uri = image.getString("uri");
                photoData.fileSize = image.getDouble("fileSize");
                photoData.height = image.getDouble("height");
                photoData.width = image.getDouble("width");
                photoData.name = image.getString("filename");
                photoData.date = timestampAsIso;


                InputStream inputStream = null;
                try {
                    inputStream = getReactApplicationContext().getContentResolver().openInputStream(Uri.parse(photoData.uri));
                } catch (FileNotFoundException e) {
                    throw new RuntimeException("Media file not found.", e);
                }
                ByteArrayOutputStream byteBuffer = new ByteArrayOutputStream();

                int bufferSize = 1024;
                byte[] buffer = new byte[bufferSize];

                int len = 0;

                try{
                    while ((len = inputStream.read(buffer)) != -1) {
                        byteBuffer.write(buffer, 0, len);
                    }
                } catch (IOException e) {
                    throw new RuntimeException("Error while reading media file.", e);
                }

                byte[] b = byteBuffer.toByteArray();

                photoData.image64 = Base64.encodeToString(b, 0);

                missingPhotos.add(photoData);

                if(missingPhotos.size() >= numberOfPhotosToReturn){
                    break;
                }
            }
        }
        return missingPhotos;
    }

    @ReactMethod
    public void testFunction(){
        GetMediaTask.ResultCallback resultCallback = new GetMediaTask.ResultCallback(){

            @Override
            public void reject(String s, String s1) {
                throw new RuntimeException(s1);
            }

            @RequiresApi(api = Build.VERSION_CODES.O)
            @Override
            public void resolve(WritableMap result) {

                String[] ids = getIdsFromGetMedia(result);

                GetPhotos getPhotos = new GetPhotos(
                        "http://192.168.0.15:8000",
                        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ODg0OGM0ZDE0ODUxMTIxMzMwZWMzZSIsImlhdCI6MTcxNTg4MzY5MCwiZXhwIjoxNzE4NDc1NjkwfQ.9octfxmAhZMgxTDp0xcT0oDuOf0BWzdCEADpy1X-zNI",
                        "7a83660e-9509-4e94-9dc8-7c5ef3dbef83");

                boolean[] photosExist;

                try {
                    photosExist = getPhotos.getPhotosExistById(ids);
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }

                final int MAX_MISSING_PHOTOS_TO_UPLOAD = 10;
                List<PhotoData> missingPhotos = getPhotosDataFromGetMediaIfNotInServer(result, photosExist, MAX_MISSING_PHOTOS_TO_UPLOAD);

                PhotoUploader photoUploader = new PhotoUploader(
                        "http://192.168.0.15:8000",
                        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ODg0OGM0ZDE0ODUxMTIxMzMwZWMzZSIsImlhdCI6MTcxNTg4MzY5MCwiZXhwIjoxNzE4NDc1NjkwfQ.9octfxmAhZMgxTDp0xcT0oDuOf0BWzdCEADpy1X-zNI",
                        "7a83660e-9509-4e94-9dc8-7c5ef3dbef83");

                for (PhotoData photoData: missingPhotos) {
                    try {
                        photoUploader.uploadPhoto(photoData);
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                }
            }
        };

        WritableArray include = Arguments.createArray();
        include.pushString("fileSize");
        include.pushString("filename");
        include.pushString("imageSize");


        new GetMediaTask(
                getReactApplicationContext(),
                100,
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