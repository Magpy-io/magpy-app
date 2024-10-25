package com.magpy.Utils;

import android.content.Context;
import android.net.Uri;
import android.util.Base64;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

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

    public static ArrayList<String> readLinesFromFile(String filePath) throws IOException {
        try(FileInputStream fis = new FileInputStream (filePath)){

            BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(fis));

            ArrayList<String> lines = new ArrayList<>();
            String line;
            while ((line = bufferedReader.readLine()) != null) {
                lines.add(line);
            }

            return lines;
        }
    }

    public static void writeToFile(File logFile, String content) throws IOException {
        try(FileWriter fw = new FileWriter(logFile, true))
        {
            fw.append(content);
        }
    }
}
