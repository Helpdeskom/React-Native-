import {
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  Touchable,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import STYLE from '../Styles';
import {PERMISSIONS, request} from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import MapView, {Marker, Polyline} from 'react-native-maps';
import {getDistance} from 'geolib';

const Location = () => {
  const [permissionGranted, setPermissionGranted] = useState<Boolean>();
  const [location, setLocation] = useState<string>('');
  const [toLocation, setToLocation] = useState({
    long: '',
    lat: '',
  });

  const fetchCurrentLocation = async () => {
    if (permissionGranted) {
      Geolocation.getCurrentPosition(
        position => {
          console.log('Current Location : ', position);
          const {latitude, longitude} = position.coords;
          setLocation({latitude, longitude});
        },
        error => {
          // See error code charts below.
          console.log(error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    }
  };

  const requestLocationPermission = async () => {
    if (Platform.OS == 'android') {
      try {
        const granted = await PERMISSIONS.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message:
              'needs access to your location ' + 'to fetch current address',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location Granted');
          setPermissionGranted(true);
          // fetchCurrentLocation();
        } else {
          console.log('Locations permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    } else if (Platform.OS == 'ios') {
      const req = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      if (req === 'granted') {
        setPermissionGranted(true);
        fetchCurrentLocation();
      }
    }
  };

  useEffect(() => {
    requestLocationPermission();
    console.log('checking permissions .. ');
    // fetchCurrentLocation();
  }, [permissionGranted]);

  const findDistance = () => {
    const dist = getDistance(
      {latitude: location?.latitude, longitude: location?.longitude}, // Coordinate 1
      {latitude: toLocation?.lat, longitude: toLocation?.long}, // Coordinate 2
    );
    console.log('Distance bw coords is  : ', dist);
  };
  return (
    <View style={STYLE.container}>
      <Text style={{position: 'absolute', top: 40}}>
        React Native Geolocation
      </Text>
      <View>
        <View>
          <Text style={styles.bold}>Current Location</Text>
          <Text>Longitude : {location?.longitude}</Text>
          <Text>Lattitude : {location?.latitude}</Text>
        </View>
        {/* <TouchableOpacity style={styles.btn} onPress={fetchCurrentLocation}>
          <Text>Get Current Location</Text>
        </TouchableOpacity> */}
        <View style={{marginTop: 9}}>
          <Text style={styles.bold}>TO</Text>
          <View style={styles.flexrow}>
            <TextInput
              placeholder="Longitude.."
              onChangeText={e => setToLocation({...toLocation, long: e})}
              style={{
                padding: 10,
                borderColor: 'green',
                borderWidth: 0.6,
                borderRadius: 7,
                width: '40%',
              }}
            />
            <TextInput
              placeholder="Latitude.."
              onChangeText={e => setToLocation({...toLocation, lat: e})}
              style={{
                padding: 10,
                borderColor: 'green',
                borderWidth: 0.6,
                borderRadius: 7,
                width: '40%',
              }}
            />
          </View>
          <TouchableOpacity onPress={findDistance} style={styles.btn}>
            <Text>Get Distance</Text>
          </TouchableOpacity>
        </View>

        {location ? (
          <View style={{height: 300, width: 300, marginTop: 10}}>
            <MapView
              style={StyleSheet.absoluteFillObject}
              initialRegion={{
                latitude: location?.latitude,
                longitude: location?.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}>
              <Marker coordinate={location} title="Current Location" />
              <Marker coordinate={toLocation} title="Destination" />

              {/* <Polyline
                coordinates={[
                  {
                    latitude: location?.latitude,
                    longitude: location?.longitude,
                  },
                  {
                    latitude: parseFloat(toLocation?.lat),
                    longitude: parseFloat(toLocation?.long),
                  },
                ]}
                strokeColor="blue"
                strokeWidth={3}
              /> */}
            </MapView>
          </View>
        ) : (
          <Text>Loading location...</Text>
        )}
      </View>
    </View>
  );
};

export default Location;

const styles = StyleSheet.create({
  btn: {
    padding: 10,
    alignItems: 'center',
    backgroundColor: 'skyblue',
    borderRadius: 7,
    margin: 10,
  },
  bold: {
    fontSize: 18,
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
  flexrow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
    // width: '100%',
  },
});
