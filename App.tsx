import React from 'react';
import { AuthProvider } from './src/hooks/auth'

import { Home } from './src/screens/home';

import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import AppLoadings from 'expo-app-loading';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold
  });

  if (!fontsLoaded) {
    return <AppLoadings />
  }

  return (
    <AuthProvider>
      <StatusBar style='light' translucent backgroundColor='transparent' />
      <Home /> 
    </AuthProvider>
  );
}