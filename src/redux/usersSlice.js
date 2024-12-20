import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  users: [],
  favorites: [],
  status: 'idle',
  error: null,
};

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (page, {rejectWithValue}) => {
    console.log('page', page);
    try {
      const response = await axios.get(
        `https://randomuser.me/api/?results=10&page=${page}`,
      );
      return response.data.results.map(user => ({
        id: user.login.uuid,
        name: `${user.name.first} ${user.name.last}`,
        location: `${user.location.city}, ${user.location.country}`,
        picture: user.picture.medium,
        hobbies: ['Music', 'Travel', 'Hiking'],
      }));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    toggleFavorite: (state, action) => {
      const user = state.users.find(u => u.id === action.payload);
      if (user) {
        const isFavorite = state.favorites.some(f => f.id === user.id);
        state.favorites = isFavorite
          ? state.favorites.filter(f => f.id !== user.id)
          : [...state.favorites, user];
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUsers.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = [...state.users, ...action.payload];
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const {toggleFavorite} = usersSlice.actions;
export default usersSlice.reducer;
