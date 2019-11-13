import { useState, useEffect } from 'react';

import { Plugins } from '@capacitor/core';

export function useAccessibility() {
  const { Accessibility } = Plugins;

  const [ isScreenReaderEnabled, setScreenReaderEnabled ] = useState(false);

  useEffect(() => {
    async function checkScreenReader() {
      const isEnabled = await Accessibility.isScreenReaderEnabled();
      setScreenReaderEnabled(isEnabled.value);
    }
    checkScreenReader();
  }, [ Accessibility, setScreenReaderEnabled ]);

  useEffect(() => {
    const listener = Accessibility.addListener('accessibilityScreenReaderStateChange', async () => {
      const isEnabled = await Accessibility.isScreenReaderEnabled();
      console.log('Got enabled', isEnabled);
      setScreenReaderEnabled(isEnabled.value);
    });

    return () => listener.remove();
  }, [ Accessibility, setScreenReaderEnabled ]);

  return isScreenReaderEnabled;
}