import {
    StyleSheet,
    Text,
    FlatList,
    Dimensions,
    View,
    StyleProp,
    ViewStyle,
    PixelRatio,
} from 'react-native';
import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import {PhotoType} from '~/Helpers/types';
import PhotoComponentForGrid from './PhotoComponentForGrid';
import StatusBarGridComponent from './PhotoComponents/StatusBarGridComponent';
import ToolBarGrid from './PhotoComponents/ToolBarGrid';
import * as BarHeights from '~/Helpers/BarHeights';

import {useMainContext} from '~/Components/ContextProvider';

const ITEM_HEIGHT = Dimensions.get('screen').width / 3;

function keyExtractor(item: PhotoType) {
    return `grid_${item.id}`;
}

function getItemLayout(data: any, index: number) {
    return {
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
    };
}

const listHeaderComponent = (props: {displayText: string}) => {
    return (
        <View style={styles.viewHeader}>
            <Text style={styles.textHeader}>{props.displayText}</Text>
        </View>
    );
};

const listFooterComponent = () => {
    return <View style={styles.viewFooter}></View>;
};

type PropsType = {
    photos: Array<PhotoType>;
    style?: StyleProp<ViewStyle>;
    startIndex: number;
    contextLocation: string;
    id: string;
    onSwitchMode: (isPhotoSelected: boolean, index: number) => void;
    headerDisplayTextFunction?: (photosNb: number) => string;
};

function PhotoGrid(props: PropsType) {
    console.log('render grid', props.contextLocation);

    const context = useMainContext();

    const flatlistRef = useRef<FlatList>(null);
    const getPhotoIndexRef = useRef<(photo: PhotoType) => number>();
    const [isSelecting, setIsSelecting] = useState(false);
    const [seletedIds, setSelectedIds] = useState(new Map());

    getPhotoIndexRef.current = (item: PhotoType) => {
        let index = props.photos.findIndex(photo => photo.id == item.id);
        if (index < 0) {
            index = 0;
        }
        return index;
    };

    const headerText = props.headerDisplayTextFunction
        ? props.headerDisplayTextFunction(props.photos.length)
        : `${props.photos.length} photos`;

    const HeaderListComponent = useMemo(() => {
        return listHeaderComponent({
            displayText: headerText,
        });
    }, [headerText]);

    const onRenderItemPress = useCallback(
        (item: PhotoType) => {
            if (isSelecting) {
                setSelectedIds(sIds => {
                    if (sIds.has(item.id)) {
                        const newMap = new Map(sIds);
                        newMap.delete(item.id);
                        return newMap;
                    } else {
                        const newMap = new Map(sIds);
                        newMap.set(item.id, item);
                        return newMap;
                    }
                });
            } else {
                props.onSwitchMode(true, getPhotoIndexRef.current?.(item) || 0);
            }
        },
        [props.onSwitchMode, isSelecting]
    );

    const onRenderItemLongPress = useCallback(
        (item: PhotoType) => {
            if (!isSelecting) {
                setIsSelecting(true);
                const map = new Map();
                map.set(item.id, item);
                setSelectedIds(map);
            }
        },
        [isSelecting]
    );

    const renderItem = useCallback(
        ({item}: {item: PhotoType}) => {
            return (
                <PhotoComponentForGrid
                    key={`grid_${item.id}`}
                    photo={item}
                    isSelecting={isSelecting}
                    isSelected={seletedIds.has(item.id)}
                    onPress={onRenderItemPress}
                    onLongPress={onRenderItemLongPress}
                />
            );
        },
        [onRenderItemPress, onRenderItemLongPress, isSelecting, seletedIds]
    );

    const onBackButton = useCallback(() => setIsSelecting(false), [setIsSelecting]);

    const onSelectAll = useCallback(() => {
        setSelectedIds(ids => {
            const newMap = new Map();

            if (ids.size == props.photos.length) {
                return newMap;
            }

            props.photos.forEach(photo => {
                newMap.set(photo.id, photo);
            });

            return newMap;
        });
    }, [props.photos]);

    let correctStartIndex = Math.floor(props.startIndex / 3);

    if (props.startIndex >= props.photos.length) {
        correctStartIndex = Math.floor((props.photos.length - 1) / 3);
    }

    if (correctStartIndex < 0) {
        correctStartIndex = 0;
    }

    const onRefresh = useCallback(() => {
        if (props.contextLocation == 'local') {
            context.onRefreshLocal();
        } else if (props.contextLocation == 'server') {
            context.onRefreshServer();
        }
    }, [props.contextLocation, context.onRefreshLocal, context.onRefreshServer]);

    // TODO change the numColumns to 1 and create a renderItem containing 3 photos
    // This will fix a bug in flatlist which makes it recreate all items each time one is added or removed from the top (indexes change for the rest)
    // with numColumns set to 1, this problem is fixed and the items are able to rerender as needed
    // This will also fix that when less than 3 photos are in a row, the 2 or 1 photo will stretch to fill all horizontal space.

    return (
        <View style={[styles.mainViewStyle, props.style]}>
            <FlatList
                ref={flatlistRef}
                style={styles.flatListStyle}
                data={props.photos}
                renderItem={renderItem}
                windowSize={3}
                maxToRenderPerBatch={1}
                initialNumToRender={1}
                initialScrollIndex={correctStartIndex}
                keyExtractor={keyExtractor}
                onEndReachedThreshold={1}
                //onEndReached={}
                onRefresh={onRefresh}
                refreshing={false}
                numColumns={3}
                getItemLayout={getItemLayout}
                ListHeaderComponent={HeaderListComponent}
                ListFooterComponent={listFooterComponent}
            />

            {isSelecting && (
                <StatusBarGridComponent
                    selectedNb={seletedIds.size}
                    onCancelButton={onBackButton}
                    onSelectAllButton={onSelectAll}
                />
            )}
            {isSelecting && (
                <ToolBarGrid
                    contextLocation={props.contextLocation}
                    onAddLocal={() => {
                        setIsSelecting(false);
                        context.addPhotosLocal?.(Array.from(seletedIds.values()));
                    }}
                    onAddServer={() => {
                        setIsSelecting(false);
                        context.addPhotosServer?.(Array.from(seletedIds.values()));
                    }}
                    onDeleteLocal={() => {
                        setIsSelecting(false);
                        const photosToDelete = Array.from(seletedIds.values());
                        if (props.contextLocation == 'server') {
                            context.RequestCroppedPhotosServer(photosToDelete);
                        }
                        context.deletePhotosLocal?.(photosToDelete);
                    }}
                    onDeleteServer={() => {
                        setIsSelecting(false);
                        context.deletePhotosServer?.(Array.from(seletedIds.values()));
                    }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    mainViewStyle: {
        height: '100%',
        width: '100%',
    },
    flatListStyle: {
        marginTop: BarHeights.GetStatusBarHeight(),
        marginBottom: BarHeights.GetNavigatorBarHeight(),
    },
    textOnEmpty: {
        fontSize: 15,
        textAlign: 'center',
    },
    viewOnEmpty: {},
    viewHeader: {paddingVertical: 30},
    textHeader: {fontSize: 17, textAlign: 'center'},
    viewFooter: {marginVertical: 35},
});

export default PhotoGrid;
