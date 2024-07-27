import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Text } from 'react-native-elements';

import { useAuthContext } from '~/Context/Contexts/AuthContext';
import { useLocalAccountContext } from '~/Context/Contexts/LocalAccountContext';
import { useMainContext } from '~/Context/Contexts/MainContext';
import { useTheme } from '~/Context/Contexts/ThemeContext';
import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';
import { borderRadius, spacing } from '~/Styles/spacing';
import { typography } from '~/Styles/typography';

export default function ProfileHeader() {
  const { isUsingLocalAccount } = useMainContext();
  const { username } = useLocalAccountContext();
  const { user } = useAuthContext();

  const { colors } = useTheme();
  const styles = useStyles(makeStyles);

  let name: string, email: string;

  if (isUsingLocalAccount && username) {
    name = username;
    email = '';
  } else if (!isUsingLocalAccount && user) {
    name = user.name;
    email = user.email;
  } else {
    return <View />;
  }

  const uri = `https://ui-avatars.com/api/?name=${name}&format=png&background=${colors.SECONDARY.slice(1, -1)}&color=fff&length=1`;

  return (
    <View style={styles.container}>
      <Image source={{ uri: uri }} style={styles.avatarStyle} />
      <Details name={name} email={email} />
    </View>
  );
}

function Details({ name, email }: { name: string; email: string }) {
  const styles = useStyles(makeStyles);

  return (
    <View>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.email}>{email}</Text>
    </View>
  );
}

const AVATAR_SIZE = 60;

const makeStyles = (colors: colorsType) =>
  StyleSheet.create({
    name: {
      ...typography(colors).largeTextBold,
    },
    email: {
      ...typography(colors).lightMediumText,
    },
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.spacing_l,
    },
    avatarStyle: {
      height: AVATAR_SIZE,
      width: AVATAR_SIZE,
      borderRadius: borderRadius.button,
    },
  });
