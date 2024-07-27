import { useMemo } from 'react';

import { useServerContext } from '~/Context/Contexts/ServerContext';
import { useTheme } from '~/Context/Contexts/ThemeContext';

import { useUserHasServer } from './useUserHasServer';

export function useServerStatusColor() {
  const { colors } = useTheme();

  const { isServerReachable, findingServer } = useServerContext();

  const hasServer = useUserHasServer();

  return useMemo(
    () =>
      !hasServer
        ? 'black'
        : findingServer
          ? colors.PENDING
          : isServerReachable
            ? colors.SUCCESS
            : colors.WARNING,
    [colors, findingServer, hasServer, isServerReachable],
  );
}
