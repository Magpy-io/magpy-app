package com.opencloudphotos.Utils;

import android.os.Build;

import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.ReadableMap;
import com.opencloudphotos.GlobalManagers.ServerQueriesManager.Common.PhotoData;

import java.time.Instant;

public class MediaParser {
    @RequiresApi(api = Build.VERSION_CODES.O)
    public static PhotoData parsePhotoData(ReadableMap node){
        if(node == null){
            throw new RuntimeException("node found null.");
        }

        ReadableMap image = node.getMap("image");
        if(image == null){
            throw new RuntimeException("image found null.");
        }

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
        return photoData;
    }
}
