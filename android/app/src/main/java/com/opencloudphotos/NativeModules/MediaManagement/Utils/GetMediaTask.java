package com.opencloudphotos.NativeModules.MediaManagement.Utils;

import android.content.ContentResolver;
import android.content.Context;
import android.content.res.AssetFileDescriptor;
import android.database.Cursor;
import android.graphics.BitmapFactory;
import android.media.ExifInterface;
import android.media.MediaMetadataRetriever;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.MediaStore;
import android.text.TextUtils;

import com.facebook.common.logging.FLog;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.GuardedAsyncTask;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.common.ReactConstants;
import com.reactnativecommunity.cameraroll.Utils;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.annotation.Nullable;

public class GetMediaTask{
    private final Context mContext;
    private final int mFirst;
    private final @Nullable
    String mAfter;
    private final @Nullable
    String mGroupName;
    private final @Nullable
    ReadableArray mMimeTypes;
    private final ResultCallback mPromise;
    private final String mAssetType;
    private final long mFromTime;
    private final long mToTime;
    private final Set<String> mInclude;
    private final String mMediaId;

    public interface ResultCallback{
        public void reject(String s, String s1);

        public void resolve(WritableMap result);
    }

    public GetMediaTask(
            Context context,
            String mediaId,
            int first,
            @Nullable String after,
            @Nullable String groupName,
            @Nullable ReadableArray mimeTypes,
            String assetType,
            long fromTime,
            long toTime,
            @Nullable ReadableArray include,
            ResultCallback promise) {
        mContext = context;
        mMediaId = mediaId;
        mFirst = first;
        mAfter = after;
        mGroupName = groupName;
        mMimeTypes = mimeTypes;
        mPromise = promise;
        mAssetType = assetType;
        mFromTime = fromTime;
        mToTime = toTime;
        mInclude = createSetFromIncludeArray(include);
    }

    private static Set<String> createSetFromIncludeArray(@Nullable ReadableArray includeArray) {
        Set<String> includeSet = new HashSet<>();

        if (includeArray == null) {
            return includeSet;
        }

        for (int i = 0; i < includeArray.size(); i++) {
            @Nullable String includeItem = includeArray.getString(i);
            if (includeItem != null) {
                includeSet.add(includeItem);
            }
        }

        return includeSet;
    }

