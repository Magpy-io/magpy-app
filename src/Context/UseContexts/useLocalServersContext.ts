import { zeroconf } from '~/Context/ContextSlices/LocalServersContext';
import { useMainContext } from '~/Context/MainContextProvider';

export function useLocalServersFunctions() {
  const { localServersData } = useMainContext();
  const { isScanning, setLocalServers } = localServersData;

  const refreshData = () => {
    if (isScanning) {
      zeroconf.stop();
    }
    setLocalServers([]);
    zeroconf.scan('http', 'tcp', 'local.');
    setTimeout(() => {
      zeroconf.stop();
    }, 5000);
  };

  const stopSearch = () => {
    zeroconf.stop();
  };

  return {
    refreshData,
    stopSearch,
  };
}

export function useLocalServersContext() {
  const { localServersData } = useMainContext();

  return localServersData;
}
