import React, {useLayoutEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/core';
import auth from '@react-native-firebase/auth';
import tw from 'tailwind-rn';

import {
  KeyboardAvoidingView,
  StyleSheet,
  View,
  Text,
  Button,
  TextInput,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';

const LoginScreen = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const bgURI = 'https://tinder.com/static//tinder.png';

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  const signIn = () => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        navigation.replace('Home');
      })
      .catch(error => alert(error));
  };

  return (
    <View style={tw('flex-1')}>
      <ImageBackground
        resizeMode="cover"
        style={tw('flex-1')}
        source={{uri: bgURI}}>
        <KeyboardAvoidingView
          className=" bg-opacity-50 flex items-center justify-center place-items-center"
          style={tw('absolute bottom-10 w-full')}
          behavior="padding">
          <View style={tw(' px-10 max-w-md')}>
            <TextInput
              placeholder="Email"
              style={tw(
                'bg-white bg-opacity-90 px-10 max-w-md mt-2 rounded-2xl',
              )}
              autoFocus
              type="email"
              value={email}
              onChangeText={text => setEmail(text)}
            />
            <TextInput
              placeholder="Password"
              style={tw(
                'bg-white bg-opacity-90 px-10 max-w-md mt-4 rounded-2xl',
              )}
              secureTextEntry
              type="password"
              value={password}
              onChangeText={text => setPassword(text)}
              onSubmitEditing={signIn}
            />
          </View>
          <View style={tw('flex flex-row items-center justify-center p-4')}>
            <TouchableOpacity
              style={tw('bg-white p-4 rounded-3xl w-40 ml-2 mr-2')}
              onPress={signIn}>
              <Text style={tw('text-center font-bold text-xl')}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw('bg-white p-4 rounded-3xl w-40 ml-2 mr-2')}
              onPress={() => navigation.navigate('Register')}>
              <Text style={tw('text-center font-bold text-xl text-red-500')}>
                Register
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;
