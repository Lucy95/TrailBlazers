import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import * as Speech from 'expo-speech';


export default function App() {

  
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    Speech.speak("Hi There, Welcome to the Hackathon App. The App has two modes, indoor and outdoor. The indoor mode will allow you to move your camera around and will speak up the things the app can identify. The outdoor mode will allow you the app to capture the images from the camera and speak out what's written on the images captured.",{rate:0.8});
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}
