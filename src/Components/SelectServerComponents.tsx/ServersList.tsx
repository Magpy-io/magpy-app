import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import ServerComponent from '~/Components/SelectServerComponents.tsx/ServerComponent';
import { Server } from '~/Hooks/useLocalServers';
import { spacing } from '~/styles/spacing';

type ServersListProps = {
  servers: Server[];
  refreshData: () => void;
  header: React.JSX.Element;
  onSelectServer: (server: Server) => void;
};

export default function ServersList({
  servers,
  refreshData,
  header,
  onSelectServer,
}: ServersListProps) {
  const renderRow = ({ item }: { item: Server; index: number }) => {
    return (
      <ServerComponent
        ip={item.ip}
        name={item.name}
        port={item.port}
        onSelectServer={() => onSelectServer(item)}
      />
    );
  };

  return (
    <FlatList
      data={servers}
      renderItem={renderRow}
      keyExtractor={(key, index) => key.ip + index.toString()}
      onRefresh={refreshData}
      refreshing={false}
      ListHeaderComponent={header}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
}
const styles = StyleSheet.create({
  separator: {
    height: spacing.spacing_l,
  },
});
