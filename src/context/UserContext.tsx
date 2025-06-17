import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import axios from "axios";

// Definisikan bentuk data profil
interface UserProfile {
  username: string;
  email: string;
  profilepicture?: string;
  // Tambahkan properti lain jika ada dari userprofiles
}

// Definisikan bentuk context
interface UserContextType {
  userProfile: UserProfile | null;
  isLoading: boolean;
  updateProfilePicture: (newPictureUrl: string) => void;
  refetchUser: () => void;
}

// Buat Context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Buat Provider (pembungkus aplikasi)
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = useCallback(async () => {
    const data = localStorage.getItem("data");
    if (data) {
      const user = JSON.parse(data);
      // Jangan set loading true di sini agar tidak ada flash saat refresh
      try {
        const res = await axios.get(
          `https://myassets-backend.vercel.app/getUserProfile/${user.username}`
        );
        const profile = res.data[0];
        setUserProfile({
          username: user.username,
          email: user.email,
          profilepicture: profile?.profilepicture,
        });
      } catch (error) {
        console.error("Failed to fetch user profile in context:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const updateProfilePicture = (newPictureUrl: string) => {
    setUserProfile((prevProfile) => {
      if (!prevProfile) return null;
      return { ...prevProfile, profilepicture: newPictureUrl };
    });
  };

  const value = {
    userProfile,
    isLoading,
    updateProfilePicture,
    refetchUser: fetchUserProfile,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Buat custom hook untuk mempermudah penggunaan context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
