import { Animated, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useRef } from 'react';

const AnimatedHeader = ({ headerText, searchPlaceholder, children }) => {
  const scrollY = useRef(new Animated.Value(0)).current;

  // Interpolate the header height based on scroll position
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [100, 40],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      {/* Animated Header */}
      <Animated.View style={[styles.headerView, { height: headerHeight }]}>
        <Text style={styles.headerText}>{headerText}</Text>
      </Animated.View>

      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        stickyHeaderIndices={[1]} // Make the search bar sticky
      >
        {/* Spacer for the animated header */}
        <View style={styles.headerSpacer} />

        {/* Search Bar (Sticky) */}
        <View style={styles.searchContainer}>
          <TextInput style={styles.searchInput} placeholder={searchPlaceholder} />
        </View>

        {/* Content to pass children  */}
        <View style={styles.contentContainer}>
          {children}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerView: {
    backgroundColor: 'rgba(89, 150, 202, 0.78)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', // To prevent it from pushing content down
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  headerText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSpacer: {
    height: 50, // Same as initial header height to keep the spacing
  },
  searchContainer: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    height: 40,
    backgroundColor: '#fff',
    width: 300,
    borderRadius: 20,
    paddingHorizontal: 15,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  scrollViewContent: {
    paddingTop: 40, // Space for the header height
  },
  contentContainer: {
    padding: 20,
  },
  contentText: {
    fontSize: 18,
    marginVertical: 10,
  },
});

export default AnimatedHeader;
