import React, {useLayoutEffect, useRef, useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/core';

import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

import useAuth from '../../hooks/useAuth';
import tw from 'tailwind-rn';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import auth from '@react-native-firebase/auth';
import Swiper from 'react-native-deck-swiper';
import generateId from '../../lib/generatedId';

const HomeScreen = () => {
  const navigation = useNavigation();

  const {user} = useAuth();
  const db = firestore();
  const [userData, setUserData] = useState([]);
  const userPhotoURL = userData?.photoURL;
  const [match, setMatch] = useState([]);
  const [pass, setPass] = useState([]);

  const avatar = user
    ? userPhotoURL
    : 'https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953.jpg';

  const swipeRef = useRef(null);
  const [profiles, setProfiles] = useState([]);

  //console.log(profiles);

  useLayoutEffect(() => {
    db.collection('users')
      .doc(user?.uid)
      .get()
      .then(documentSnapshot => {
        if (!documentSnapshot.exists) {
          navigation.navigate('Modal');
        } else {
          //console.log('User data: ', documentSnapshot.data());
          setUserData(documentSnapshot.data());
        }
      });
  });

  const authentication = () => {
    if (user) {
      auth()
        .signOut()
        .then(() => console.log('User signed out!'));
    } else {
      navigation.navigate('Login');
    }
  };

  const navChat = () => {
    navigation.navigate('Chat');
  };

  useEffect(() => {
    let unsubscribe;

    const fetchPassData = async () => {
      unsubscribe = db
        .collection('users')
        .doc(user?.uid)
        .collection('passes')
        .onSnapshot(snapshot => setPass(snapshot?.docs.map(doc => doc?.id)));
    };
    fetchPassData();
    return unsubscribe;
  });

  useEffect(() => {
    let unsubscribe;

    const fetchMatchData = async () => {
      unsubscribe = db
        .collection('users')
        .doc(user?.uid)
        .collection('match')
        .onSnapshot(snapshot => setMatch(snapshot?.docs.map(doc => doc?.id)));
    };
    fetchMatchData();
    return unsubscribe;
  });

  useEffect(() => {
    let unsubscribe;

    const fetchData = async () => {
      const passedUseresId = pass?.length > 0 ? pass : ['test'];
      const MatchUseresId = match?.length > 0 ? match : ['test'];

      unsubscribe = db
        .collection('users')
        .where('userId', 'not-in', [...passedUseresId, ...MatchUseresId])
        .onSnapshot(snapshot =>
          setProfiles(
            snapshot?.docs
              .filter(doc => doc.id !== user?.uid)
              .map(doc => ({
                id: doc?.id,
                ...doc?.data(),
              })),
          ),
        );
    };
    fetchData();
    return unsubscribe;
  });

  const swpieLeft = async cardIndex => {
    if (!profiles[cardIndex]) {
      return;
    }
    const userSwiped = profiles[cardIndex];
    console.log(`You Swiped Pass on ${userSwiped?.username}`);

    // TODO: double check if we need entire user object in passes or just userSwiped.id

    db.collection('users')
      .doc(user?.uid)
      .collection('passes')
      .doc(userSwiped?.id)
      .set(userSwiped, {merge: true});
  };

  const swpieRight = async cardIndex => {
    if (!profiles[cardIndex]) return;

    const userSwiped = profiles[cardIndex];
    console.log(`You Swiped liked on ${userSwiped?.username}`);

    db.collection('users')
      .doc(userSwiped?.id)
      .collection('match')
      .doc(user?.uid)
      .get()
      .then(documentSnapshot => {
        console.log('You are Match: ', documentSnapshot?.exists);

        if (documentSnapshot?.exists) {
          console.log(`you matched ${userSwiped?.username}`);

          db.collection('users')
            .doc(user?.uid)
            .collection('match')
            .doc(userSwiped?.id)
            .set(userSwiped, {merge: true});

          // Create a MATCH!!!

          db.collection('matches')
            .doc(generateId(user?.uid, userSwiped?.id))
            .set(
              {
                users: {
                  [user.uid]: userData,
                  [userSwiped.id]: userSwiped,
                },
                userMatched: [user.uid, userSwiped.id],
                timestamp: firestore.FieldValue.serverTimestamp(),
              },
              {merge: true},
            );
          navigation.navigate('Match', {
            userData,
            userSwiped,
          });
        }
        if (!documentSnapshot?.exists) {
          console.log(`you just liked ${userSwiped.username}`);
          db.collection('users')
            .doc(user?.uid)
            .collection('match')
            .doc(userSwiped?.id)
            .set(userSwiped, {merge: true});
        }
      });
  };

  return (
    <SafeAreaView style={tw(`flex-1`)}>
      <View
        style={tw(`flex flex-row items-center justify-between mt-1 px-4 py-2`)}>
        <TouchableOpacity onPress={authentication} style={tw(``)}>
          <Image style={tw(`h-20 w-20 rounded-full`)} source={{uri: avatar}} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Modal')}>
          <Image
            style={tw(`h-14 w-14`)}
            source={require('../../asset/tinderlogo.png')}
          />
        </TouchableOpacity>
        <View>
          <TouchableOpacity onPress={navChat}>
            <MaterialCommunityIcons
              name="chat"
              size={40}
              style={tw(`text-red-400`)}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={tw('flex-1 -mt-6')}>
        <Swiper
          ref={swipeRef}
          containerStyle={{backgroundColor: 'transparent'}}
          cards={profiles}
          stackSize={5}
          cardIndex={0}
          animateCardOpacity
          verticalSwipe={false}
          onSwiped={cardIndex => {
            console.log(cardIndex);
          }}
          backgroundColor={`#4FD019`}
          onSwipedLeft={cardIndex => {
            console.log('Pass');
            console.log('cardIndex', cardIndex);
            swpieLeft(cardIndex);
          }}
          onSwipedRight={cardIndex => {
            console.log('Match');
            swpieRight(cardIndex);
          }}
          overlayLabels={{
            left: {
              title: 'NOPE',
              style: {
                label: {textAlign: 'right', color: 'red'},
              },
            },
            right: {
              title: 'Match',
              style: {
                label: {textAlign: 'left', color: '#4DED30'},
              },
            },
          }}
          renderCard={card =>
            card ? (
              <>
                <View
                  key={card?.id}
                  style={tw(`relative bg-red-500 h-3/4 rounded-xl`)}>
                  <Image
                    style={tw(`absolute top-0 h-full w-full`)}
                    source={{uri: card?.photoURL}}
                  />
                  <View
                    style={[
                      tw(
                        `absolute bottom-0 flex flex-row bg-white justify-between  px-6 py-2 h-20 w-full`,
                      ),
                      styles.cardShadow,
                    ]}>
                    <View>
                      <Text style={tw('text-xl font-bold')}>
                        {card?.username}
                      </Text>
                      <Text>{card?.location}</Text>
                    </View>
                    <Text style={tw('text-2xl font-bold')}>{card?.age}</Text>
                  </View>
                </View>
              </>
            ) : (
              <View
                style={[
                  tw(`relative bg-white h-3/4 justify-center items-center`),
                  styles.cardShadow,
                ]}>
                <Text style={tw('font-bold pb-5')}>No More Profiles</Text>
                <Image
                  style={tw(`h-20 w-full`)}
                  height={100}
                  width={100}
                  source={{uri: 'https://links.papareact.com/6gb'}}
                />
              </View>
            )
          }
        />
      </View>
      <View style={tw(`flex flex-row justify-evenly`)}>
        <TouchableOpacity
          onPress={() => swipeRef.current.swipeLeft()}
          style={tw(
            `items-center justify-center rounded-full w-16 h-16 bg-red-200`,
          )}>
          <Entypo name="cross" size={40} color="red" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => swipeRef.current.swipeRight()}
          style={tw(
            `items-center justify-center rounded-full w-16 h-16 bg-green-200`,
          )}>
          <Entypo name="heart" size={40} color="green" />
        </TouchableOpacity>
      </View>
      <View />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});
