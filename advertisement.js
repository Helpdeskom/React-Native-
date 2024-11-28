import {
  Text,
  View,
  StyleSheet,
  Platform,
  Button,
  SafeAreaView,
} from 'react-native';
import {
  AdEventType,
  BannerAd,
  BannerAdSize,
  InterstitialAd,
  RewardedAd,
  RewardedAdEventType,
  TestIds,
  GAMBannerAd,
  useForeground,
} from 'react-native-google-mobile-ads';
import {useEffect, useRef, useState} from 'react';

// Create an Interstitial Ad instance using a test ID
const interstitial = InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL, {
  keywords: ['fashion', 'clothing'],
});

// Create a Rewarded Ad instance using a test ID
const rewarded = RewardedAd.createForAdRequest(TestIds.REWARDED, {
  keywords: ['fashion', 'clothing'],
});

export const App = () => {
  const [loaded, setLoaded] = useState(false);

  // useEffect(() => {
  //   // Add an event listener to handle the ad loading event
  //   const unsubscribe = interstitial.addAdEventListener(
  //     AdEventType.LOADED,
  //     () => {
  //       setLoaded(true);
  //     },
  //   );
  //
  //   // Start loading the interstitial straight away
  //   interstitial.load();
  //
  //   // Unsubscribe from events on unmount
  //   return unsubscribe;
  // }, []);
  //
  // // No advert ready to show yet
  // if (!loaded) {
  //   return null;
  // }

  useEffect(() => {
    // Add event listeners for loading and earning rewards on the rewarded ad
    const unsubscribeLoaded = rewarded.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        setLoaded(true);
      },
    );
    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      reward => {
        console.log('User earned reward of ', reward);
      },
    );

    // Start loading the rewarded ad straight away
    rewarded.load();

    // Unsubscribe from events on unmount
    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, []);

  // No advert ready to show yet
  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaView>
      {/* Example of a Banner Ad */}
      {/*<BannerAd*/}
      {/*    unitId={TestIds.BANNER}*/}
      {/*    size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}*/}
      {/*/>*/}
      {/* Button to show the interstitial ad */}
      {/*<Button*/}
      {/*  title="Show Interstitial"*/}
      {/*  onPress={() => {*/}
      {/*    interstitial.show();*/}
      {/*  }}*/}
      {/*/>*/}
      {/* Button to show the rewarded ad */}
      {/*<Button*/}
      {/*    title="Show Rewarded Ad"*/}
      {/*    onPress={() => {*/}
      {/*        rewarded.show();*/}
      {/*    }}*/}
      {/*/>*/}
      <GAMBannerAd
        unitId={TestIds.GAM_BANNER}
        sizes={[BannerAdSize.FULL_BANNER]}
      />
    </SafeAreaView>
  );
};

export default App;
