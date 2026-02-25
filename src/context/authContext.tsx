import { createContext, useContext, useState, ReactNode, useCallback } from "react";

export interface GoogleUser {
  id: string;
  name: string;
  email: string;
  picture: string;
}

interface AuthContextType {
  user: GoogleUser | null;
  isLoggedIn: boolean;
  login: (user: GoogleUser) => void;
  logout: () => void;
  favorites: string[];           // array de product IDs
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  const login = useCallback((googleUser: GoogleUser) => {
    setUser(googleUser);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setFavorites([]); // limpiar favoritos al cerrar sesión
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    if (!user) return; // solo si está logueado
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }, [user]);

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn: !!user,
      login,
      logout,
      favorites,
      toggleFavorite,
      isFavorite,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};