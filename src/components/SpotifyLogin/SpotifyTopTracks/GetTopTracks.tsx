import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Spotify/spotify.css";
import "../../WebApp/components/SpotifyGetPlaylist.css";
import "../SpotifyTopArtist/TopArtist.css";

interface Tracks {
  id: string;
  name: string;
  album: {
    images: { url: string }[];
  };
}

interface TopTracksResponse {
  items: Tracks[];
}

const TOP_TRACKS_ENDPOINT = "https://api.spotify.com/v1/me/top/tracks?limit=50";

const SpotifyTopTracks: React.FC = () => {
  const [token, setToken] = useState<string>("");
  const [topTracks, setTopTracks] = useState<Tracks[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const tracksPerPage = 10;

  useEffect(() => {
    const storedToken = localStorage.getItem("spotify_access_token");
    if (storedToken) {
      setToken(storedToken);
    } else {
      console.error("No token found in localStorage");
    }
  }, []);

  useEffect(() => {
    const fetchTopTracks = async () => {
      if (token) {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get<TopTracksResponse>(
            TOP_TRACKS_ENDPOINT,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("Top Tracks Response:", response.data);
          setTopTracks(response.data.items);
        } catch (error) {
          console.error("Failed to fetch top Tracks:", error);
          setError("Failed to fetch top tracks. Please try again.");
        } finally {
          setLoading(false);
        }
      } else {
        console.error("No token available for fetching top tracks");
      }
    };

    fetchTopTracks();
  }, [token]);

  const paginatedArtists = topTracks.slice(
    currentPage * tracksPerPage,
    (currentPage + 1) * tracksPerPage
  );

  const handleNext = () => {
    if ((currentPage + 1) * tracksPerPage < topTracks.length) {
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
      <h3>
        <b>Top 50 Tracks:</b>
      </h3>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <div className="artists-carousel">
        {paginatedArtists.length > 0 && (
          <div className="artists-list">
            {paginatedArtists.map((track) => (
              <div key={track.id} className="artist-item">
                <img
                  src={track.album.images[0]?.url}
                  alt={track.name}
                  className="artist-image"
                />
                <div className="artist-info">
                  <h3>{track.name}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="pagination-buttons">
        <button onClick={handlePrevious} disabled={currentPage === 0}>
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={(currentPage + 1) * tracksPerPage >= topTracks.length}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SpotifyTopTracks;
