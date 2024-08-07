import React, { useEffect, useState } from "react";
import axios from "axios";

// Define types for the API response and state
interface PlaylistItem {
  id: string;
  name: string;
}

interface PlaylistsResponse {
  items: PlaylistItem[];
}

const PLAYLISTS_ENDPOINT = "https://api.spotify.com/v1/me/playlists";

const SpotifyGetPlaylists: React.FC = () => {
  const [token, setToken] = useState<string>("");
  const [data, setData] = useState<PlaylistsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleGetPlaylists = async () => {
    if (token) {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<PlaylistsResponse>(PLAYLISTS_ENDPOINT, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(response.data);
      } catch (error) {
        setError("Failed to fetch playlists. Please try again.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <button onClick={handleGetPlaylists} disabled={loading} >
        {loading ? "Loading..." : "Get Playlists"}
      </button>
      {error && <p>{error}</p>}
      {data?.items.length ? (
        <ul>
          {data.items.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      ) : (
        !loading && <p>No playlists found.</p>
      )}
    </>
  );
};

export default SpotifyGetPlaylists;
