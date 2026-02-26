import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";

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
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getFavoritesKey = (userId: string) => `kiki_favorites_${userId}`;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<GoogleUser | null>(() => {
    try {
      const saved = localStorage.getItem("kiki_user");
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("kiki_user");
      const savedUser = saved ? JSON.parse(saved) : null;
      if (!savedUser) return [];
      const favs = localStorage.getItem(getFavoritesKey(savedUser.id));
      return favs ? JSON.parse(favs) : [];
    } catch { return []; }
  });

  // Persistir usuario
  useEffect(() => {
    if (user) {
      localStorage.setItem("kiki_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("kiki_user");
    }
  }, [user]);

  // Persistir favoritos por usuario
  useEffect(() => {
    if (user) {
      localStorage.setItem(getFavoritesKey(user.id), JSON.stringify(favorites));
    }
  }, [favorites, user]);

  const login = useCallback((googleUser: GoogleUser) => {
    setUser(googleUser);
    try {
      const favs = localStorage.getItem(getFavoritesKey(googleUser.id));
      setFavorites(favs ? JSON.parse(favs) : []);
    } catch {
      setFavorites([]);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setFavorites([]);
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    if (!user) return;
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