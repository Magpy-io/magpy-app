import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Text } from 'react-native-elements';

import { useAuthContext } from '~/Context/UseContexts/useAuthContext';
import { appColors } from '~/styles/colors';
import { borderRadius, spacing } from '~/styles/spacing';
import { typography } from '~/styles/typography';

export default function ProfileHeader() {
  const { user } = useAuthContext();

  if (!user) {
    return <View />;
  }

  const name = user.name;
  const uri = `https://ui-avatars.com/api/?name=${name}&format=png&background=${appColors.SECONDARY.slice(1, -1)}&color=fff&length=1`;

  return (
    <View style={styles.container}>
      <Image source={{ uri: uri }} style={styles.avatarStyle} />
      <Details name={name} email={user.email} />
    </View>
  );
}

function Details({ name, email }: { name: string; email: string }) {
  return (
    <View>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.email}>{email}</Text>
    </View>
  );
}

const AVATAR_SIZE = 60;

const styles = StyleSheet.create({
  name: {
    ...typography.largeTextBold,
  },
  email: {
    ...typography.lightMediumText,
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
