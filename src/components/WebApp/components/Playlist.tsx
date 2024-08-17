import React, { useState } from "react";
import PlaylistSongs from "./PlaylistSongs";
import '../CSS/Playlist.css'; 

interface PlaylistItem {
  id: string;
  name: string;
}

interface PlaylistListProps {
  items: PlaylistItem[];
  token: string;
}

const PlaylistList: React.FC<PlaylistListProps> = ({ items, token }) => {
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);

  return (
    <div>
      <ul className="playlists-list">
        {items.map(item => (
          <li key={item.id} onClick={() => setSelectedPlaylist(item.id)}>
            {item.name}
          </li>
        ))}
      </ul>
      {selectedPlaylist && <PlaylistSongs playlistId={selectedPlaylist} token={token} />}
    </div>
  );
};

export default PlaylistList;
