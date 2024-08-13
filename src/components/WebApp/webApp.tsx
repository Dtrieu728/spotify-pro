import React, { useEffect } from "react";
import SpotifyGetPlaylists from "./components/SpotifyGetPlaylists";
import "./webApp.css";
// Define types for the Spotify auth response
interface SpotifyAuthParams {
  access_token?: string;
  token_type?: string;
  expires_in?: string;
}

// const CLIENT_ID = import.meta.env.VITE_SPOTIFY_ID; // Replace with your Spotify Client ID
// const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
// const REDIRECT_URL_AFTER_LOGIN = "http://localhost:5173/spotify-pro/play-list"; // Replace with your redirect URI
// const SPACE_DELIMITER = "%20";
// const SCOPES = [
//   "user-read-currently-playing",
//   "user-read-playback-state",
//   "playlist-read-private",
// ];
// const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER);

const getReturnedParamsFromSpotifyAuth = (hash: string): SpotifyAuthParams => {
  const stringAfterHashtag = hash.substring(1);
  const paramsInUrl = stringAfterHashtag.split("&");
  const paramsSplitUp = paramsInUrl.reduce<SpotifyAuthParams>((accumulater, currentValue) => {
    const [key, value] = currentValue.split("=");
    if (key && value) {
      accumulater[key as keyof SpotifyAuthParams] = value;
    }
    return accumulater;
  }, {});

  return paramsSplitUp;
};

const WebApp: React.FC = () => {
  useEffect(() => {
    if (window.location.hash) {
      const { access_token, expires_in, token_type } = getReturnedParamsFromSpotifyAuth(window.location.hash);

      localStorage.clear();

      if (access_token && token_type && expires_in) {
        localStorage.setItem("accessToken", access_token);
        localStorage.setItem("tokenType", token_type);
        localStorage.setItem("expiresIn", expires_in);
      }
    }
  }, []);


  // const handleLogin = () => {
  //   const url = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL_AFTER_LOGIN}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`;
  //   window.location.href = url;
  // }; 


  return (
    <div className="container">
      <h1>Spotify Web App</h1>
     {/*<button onClick={handleLogin}>Login to Spotify</button>*/ } 
      <SpotifyGetPlaylists></SpotifyGetPlaylists>
    </div>
  );
};

export default WebApp;
