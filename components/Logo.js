
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

import image from '../assets/icon_gray.png'; 

const Logo = () => {

return (<View style={styles.logoContainer}>
        <Image source={image} style={styles.logo} resizeMode="contain" />
      </View>)

};

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  logo: {
    width: 100,
    height: 100,
  },
});

export default Logo;