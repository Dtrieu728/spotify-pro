import React from "react";
import "./SpotifyGetPlaylist.css";

interface PlaylistItem {
  id: string;
  name: string;
}

interface PlaylistListProps {
  items: PlaylistItem[];
}

const PlaylistList: React.FC<PlaylistListProps> = ({ items }) => {
  return (
    <ul className="playlists-list">
      {items.map((item) => (
        <li key={item.id}>
          <span>{item.name}</span>
        </li>
      ))}
    </ul>
  );
};

export default PlaylistList;
