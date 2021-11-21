import React, {useLayoutEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/core';
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
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const RegisterScreen = () => {
  const navigation = useNavigation();

  const [username, setusername] = useState('');
  const [location, setLocation] = useState('');
  const [age, setAge] = useState(Number(0));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const bgURI = 'https://tinder.com/static//tinder.png';
  const db = firestore();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  const register = () => {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(response => {
        const uid = response.user.uid;
        const usersRef = db.collection('users');
        usersRef.doc(uid).set({
          userId: response.user.uid,
          username: username.toLowerCase(),
          email: email.toLowerCase(),
          password: password,
          photoURL:
            'https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953.jpg',
        });
      })
      .then(authUser => {
        const Updateuser = auth.currentUser;
        Updateuser.updateProfile({
          displayName: username,
          photoURL:
            'https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953.jpg',
        });
      })
      .catch(error => alert(error.message))
      .then(() => {
        navigation.navigate('Home');
      });
  };

  return (
    <View style={tw('flex-1 bg-red-400')}>
      <View
        className=" bg-opacity-50 flex items-center justify-center place-items-center"
        style={tw('absolute bottom-10 w-full')}
        behavior="padding">
        <View style={tw(' px-10 max-w-md')}>
          <TextInput
            placeholder="Username"
            style={tw('bg-white bg-opacity-90 px-10 max-w-md mt-2 rounded-2xl')}
            autoFocus
            type="name"
            value={username}
            onChangeText={text => setusername(text)}
          />
          <TextInput
            placeholder="Email"
            style={tw('bg-white bg-opacity-90 px-10 max-w-md mt-4 rounded-2xl')}
            type="email"
            value={email}
            onChangeText={text => setEmail(text)}
          />
          <TextInput
            placeholder="Password"
            style={tw('bg-white bg-opacity-90 px-10 max-w-md mt-4 rounded-2xl')}
            secureTextEntry
            type="password"
            value={password}
            onChangeText={text => setPassword(text)}
            onSubmitEditing={register}
          />
        </View>
        <View style={tw('flex flex-row items-center justify-center p-4')}>
          <TouchableOpacity
            style={tw('bg-white p-4 rounded-3xl w-40 ml-2 mr-2')}
            onPress={register}>
            <Text style={tw('text-center font-bold text-xl')}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw('bg-white p-4 rounded-3xl w-40 ml-2 mr-2')}
            onPress={() => navigation.navigate('Login')}>
            <Text style={tw('text-center font-bold text-xl text-red-500')}>
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default RegisterScreen;
