import { createContext, useContext, useState, ReactNode, useCallback } from "react";

export interface GoogleUser {
  id: string;
  name: string;
  email: string;
  picture: string;
}

export interface ProfileData {
  firstName: string;
  lastName: string;
  dni: string;
  phone: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
}

interface AuthContextType {
  user: GoogleUser | null;
  isLoggedIn: boolean;
  login: (user: GoogleUser) => void;
  logout: () => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  profileData: ProfileData | null;
  updateProfileData: (data: ProfileData) => void;
}

// ── Helpers localStorage ──────────────────────────────────────────────────────
function loadFromStorage<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function saveToStorage(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function removeFromStorage(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {}
}

const STORAGE_USER      = "kiki_user";
const STORAGE_FAVORITES = "kiki_favorites";
const STORAGE_PROFILE   = "kiki_profile";

// ── Contexto ──────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Inicializar desde localStorage en vez de null/vacío
  const [user,        setUser]        = useState<GoogleUser | null>(() => loadFromStorage<GoogleUser>(STORAGE_USER));
  const [favorites,   setFavorites]   = useState<string[]>(() => loadFromStorage<string[]>(STORAGE_FAVORITES) ?? []);
  const [profileData, setProfileData] = useState<ProfileData | null>(() => loadFromStorage<ProfileData>(STORAGE_PROFILE));

  const login = useCallback((googleUser: GoogleUser) => {
    setUser(googleUser);
    saveToStorage(STORAGE_USER, googleUser);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setFavorites([]);
    setProfileData(null);
    removeFromStorage(STORAGE_USER);
    removeFromStorage(STORAGE_FAVORITES);
    removeFromStorage(STORAGE_PROFILE);
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    if (!user) return;
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      saveToStorage(STORAGE_FAVORITES, next);
      return next;
    });
  }, [user]);

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  const updateProfileData = useCallback((data: ProfileData) => {
    setProfileData(data);
    saveToStorage(STORAGE_PROFILE, data);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn: !!user,
      login,
      logout,
      favorites,
      toggleFavorite,
      isFavorite,
      profileData,
      updateProfileData,
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