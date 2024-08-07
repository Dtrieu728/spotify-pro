import React, { useEffect, useState } from "react";
import axios from "axios";
import "./spotifyProfile.css"
import'./spotify.css'

// Define types for the API response and state
interface CurrentUsersProfile{
  id: string;
  display_name: string;
  images:{url:string}[];
  followers:{total :number};
}

const PROFILE_ENDPOINT = "https://api.spotify.com/v1/me";

const SpotifyGetUser: React.FC = () => {
const [token, setToken] = useState<string>("");
const [profile, setProfile] = useState<CurrentUsersProfile | null>(null);
const [loading, setLoading] = useState<boolean>(false);
const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

const fetchProfile= async () => {
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
      }
    };

const handleGetUserData =async ()=>{
    if(token){
        setLoading(true);
        setError(null);
        await fetchProfile();
        setLoading(false);
    }
};

  return (
    <div className="profile-container">
      {profile && (
        <>
          <img src={profile.images[0]?.url} alt="Profile" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
          <div className="profile-info">
            <h2>{profile.display_name}</h2>
            <h3>Followers: {profile.followers.total}</h3>
          </div>
          <button onClick={handleGetUserData} disabled={loading} style={{ marginLeft: 'auto' }}>
            {loading ? "Loading..." : "Get User Data"}
          </button>
        </>
      )}
      {!profile && (
        <button onClick={handleGetUserData} disabled={loading} style={{ marginTop: '20px' }}>
          {loading ? "Loading..." : "Get User Data"}
        </button>
      )}
      {error && <p>{error}</p>}
    </div>

  );
};

export default SpotifyGetUser;
