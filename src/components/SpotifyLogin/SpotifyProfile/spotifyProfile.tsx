import React, { useEffect, useState } from "react";
import axios from "axios";
import "./spotifyProfile.css";
import "../Spotify/spotify.css";
import { useSpotify } from "../Spotify/SpotifyContext";

// Define types for the API response and state
interface CurrentUsersProfile {
  id: string;
  display_name: string;
  images: { url: string }[];
  followers: { total: number };
}

const PROFILE_ENDPOINT = "https://api.spotify.com/v1/me";

const SpotifyGetUser: React.FC = () => {
  const { token } = useSpotify();
  const [profile, setProfile] = useState<CurrentUsersProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (token) {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get<CurrentUsersProfile>(PROFILE_ENDPOINT, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
          });
          setProfile(response.data);
        } catch (error) {
          setError("Failed to fetch profile. Please try again.");
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfile();
  }, [token]);

  return (
    <div className="profile-container">
      {loading && <p>Loading...</p>}
      {profile && (
        <>
          <img
            src={profile.images[0]?.url}
            alt="Profile"
            style={{ width: '100px', height: '100px', borderRadius: '50%' }}
          />
          <div className="profile-info">
            <h2>{profile.display_name}</h2>
            <h3>Followers: {profile.followers.total}</h3>
          </div>
        </>
      )}
      {error && <p>{error}</p>}
    </div>
  );
};


export default SpotifyGetUser;
