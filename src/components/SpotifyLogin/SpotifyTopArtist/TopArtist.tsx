import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Spotify/spotify.css";
import "../../WebApp/components/SpotifyGetPlaylist.css";
import "./TopArtist.css"

interface Artist {
  id: string;
  name: string;
  images: { url: string }[];
  followers: { total: number };
}

interface TopArtistsResponse {
  items: Artist[];
}

const TOP_ARTISTS_ENDPOINT = "https://api.spotify.com/v1/me/top/artists?limit=50";

const SpotifyTopArtists: React.FC = () => {
  const [token, setToken] = useState<string>("");
  const [topArtists, setTopArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const artistsPerPage = 10;

  useEffect(() => {
    const storedToken = localStorage.getItem('spotify_access_token');
    if (storedToken) {
      setToken(storedToken);
    } else {
      console.error("No token found in localStorage");
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
          console.log("Top Artists Response:", response.data);
          setTopArtists(response.data.items);
        } catch (error) {
          console.error("Failed to fetch top artists:", error);
          setError("Failed to fetch top artists. Please try again.");
        } finally {
          setLoading(false);
        }
      } else {
        console.error("No token available for fetching top artists");
      }
    };

    fetchTopArtists();
  }, [token]);

  const paginatedArtists = topArtists.slice(currentPage * artistsPerPage, (currentPage + 1) * artistsPerPage);

  const handleNext = () => {
    if ((currentPage + 1) * artistsPerPage < topArtists.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="top-artists-container">
      <h3><b>Top Artists:</b></h3>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <div className="artists-carousel">
        {paginatedArtists.length > 0 && (
          <div className="artists-list">
            {paginatedArtists.map((artist) => (
              <div key={artist.id} className="artist-item">
                <img
                  src={artist.images[0]?.url}
                  alt={artist.name}
                  className="artist-image"
                />
                <div className="artist-info">
                  <h3>{artist.name}</h3>
                  <h4>Followers: {artist.followers.total}</h4>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="pagination-buttons">
        <button onClick={handlePrevious} disabled={currentPage === 0}>Previous</button>
        <button onClick={handleNext} disabled={(currentPage + 1) * artistsPerPage >= topArtists.length}>Next</button>
      </div>
    </div>
  );
};

export default SpotifyTopArtists;
