import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  formatDateTime,
  parseMillisecondsIntoReadableTime,
} from '~/Helpers/DateFunctions/DateFormatting';
import { LOG } from '~/Helpers/Logging/Logger';
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
          true,
        );
    }

    const intervalTimeString = workerInfo
      ? 'Run interval: ' +
        parseMillisecondsIntoReadableTime(workerInfo.repeatIntervalMillis, true)
      : null;

    const stopReason = workerInfo
      ? workerInfo.stopReason == -256
        ? null
        : 'Stop reason: ' + workerInfo.stopReason
      : null;

    const workerStats = await AutoBackupModule.GetWorkerStats();

    const lastError = workerStats.lastFailedRunTime
      ? 'Last Error: ' +
        workerStats.lastFailedRunError +
        ' at ' +
        new Date(workerStats.lastFailedRunTime).toString()
      : null;

    const lastExecutionTime = workerStats.lastSuccessRunTime
      ? 'Last successfull run time: ' + new Date(workerStats.lastSuccessRunTime).toString()
      : 'Last successfull run time: none';

    const timeSinceLastExecution = workerStats.lastSuccessRunTime
      ? 'Time since last successfull run: ' +
        parseMillisecondsIntoReadableTime(
          new Date().getTime() - workerStats.lastSuccessRunTime,
          true,
        )
      : null;

    const lastExecutionTimes =
      'Last successfull run times: \n' +
      (workerStats.lastSuccessRunTimes.length == 0
        ? 'none'
        : workerStats.lastSuccessRunTimes.reduce((prev, current) => {
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
        lastError,
        lastExecutionTime,
        timeSinceLastExecution,
        lastExecutionTimes,
      ].filter(e => e != null),
    );
  };

  useEffect(() => {
    LOG.debug('Started debug interval');

    const handler = setInterval(() => {
      refreshData().catch(LOG.error);
    }, 1000);

    return () => {
      LOG.debug('Stopped debug interval');
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
          refreshData().catch(LOG.error);
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
