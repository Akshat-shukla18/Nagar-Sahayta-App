import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import i18n from './i18n';

export default function SolvedProblems() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007bff" />
      <Text style={styles.noReportsText}>{i18n.t('solvedProblems.noReports')}</Text>
      <Text style={styles.bottomText}>{i18n.t('solvedProblems.notification')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noReportsText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  bottomText: {
    position: 'absolute',
    bottom: 20,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    left: 20,
    right: 20,
  },
});
