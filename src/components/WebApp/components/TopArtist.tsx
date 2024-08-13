import React, { useEffect, useState } from "react";
import axios from "axios";
import"./"; 
import "../../SpotifyLogin/Spotify/spotify.css"; 

interface Artist {
  id: string;
  name: string;
  images: { url: string }[];
  followers: { total: number };
}

interface TopArtistsResponse {
  items: Artist[];
}

const TOP_ARTISTS_ENDPOINT = "https://api.spotify.com/v1/me/top/artists";

const SpotifyTopArtists: React.FC = () => {
  const [token, setToken] = useState<string>("");
  const [topArtists, setTopArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("spotify_access_token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    const fetchTopArtists = async () => {
      if (token) {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get<TopArtistsResponse>(TOP_ARTISTS_ENDPOINT, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setTopArtists(response.data.items);
        } catch (error) {
          setError("Failed to fetch top artists. Please try again.");
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTopArtists();
  }, [token]);

  return (
    <div className="top-artists-container">
      {loading && <p>Loading...</p>}
      {topArtists.length > 0 && (
        <div className="artists-list">
          {topArtists.map((artist) => (
            <div key={artist.id} className="artist-item">
              <img
                src={artist.images[0]?.url}
                alt={artist.name}
                style={{ width: "100px", height: "100px", borderRadius: "50%" }}
              />
              <div className="artist-info">
                <h3>{artist.name}</h3>
                <h4>Followers: {artist.followers.total}</h4>
              </div>
            </div>
          ))}
        </div>
      )}
      {error && <p>{error}</p>}
    </div>
  );
};

export default SpotifyTopArtists;
