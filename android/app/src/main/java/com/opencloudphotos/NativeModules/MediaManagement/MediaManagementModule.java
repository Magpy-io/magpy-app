package com.opencloudphotos.NativeModules.MediaManagement;

import android.content.ContentResolver;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.opencloudphotos.Utils.DeleteMedia;

import java.io.File;

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

    @RequiresApi(api = Build.VERSION_CODES.R)
    @ReactMethod
    public void deleteMedia(ReadableArray ids, Promise mPromise) {
        DeleteMedia.deletePhotos(ids, getReactApplicationContext(), mPromise);
    }
}