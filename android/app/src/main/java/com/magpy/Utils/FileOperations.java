package com.magpy.Utils;

import android.content.Context;
import android.net.Uri;
import android.util.Base64;

import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

public class FileOperations {
    public static byte[] getBase64FromUri(Context context, String uri) throws IOException {
        try(InputStream inputStream = context.getContentResolver().openInputStream(Uri.parse(uri))) {
            ByteArrayOutputStream byteBuffer = new ByteArrayOutputStream();

            int bufferSize = 1024;
            byte[] buffer = new byte[bufferSize];

            int len;
            try{
                while ((len = inputStream.read(buffer)) != -1) {
                    byteBuffer.write(buffer, 0, len);
                }
            } catch (IOException e) {
                throw new RuntimeException("Error while reading media file.", e);
            }

            return Base64.encode(byteBuffer.toByteArray(), Base64.NO_WRAP);
        } catch (FileNotFoundException e) {
            throw new RuntimeException("getBase64FromUri: Media file not found.", e);
        } catch (Exception e){
            throw new RuntimeException("getBase64FromUri: Error reading media file.", e);
        }
    }
}
