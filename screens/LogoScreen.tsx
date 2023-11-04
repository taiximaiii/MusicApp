import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const LogoScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Login');
    }, 2000);

    return () => clearTimeout(timer); 
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Image
          source={require('../assets/spo.png')} 
          style={styles.logoImage}
        />
        <Text style={styles.spotifyText}>SPOTIFY</Text>
      
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor : '#121212'
    
  },
  logo: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30, 
  },
  logoImage: {
    width: 200, 
    height: 200,
  },
  spotifyText: {
    fontSize: 40,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 20,
    fontStyle: 'italic',
  },
 
});

export default LogoScreen;
