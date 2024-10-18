import { useEffect, useState } from 'react';

import { AutoBackupModule } from '../AutoBackupModule';

export function useLastAutobackupExecutionTime() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    const handle = setTimeout(() => {
      AutoBackupModule.GetWorkerStats()
        .then(workerStats => {
          if (!workerStats.lastExecutionTime) {
            setTime(null);
          } else {
            setTime(new Date(workerStats.lastExecutionTime));
          }
        })
        .catch(console.log);
    }, 2000);

    return () => {
      clearTimeout(handle);
    };
  }, []);

  return time;
}
