import React, {useLayoutEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/core';

import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import tw from 'tailwind-rn';
import useAuth from '../../hooks/useAuth';
import firestore from '@react-native-firebase/firestore';

const ModalScreen = () => {
  const navigation = useNavigation();

  const {user} = useAuth();
  const [userData, setUserData] = useState([]);
  const [age, setAge] = useState(Number(0));
  const [location, setLocation] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);
  const db = firestore();

  const incomplete = !photoURL || !location || !age;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
      headerTitle: 'Update Your Profil',
    });
  }, []);

  const updateProfile = () => {
    if (user && !incomplete) {
      db.collection('users')
        .doc(user?.uid)
        .set(
          {
            age: age,
            location: location,
            photoURL: photoURL,
            timestamp: firestore.FieldValue.serverTimestamp(),
          },
          {merge: true},
        )
        .then(() => navigation.navigate('Home'))
        .catch(error => alert(error.message));
    }
  };

  return (
    <SafeAreaView style={tw(`flex-1`)}>
      <View style={tw(`flex-1 items-center pt-1`)}>
        <Image
          style={tw('h-20 w-full')}
          source={{
            uri: 'https://1000logos.net/wp-content/uploads/2018/07/Tinder-logo.png',
          }}
          resizeMode="contain"
        />
        <Text style={tw('text-xl text-gray-500 p-2 font-bold')}>
          Welcome {user?.email}
        </Text>
        <Text style={tw('text-center p-4 font-bold text-red-400')}>
          Step 1 : The Profile Pic
        </Text>
        <TextInput
          style={tw('text-center text-xl pb-2')}
          placeholder="Enter a Profile Pic URL"
          value={photoURL}
          onChangeText={text => setPhotoURL(text)}
        />
        <Text style={tw('text-center p-4 font-bold text-red-400')}>
          Step 2 : The Location
        </Text>
        <TextInput
          style={tw('text-center text-xl pb-2')}
          placeholder="Enter your Location"
          value={location}
          onChangeText={text => setLocation(text)}
        />
        <Text style={tw('text-center p-4 font-bold text-red-400')}>
          Step 3 : The Age
        </Text>
        <TextInput
          style={tw('text-center text-xl pb-2')}
          placeholder="Enter a Age"
          value={age}
          onChangeText={text => setAge(text)}
          keyboardType="numeric"
          maxLength={2}
        />
        <TouchableOpacity
          onPress={updateProfile}
          style={tw(
            `w-64 p-3 rounded-xl absolute bottom-4 bg-red-400 ${
              incomplete && 'bg-gray-500'
            }`,
          )}>
          <Text style={tw('text-center text-white text-xl font-medium')}>
            Update Profile
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ModalScreen;