    public void execute() {
        StringBuilder selection = new StringBuilder("1");
        List<String> selectionArgs = new ArrayList<>();
        if (!TextUtils.isEmpty(mGroupName)) {
            selection.append(" AND " + Definitions.SELECTION_BUCKET);
            selectionArgs.add(mGroupName);
        }

        if (mAssetType.equals(Definitions.ASSET_TYPE_PHOTOS)) {
            selection.append(" AND " + MediaStore.Files.FileColumns.MEDIA_TYPE + " = "
                    + MediaStore.Files.FileColumns.MEDIA_TYPE_IMAGE);
        } else if (mAssetType.equals(Definitions.ASSET_TYPE_VIDEOS)) {
            selection.append(" AND " + MediaStore.Files.FileColumns.MEDIA_TYPE + " = "
                    + MediaStore.Files.FileColumns.MEDIA_TYPE_VIDEO);
        } else if (mAssetType.equals(Definitions.ASSET_TYPE_ALL)) {
            selection.append(" AND " + MediaStore.Files.FileColumns.MEDIA_TYPE + " IN ("
                    + MediaStore.Files.FileColumns.MEDIA_TYPE_VIDEO + ","
                    + MediaStore.Files.FileColumns.MEDIA_TYPE_IMAGE + ")");
        } else {
            mPromise.reject(
                    Definitions.ERROR_UNABLE_TO_FILTER,
                    "Invalid filter option: '" + mAssetType + "'. Expected one of '"
                            + Definitions.ASSET_TYPE_PHOTOS + "', '" + Definitions.ASSET_TYPE_VIDEOS + "' or '" + Definitions.ASSET_TYPE_ALL + "'."
            );
            return;
        }


        if (mMimeTypes != null && mMimeTypes.size() > 0) {
            selection.append(" AND " + MediaStore.Images.Media.MIME_TYPE + " IN (");
            for (int i = 0; i < mMimeTypes.size(); i++) {
                selection.append("?,");
                selectionArgs.add(mMimeTypes.getString(i));
            }
            selection.replace(selection.length() - 1, selection.length(), ")");
        }

        if (mFromTime > 0) {
            long addedDate = mFromTime / 1000;
            selection.append(" AND (" + MediaStore.Images.Media.DATE_TAKEN + " > ? OR ( " + MediaStore.Images.Media.DATE_TAKEN
                    + " IS NULL AND " + MediaStore.Images.Media.DATE_ADDED + "> ? ))");
            selectionArgs.add(mFromTime + "");
            selectionArgs.add(addedDate + "");
        }
        if (mToTime > 0) {
            long addedDate = mToTime / 1000;
            selection.append(" AND (" + MediaStore.Images.Media.DATE_TAKEN + " <= ? OR ( " + MediaStore.Images.Media.DATE_TAKEN
                    + " IS NULL AND " + MediaStore.Images.Media.DATE_ADDED + " <= ? ))");
            selectionArgs.add(mToTime + "");
            selectionArgs.add(addedDate + "");
        }

        WritableMap response = new WritableNativeMap();
        ContentResolver resolver = mContext.getContentResolver();

        try {
            Cursor media;

            if(mMediaId != null){
                Uri external_images_uri = MediaStore.Files.getContentUri("external");
                Uri imageUri = Uri.withAppendedPath(external_images_uri, mMediaId);
                media = resolver.query(
                        imageUri,
                        Definitions.PROJECTION,
                        null,
                        null,
                        null);
            }
            else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                Bundle bundle = new Bundle();
                bundle.putString(ContentResolver.QUERY_ARG_SQL_SELECTION, selection.toString());
                bundle.putStringArray(ContentResolver.QUERY_ARG_SQL_SELECTION_ARGS,
                        selectionArgs.toArray(new String[selectionArgs.size()]));
                bundle.putString(ContentResolver.QUERY_ARG_SQL_SORT_ORDER, MediaStore.Images.Media.DATE_ADDED + " DESC, " + MediaStore.Images.Media.DATE_MODIFIED + " DESC");
                bundle.putInt(ContentResolver.QUERY_ARG_LIMIT, mFirst + 1);
                if (!TextUtils.isEmpty(mAfter)) {
                    bundle.putInt(ContentResolver.QUERY_ARG_OFFSET, Integer.parseInt(mAfter));
                }
                media = resolver.query(
                        MediaStore.Files.getContentUri("external"),
                        Definitions.PROJECTION,
                        bundle,
                        null);
            } else {
                // set LIMIT to first + 1 so that we know how to populate page_info
                String limit = "limit=" + (mFirst + 1);
                if (!TextUtils.isEmpty(mAfter)) {
                    limit = "limit=" + mAfter + "," + (mFirst + 1);
                }
                media = resolver.query(
                        MediaStore.Files.getContentUri("external").buildUpon().encodedQuery(limit).build(),
                        Definitions.PROJECTION,
                        selection.toString(),
                        selectionArgs.toArray(new String[selectionArgs.size()]),
                        MediaStore.Images.Media.DATE_ADDED + " DESC, " + MediaStore.Images.Media.DATE_MODIFIED + " DESC");
            }

            if (media == null) {
                mPromise.reject(Definitions.ERROR_UNABLE_TO_LOAD, "Could not get media");
            } else {
                try {
                    putEdges(resolver, media, response, mFirst, mInclude);
                    putPageInfo(media, response, mFirst, !TextUtils.isEmpty(mAfter) ? Integer.parseInt(mAfter) : 0);
                } finally {
                    media.close();
                    mPromise.resolve(response);
                }
            }
        } catch (SecurityException e) {
            mPromise.reject(
                    Definitions.ERROR_UNABLE_TO_LOAD_PERMISSION,
                    "Could not get media: need READ_EXTERNAL_STORAGE permission, " + e.toString());
        }
    }

    private static void putPageInfo(Cursor media, WritableMap response, int limit, int offset) {
        WritableMap pageInfo = new WritableNativeMap();
        pageInfo.putBoolean("has_next_page", limit < media.getCount());
        if (limit < media.getCount()) {
            pageInfo.putString(
                    "end_cursor",
                    Integer.toString(offset + limit)
            );
        }
        response.putMap("page_info", pageInfo);
    }

    private static void putEdges(
            ContentResolver resolver,
            Cursor media,
            WritableMap response,
            int limit,
            Set<String> include) {
        WritableArray edges = new WritableNativeArray();
        media.moveToFirst();

        for (int i = 0; i < limit && !media.isAfterLast(); i++) {
            WritableMap map = MediaOperations.convertMediaToMap(resolver, media, include);
            if (map != null) {
                edges.pushMap(map);
            } else {
                // we skipped an image because we couldn't get its details (e.g. width/height), so we
                // decrement i in order to correctly reach the limit, if the cursor has enough rows
                i--;
            }
            media.moveToNext();
        }
        response.putArray("edges", edges);
    }
}