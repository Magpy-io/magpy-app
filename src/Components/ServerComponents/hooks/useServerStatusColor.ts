import { useMemo } from 'react';

import { useServerContext } from '~/Context/Contexts/ServerContext';
import { useServerInvalidationContext } from '~/Context/Contexts/ServerInvalidationContext';
import { useTheme } from '~/Context/Contexts/ThemeContext';

import { useUserHasServer } from './useUserHasServer';

export function useServerStatusColor() {
  const { colors } = useTheme();

  const { isServerReachable, findingServer } = useServerContext();

  const hasServer = useUserHasServer();

  const { isRefreshing } = useServerInvalidationContext();

  return useMemo(() => {
    if (!hasServer) {
      return 'black';
    }

    if (findingServer) {
      return colors.PENDING;
    }

    if (isRefreshing) {
      return colors.PENDING;
    }

    if (isServerReachable) {
      return colors.SUCCESS;
    } else {
      return colors.WARNING;
    }
  }, [colors, findingServer, hasServer, isServerReachable, isRefreshing]);
}
