import React, { useContext, createContext, useState, useEffect} from 'react';

import * as AuthSession from 'expo-auth-session';
import { api } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CLIENT_ID = '0596659773f13c23f7ee'
const SCOPE = 'read:user'
const USER_STORAGE = '@heatapp:user'
const TOKEN_STORAGE = '@heatapp:token'

type User = {
  id: string;
  avatar_url: string;
  name: string;
  login: string;
}

type AuthContextData = {
  user: User | null,
  isSignIng: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

type AuthProviderProps = {
  children: React.ReactNode;
}

type AuthResponse = {
  token: string;
  user: User;
}

type AuthorizationResponse = {
  params: {
    code?: string;
    error?: string;
  },
  type?: string;
}

export const AuthContext = createContext({} as AuthContextData)

function AuthProvider({ children }: AuthProviderProps) {
  const [isSignIng, setIsSignIng] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  async function signIn() {
    try {
      setIsSignIng(true)
      const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=${SCOPE}`
      const AuthSessionResponse = await AuthSession.startAsync({ authUrl }) as AuthorizationResponse;
      
      if (AuthSessionResponse.type === 'success' && AuthSessionResponse.params.error !== 'access_denied') {
        const authResponse = await api.post('/authenticate', { code: AuthSessionResponse.params.code })

        const { user, token } = authResponse.data as AuthResponse

        api.defaults.headers.common['Authorization'] = `Bearer ${token}`

        await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user))
        await AsyncStorage.setItem(TOKEN_STORAGE, token)

        setUser(user)
      }
    } catch (err) {
      console.log(err)
    } finally {
      setIsSignIng(false)
    }

    
  }

  async function signOut() {
    setUser(null)
    await AsyncStorage.removeItem(USER_STORAGE)
    await AsyncStorage.removeItem(TOKEN_STORAGE)
  }

  useEffect(() => {
    async function loadUserStorageData() {
      const userStorage = await AsyncStorage.getItem(USER_STORAGE)
      const tokenStorage = await AsyncStorage.getItem(TOKEN_STORAGE)

      if (userStorage && tokenStorage) {
        api.defaults.headers.common['Authorization'] = `Bearer ${tokenStorage}`

        setUser(JSON.parse(userStorage))
      }
      setIsSignIng(false)
    }
    loadUserStorageData()
  }, [])

  return (
    <AuthContext.Provider value={{ signIn, signOut, user, isSignIng }}>
      { children }
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext)

  return context;
}

export { AuthProvider, useAuth }