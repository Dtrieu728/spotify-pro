import React, { useEffect, useState } from "react";
import axios from "axios"; 
import "../Spotify/spotify.css";
import "../../WebApp/components/SpotifyGetPlaylist.css";
import "../SpotifyTopArtist/TopArtist.css";

// Define the Track interface with nested album images
interface Track {
  id: string;
  name: string;
  album: {
    images: { url: string }[];
  };
}

// Define the RecentTrackItem interface which includes a track
interface RecentTrackItem {
  track: Track; 
}

// Define the RecentTracksResponse interface for the API response
interface RecentTracksResponse {
  items: RecentTrackItem[]; 
}

const RECENT_TRACKS_ENDPOINT = "https://api.spotify.com/v1/me/player/recently-played?limit=20";

const SpotifyRecent: React.FC = () => {
  const [token, setToken] = useState<string>("");
  const [recentTracks, setRecentTracks] = useState<RecentTrackItem[]>([]); // Update state type
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const tracksPerPage = 5;

  // Get the access token from local storage
  useEffect(() => {
    const storedToken = localStorage.getItem("spotify_access_token");
    if (storedToken) {
      setToken(storedToken);
    } else {
      console.error("No token found in localStorage");
    }
  }, []);

  // Fetch recent tracks from the Spotify API
  useEffect(() => {
    const fetchRecentTracks = async () => {
      if (token) {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get<RecentTracksResponse>(
            RECENT_TRACKS_ENDPOINT,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("Recent Tracks Response:", response.data);
          setRecentTracks(response.data.items); // Set the items directly
        } catch (error) {
          console.error("Failed to fetch recent tracks:", error);
          setError("Failed to fetch recent tracks. Please try again.");
        } finally {
          setLoading(false);
        }
      } else {
        console.error("No token available for fetching recent tracks");
      }
    };

    fetchRecentTracks();
  }, [token]);

  // Pagination logic for displaying tracks
  const paginatedTracks = recentTracks.slice(
    currentPage * tracksPerPage,
    (currentPage + 1) * tracksPerPage
  );

  const handleNext = () => {
    if ((currentPage + 1) * tracksPerPage < recentTracks.length) {
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
        <b>Recently Played:</b>
      </h3>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <div className="artists-carousel">
        {paginatedTracks.length > 0 && (
          <div className="artists-list">
            {paginatedTracks.map((item) => {
              const track = item.track; // Access the track object
              return (
                <div key={track.id} className="artist-item">
                  <img
                    src={track.album.images.length > 0 ? track.album.images[0].url : 'fallback_image_url'}
                    alt={track.name}
                    className="artist-image"
                  />
                  <div className="artist-info">
                    <h3>{track.name}</h3>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="pagination-buttons">
        <button onClick={handlePrevious} disabled={currentPage === 0}>
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={(currentPage + 1) * tracksPerPage >= recentTracks.length}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SpotifyRecent;
