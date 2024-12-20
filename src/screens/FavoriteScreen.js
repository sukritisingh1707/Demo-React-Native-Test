import React from 'react';
import {
  FlatList,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {toggleFavorite} from '../redux/usersSlice';
import Icon from 'react-native-vector-icons/Ionicons';

const FavoriteScreen = () => {
  const dispatch = useDispatch();
  const {favorites} = useSelector(state => state.users);

  const handleUnfavorite = id => {
    dispatch(toggleFavorite(id));
  };

  return (
    <FlatList
      data={favorites}
      keyExtractor={item => item.id}
      renderItem={({item}) => (
        <View style={styles.card}>
          <Image source={{uri: item.picture}} style={styles.image} />
          <View style={styles.details}>
            <Text style={styles.name}>{item.name}</Text>
          </View>
          <TouchableOpacity onPress={() => handleUnfavorite(item.id)}>
            <Icon name="trash-outline" size={24} color="red" />
          </TouchableOpacity>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  image: {width: 50, height: 50, borderRadius: 25},
  details: {flex: 1, marginLeft: 10},
  name: {fontWeight: 'bold'},
});

export default FavoriteScreen;
