package com.opencloudphotos;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.opencloudphotos.NativeModules.FullScreenModule;
import com.opencloudphotos.NativeModules.PhotoExifDataModule;
import com.opencloudphotos.NativeModules.SendingMediaServiceModule;
import com.opencloudphotos.NativeModules.MediaManagement.MediaManagementModule;

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

        modules.add(new SendingMediaServiceModule(reactContext));
        modules.add(new MediaManagementModule(reactContext));
        modules.add(new PhotoExifDataModule(reactContext));
        modules.add(new FullScreenModule(reactContext));

        return modules;
    }
}