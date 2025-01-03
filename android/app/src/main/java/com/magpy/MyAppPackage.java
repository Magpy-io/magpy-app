package com.magpy;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.magpy.NativeModules.AutoBackup.AutoBackupModule;
import com.magpy.NativeModules.FullScreen.FullScreenModule;
import com.magpy.NativeModules.PhotoExifDataModule;
import com.magpy.NativeModules.MediaManagement.MediaManagementModule;
import com.magpy.NativeModules.UploadMedia.UploadMediaModule;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class MyAppPackage implements ReactPackage{
    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }

    @Override
    public List<NativeModule> createNativeModules(
            ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();

        modules.add(new MediaManagementModule(reactContext));
        modules.add(new PhotoExifDataModule(reactContext));
        modules.add(new FullScreenModule(reactContext));
        modules.add(new AutoBackupModule(reactContext));
        modules.add(new UploadMediaModule(reactContext));

        return modules;
    }
}