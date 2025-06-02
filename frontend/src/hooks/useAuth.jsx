/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, createContext, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);      // { _id, nombre, email, role, ... }
  const [loading, setLoading] = useState(true); // true hasta que cargue los datos

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/users/me'); // ya incluye Authorization en api.js
        setUser(res.data);
      } catch (err) {
        console.error('No se pudo obtener el perfil:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}