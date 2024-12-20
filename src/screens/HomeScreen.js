import React, {useEffect, useState} from 'react';
import {
  FlatList,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {fetchUsers, toggleFavorite} from '../redux/usersSlice';
import Icon from 'react-native-vector-icons/Ionicons';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const {users, status, error} = useSelector(state => state.users);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers(page));
  }, [dispatch, page]);

  const handleFavoriteToggle = id => {
    dispatch(toggleFavorite(id));
  };

  const loadMoreUsers = () => {
    if (status !== 'loading') {
      setPage(prevPage => prevPage + 1);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    dispatch(fetchUsers(1)).finally(() => setRefreshing(false));
  };

  if (status === 'loading' && page === 1) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (status === 'failed') {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity
          onPress={() => dispatch(fetchUsers(page))}
          style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={users}
      keyExtractor={item => item.id}
      renderItem={({item}) => (
        <View style={styles.card}>
          <Image source={{uri: item.picture}} style={styles.image} />
          <View style={styles.details}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.location}>{item.location}</Text>
          </View>
          <TouchableOpacity onPress={() => handleFavoriteToggle(item.id)}>
            <Icon name="star-outline" size={24} color="gold" />
          </TouchableOpacity>
        </View>
      )}
      onEndReached={loadMoreUsers}
      onEndReachedThreshold={0.5}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
      ListFooterComponent={
        status === 'loading' ? (
          <ActivityIndicator size="small" color="#0000ff" />
        ) : null
      }
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
  location: {color: 'gray'},
  errorContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  errorText: {color: 'red', fontSize: 16, marginBottom: 10},
  retryButton: {padding: 10, backgroundColor: 'blue', borderRadius: 5},
  retryText: {color: 'white', fontWeight: 'bold'},
});

export default HomeScreen;
