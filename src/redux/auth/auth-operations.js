import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

axios.defaults.baseURL = 'https://serene-inlet-87913.herokuapp.com/';

const token = {
    set(token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    },
    unset() {
      axios.defaults.headers.common.Authorization = '';
    }
}

const register = createAsyncThunk('auth/register', async credentials =>{
    try{
        const {data} = await axios.post('/api/users/signup', credentials);
        token.set(data.token);
        return data;
    }
    catch(error){
    }
})

const logIn = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/api/users/login', credentials);
      token.set(data.token);
      return data;
    } catch (error) {
      rejectWithValue(Notify.failure('Email or password entered incorrectly :('))
    }
  });

const logOut = createAsyncThunk('auth/logout', async () => {
    try {
      await axios.get('/api/users/logout');
      token.unset();
    } catch (error) {

    }
})

const fetchCurrentUser = createAsyncThunk(
    'auth/refresh',
    async (_, {getState, rejectWithValue }) => {
      const state = getState();
      const persistedToken = state.auth.token;

      if (persistedToken === null) {
        return rejectWithValue();
      }

      token.set(persistedToken);
    
      try {
        const { data } = await axios.get('/api/users/current');
        return data;
      } catch (error) {
        rejectWithValue(error.message)
      }
    },
);


const authOperations = {
    register,
    logIn,
    logOut,
    fetchCurrentUser,
};

export default authOperations;