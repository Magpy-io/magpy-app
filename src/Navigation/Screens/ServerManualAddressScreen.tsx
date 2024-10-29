import React, { useEffect, useState } from 'react';
import { Keyboard, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { isIP, isPort } from 'validator';

import { PrimaryButton } from '~/Components/CommonComponents/Buttons';
import KeyboardDismissingView from '~/Components/CommonComponents/KeyboardDismissingView';
import TextInputComponent from '~/Components/CommonComponents/TextInputComponent';
import { defaultServerPort } from '~/Config/config';
import { useTheme } from '~/Context/Contexts/ThemeContext';
import { LOG } from '~/Helpers/Logging/Logger';
import { useServerSelectionFunction } from '~/Hooks/useServerSelectionFunction';
import { useStatePersistent } from '~/Hooks/useStatePersistent';
import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';
import { borderRadius, spacing } from '~/Styles/spacing';
import { typography } from '~/Styles/typography';

import { useMainStackNavigation } from '../Navigators/MainStackNavigator';

export default function ServerManualAddressScreen() {
  const { colors } = useTheme();
  const { navigate } = useMainStackNavigation();

  const [cachedIpInput, cachedIpLoaded, setCachedIpInput] = useStatePersistent(
    '',
    'CACHED_IP_INPUT',
  );
  const [cachedPortInput, cachedPortLoaded, setCachedPortInput] = useStatePersistent(
    defaultServerPort,
    'CACHED_PORT_INPUT',
  );

  const [ipTextInput, setIpTextInput] = useState('');
  const [ipTextInputError, setIpTextInputError] = useState('');
  const [portTextInput, setportTextInput] = useState('');
  const [portTextInputError, setportTextInputError] = useState('');

  const insets = useSafeAreaInsets();
  const styles = useStyles(makeStyles);

  const { SelectServer } = useServerSelectionFunction();

  useEffect(() => {
    if (cachedIpLoaded && cachedPortLoaded) {
      setIpTextInput(cachedIpInput);
      setportTextInput(cachedPortInput);
    }
  }, [cachedIpInput, cachedIpLoaded, cachedPortInput, cachedPortLoaded]);

  return (
    <KeyboardDismissingView>
      <View
        style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Header />

          <TextInputComponent
            value={ipTextInput}
            placeholder="IP Address"
            textAlign="center"
            keyboardType="numeric"
            style={{ width: 150, marginBottom: spacing.spacing_s }}
            onChangeText={text => {
              setIpTextInputError('');
              setIpTextInput(text);
            }}
            onFocus={() => {
              setIpTextInputError('');
            }}
            onEndEditing={() => {
              setCachedIpInput(ipTextInput);
            }}
            error={ipTextInputError}
          />

          <TextInputComponent
            value={portTextInput}
            placeholder="Port"
            textAlign="center"
            keyboardType="numeric"
            style={{ width: 100, marginBottom: spacing.spacing_s }}
            onChangeText={text => {
              setportTextInput(text);
              setportTextInputError('');
            }}
            onFocus={() => {
              setportTextInputError('');
            }}
            onEndEditing={() => {
              setCachedPortInput(portTextInput);
            }}
            error={portTextInputError}
          />

          <PrimaryButton
            title="Connect to server"
            onPress={() => {
              if (!isIP(ipTextInput)) {
                setIpTextInputError('Invalid IP Address');
                return;
              }

              if (!isPort(portTextInput)) {
                setportTextInputError('Invalid Port Number');
                return;
              }
              Keyboard.dismiss();

              SelectServer({ ip: ipTextInput, port: portTextInput }).catch(LOG.error);
            }}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              navigate('ServerSelect');
            }}
            style={{ paddingVertical: spacing.spacing_s }}>
            <Text style={{ color: colors.TEXT, fontWeight: 'bold' }}>
              Search local network
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: spacing.spacing_xxl_2,
          }}>
          <TouchableOpacity
            onPress={() => {
              navigate('Tabs');
            }}
            style={{ paddingVertical: spacing.spacing_s }}>
            <Text style={{ color: colors.TEXT, fontWeight: 'bold' }}>
              Continue Without Server
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardDismissingView>
  );
}

function Header() {
  const title = "Enter your server's address";
  const styles = useStyles(makeStyles);

  return (
    <View style={styles.headerView}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const makeStyles = (colors: colorsType) =>
  StyleSheet.create({
    headerView: {
      paddingBottom: spacing.spacing_xxl,
      paddingTop: spacing.spacing_xxl_5,
    },
    title: {
      paddingHorizontal: spacing.spacing_xxl,
      textAlign: 'center',
      ...typography(colors).screenTitle,
    },
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: colors.BACKGROUND,
    },
    textInputStyle: {
      flex: 1,
    },
    viewStyle: {
      flexDirection: 'row',
      paddingLeft: spacing.spacing_xxl_2,
      borderColor: colors.FORM_BORDER,
      borderWidth: 0.5,
      borderRadius: borderRadius.input,
      height: spacing.spacing_xxl_3,
    },
  });
