import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  formatDateTime,
  parseMillisecondsIntoReadableTime,
} from '~/Helpers/DateFunctions/DateFormatting';
import { useStyles } from '~/Hooks/useStyles';
import { AutoBackupModule } from '~/NativeModules/AutoBackupModule';
import { colorsType } from '~/Styles/colors';
import { spacing } from '~/Styles/spacing';
import { typography } from '~/Styles/typography';

export default function DebugScreen() {
  const insets = useSafeAreaInsets();
  const styles = useStyles(makeStyles);

  const [data, setData] = useState<string[]>([]);

  const refreshData = async () => {
    const workerInfo = await AutoBackupModule.GetWorkerInfo();

    const workerStateString = workerInfo
      ? 'State: ' + workerInfo.state
      : 'Worker not scheduled';

    let workerNextScheduledRunString;
    let workerNextRunTimerString;
    if (!workerInfo) {
      workerNextScheduledRunString = null;
      workerNextRunTimerString = null;
    } else if (workerInfo.nextScheduleMillis == -1) {
      workerNextScheduledRunString = null;
      workerNextRunTimerString = null;
    } else {
      workerNextScheduledRunString =
        'Next run date: ' + formatDateTime(new Date(workerInfo.nextScheduleMillis).toJSON());

      workerNextRunTimerString =
        'Next run in : ' +
        parseMillisecondsIntoReadableTime(
          workerInfo.nextScheduleMillis - new Date().getTime(),
        );
    }

    const intervalTimeString = workerInfo
      ? 'Run interval: ' + parseMillisecondsIntoReadableTime(workerInfo.repeatIntervalMillis)
      : null;

    const stopReason = workerInfo
      ? workerInfo.stopReason == -256
        ? null
        : 'Stop reason: ' + workerInfo.stopReason
      : null;

    const workerStats = await AutoBackupModule.GetWorkerStats();

    const lastExecutionTime = workerStats.lastExecutionTime
      ? 'Last execution time: ' + new Date(workerStats.lastExecutionTime).toString()
      : 'Last execution time: none';

    const timeSinceLastExecution = workerStats.lastExecutionTime
      ? 'Time since last execution: ' +
        parseMillisecondsIntoReadableTime(new Date().getTime() - workerStats.lastExecutionTime)
      : null;

    const lastExecutionTimes =
      'Last execution times: \n' +
      (workerStats.lastExecutionTimes.length == 0
        ? 'none'
        : workerStats.lastExecutionTimes.reduce((prev, current) => {
            return prev + new Date(current).toString() + '\n';
          }, ''));

    setData(
      [
        'Autobackup Worker Info',
        workerStateString,
        workerNextScheduledRunString,
        workerNextRunTimerString,
        intervalTimeString,
        stopReason,
        lastExecutionTime,
        timeSinceLastExecution,
        lastExecutionTimes,
      ].filter(e => e != null),
    );
  };

  useEffect(() => {
    console.log('Started debug interval');

    const handler = setInterval(() => {
      refreshData().catch(console.log);
    }, 1000);

    return () => {
      console.log('Stopped debug interval');
      clearInterval(handler);
    };
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <FlatList
        data={data}
        renderItem={({ item }) => {
          return <Text style={styles.text}>{item}</Text>;
        }}
        refreshing={false}
        onRefresh={() => {
          refreshData().catch(console.log);
        }}></FlatList>
    </View>
  );
}

const makeStyles = (colors: colorsType) =>
  StyleSheet.create({
    text: {
      ...typography(colors).largeText,
      paddingTop: spacing.spacing_s,
    },
    container: {
      flex: 1,
      backgroundColor: colors.BACKGROUND,
      padding: 10,
    },
  });
