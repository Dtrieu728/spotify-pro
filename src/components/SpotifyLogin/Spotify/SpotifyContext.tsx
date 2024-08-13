import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SpotifyContextType {
  token: string | null;
  setToken: (token: string | null) => void;
}

const SpotifyContext = createContext<SpotifyContextType | undefined>(undefined);

export const SpotifyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('spotify_access_token') || null);

  return (
    <SpotifyContext.Provider value={{ token, setToken }}>
      {children}
    </SpotifyContext.Provider>
  );
};

export const useSpotify = (): SpotifyContextType => {
  const context = useContext(SpotifyContext);
  if (context === undefined) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};
