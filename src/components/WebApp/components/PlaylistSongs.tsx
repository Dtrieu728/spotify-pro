import React, { useEffect, useState } from "react";
import axios from "axios";
import "../CSS/PlaylistSongs.css"; 

interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
}

interface PlaylistTracksResponse {
  items: { track: Track }[];
}

interface PlaylistSongsProps {
  playlistId: string;
  token: string;
}

const PlaylistSongs: React.FC<PlaylistSongsProps> = ({ playlistId, token }) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTracks = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<PlaylistTracksResponse>(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTracks(response.data.items.map(item => item.track));
      } catch (error) {
        setError("Failed to fetch tracks. Please try again.");
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, [playlistId, token]);

  return (
    <div className="playlist-songs">
      <h3>Songs</h3>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : tracks.length ? (
        <ul>
          {tracks.map(track => (
            <li key={track.id}>
              {track.name} by {track.artists.map(artist => artist.name).join(", ")}
            </li>
          ))}
        </ul>
      ) : (
        <p>No tracks found.</p>
      )}
    </div>
  );
};

export default PlaylistSongs;
