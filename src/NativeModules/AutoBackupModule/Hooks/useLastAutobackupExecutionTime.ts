import { useEffect, useState } from 'react';

import { AutoBackupModule } from '../AutoBackupModule';

export function useLastAutobackupExecutionTime() {
  const [time, setTime] = useState<Date | null>(null);

  function UpdateTime() {
    AutoBackupModule.GetWorkerStats()
      .then(workerStats => {
        if (!workerStats.lastExecutionTime) {
          setTime(null);
        } else {
          setTime(new Date(workerStats.lastExecutionTime));
        }
      })
      .catch(console.log);
  }

  useEffect(() => {
    UpdateTime();
    const handle = setInterval(UpdateTime, 5000);

    return () => {
      clearTimeout(handle);
    };
  }, []);

  return time;
}