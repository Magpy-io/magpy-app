import React, { useCallback, useState } from 'react';
import { Keyboard, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { isIP, isPort } from 'validator';

import { PrimaryButton } from '~/Components/CommonComponents/Buttons';
import KeyboardDismissingView from '~/Components/CommonComponents/KeyboardDismissingView';
import TextInputComponent from '~/Components/CommonComponents/TextInputComponent';
import { useAuthContext } from '~/Context/Contexts/AuthContext';
import { useMainContext } from '~/Context/Contexts/MainContext';
import { useServerClaimFunctions } from '~/Context/Contexts/ServerClaimContext';
import { useServerContextFunctions } from '~/Context/Contexts/ServerContext';
import { useTheme } from '~/Context/Contexts/ThemeContext';
import { GetToken, IsClaimed, TokenManager } from '~/Helpers/ServerQueries';
import { ErrorServerUnreachable } from '~/Helpers/ServerQueries/ExceptionsManager';
import { formatAddressHttp } from '~/Helpers/Utilities';
import { useStyles } from '~/Hooks/useStyles';
import { useToast } from '~/Hooks/useToast';
import { colorsType } from '~/Styles/colors';
import { borderRadius, spacing } from '~/Styles/spacing';
import { typography } from '~/Styles/typography';

import { useMainStackNavigation } from '../Navigators/MainStackNavigator';

export default function ServerManualAddressScreen() {
  const { colors } = useTheme();
  const { navigate } = useMainStackNavigation();

  const [ipTextInput, setIpTextInput] = useState('');
  const [ipTextInputError, setIpTextInputError] = useState('');
  const [portTextInput, setportTextInput] = useState('');
  const [portTextInputError, setportTextInputError] = useState('');

  const insets = useSafeAreaInsets();
  const styles = useStyles(makeStyles);

  const { tryClaimServer } = useServerClaimFunctions();
  const { token } = useAuthContext();
  const { setServerSelecting, setReachableServer } = useServerContextFunctions();
  const { showToastError } = useToast();
  const { isUsingLocalAccount } = useMainContext();

  const onSelectServer = useCallback(
    async (server: { ip: string; port: string }) => {
      if (isUsingLocalAccount) {
        try {
          const ret = await IsClaimed.Post(
            {},
            { path: formatAddressHttp(server.ip, server.port) },
          );

          if (ret.ok) {
            if (ret.data.claimed == 'Remotely') {
              showToastError('Server already claimed by another user.');
              return;
            }

            setServerSelecting(server.ip, server.port);

            if (ret.data.claimed == 'None') {
              navigate('ServerClaim');
            } else {
              navigate('ServerLogin');
            }
          }
        } catch (err) {
          console.log(err);
          if (err instanceof ErrorServerUnreachable) {
            showToastError('Server unreachable');
          } else {
            showToastError('Unexpected error while connecting to this server.');
          }
        }
      } else {
        if (!token) {
          showToastError('You need to be logged in before being able to claim a server.');
          return;
        }

        const serverClaimed = await tryClaimServer(server.ip, server.port);

        if (serverClaimed.claimed) {
          navigate('Tabs');
          return;
        }

        if (
          serverClaimed.error != 'SERVER_ALREADY_CLAIMED' &&
          serverClaimed.error != 'SERVER_UNREACHABLE'
        ) {
          showToastError('Unexpected error while connecting to this server.');
          return;
        }

        if (serverClaimed.error == 'SERVER_UNREACHABLE') {
          showToastError('Server unreachable');
          return;
        }

        const res = await GetToken.Post(
          { userToken: token },
          { path: formatAddressHttp(server.ip, server.port) },
        );

        if (res.ok) {
          const ServerToken = TokenManager.GetUserToken();
          setReachableServer({
            ip: server.ip,
            port: server.port,
            token: ServerToken,
          });
          navigate('Tabs');
        } else {
          showToastError('Server already claimed by another user.');
          return;
        }
      }
    },
    [
      isUsingLocalAccount,
      navigate,
      setReachableServer,
      setServerSelecting,
      showToastError,
      token,
      tryClaimServer,
    ],
  );

  return (
    <KeyboardDismissingView>
      <View
        style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Header />

          <TextInputComponent
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
            error={ipTextInputError}
          />

          <TextInputComponent
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

              onSelectServer({ ip: ipTextInput, port: portTextInput }).catch(console.log);
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
