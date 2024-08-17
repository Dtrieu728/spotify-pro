import React, { useEffect, useState } from "react";
import axios from "axios";
import PlaylistList from "./Playlist";
import SearchBar from "./Searchbar";
import Pagination from "./Pagination";
import './SpotifyGetPlaylist.css'; 

interface PlaylistItem {
  id: string;
  name: string;
}

interface PlaylistsResponse {
  items: PlaylistItem[];
  next?: string;
}

const PLAYLISTS_ENDPOINT = "https://api.spotify.com/v1/me/playlists";

const SpotifyGetPlaylists: React.FC = () => {
  const [token, setToken] = useState<string>("");
  const [data, setData] = useState<PlaylistsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const storedToken = localStorage.getItem('spotify_access_token');
    if (storedToken) {
      setToken(storedToken);
      fetchPlaylists();
    }
  }, [page]);

  const fetchPlaylists = async () => {
    if (token) {
      setLoading(true);
      setError(null);
      try {
        const url = page === 0 ? PLAYLISTS_ENDPOINT : data?.next || PLAYLISTS_ENDPOINT;
        const response = await axios.get<PlaylistsResponse>(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(response.data);
        setHasMore(!!response.data.next);
      } catch (error) {
        setError("Failed to fetch playlists. Please try again.");
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredPlaylists = data?.items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="playlists-container">
      <h2>Your Playlists</h2>
      <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <button onClick={fetchPlaylists} disabled={loading}>
        {loading ? "Loading..." : "Get Playlists"}
      </button>
      {error && <p>{error}</p>}
      {filteredPlaylists?.length ? (
        <PlaylistList items={filteredPlaylists} token={token} />
      ) : (
        !loading && <p>No playlists found.</p>
      )}
      <Pagination hasMore={hasMore} loading={loading} onLoadMore={() => setPage(prevPage => prevPage + 1)} />
    </div>
  );
};

export default SpotifyGetPlaylists;
