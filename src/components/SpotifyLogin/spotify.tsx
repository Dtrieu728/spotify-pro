import React, { useState, useEffect } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import "./spotify.css";

const spotifyApi = new SpotifyWebApi();
const clientId = import.meta.env.VITE_SPOTIFY_ID;
const redirectUri = "http://localhost:5173/spotify-pro/signup";

interface NowPlaying {
  name: string;
  albumArt: string;
  artist: string;
  popular: number;
}

interface CurrentUsersProfileResponse {
  id: string;
  display_name?: string;
  email?: string;
  images?: { url: string }[];
}

interface PlaybackState {
  item: {
    name: string;
    album: {
      images: { url: string }[];
    };
    artists: { name: string }[];
    popularity: number;
  } | null;
}

// Utility functions to handle OAuth2 flow
const generateCodeVerifier = (): string => {
  const array = new Uint32Array(56 / 2);
  window.crypto.getRandomValues(array);
  return Array.from(array, (dec) => ('0' + dec.toString(16)).substr(-2)).join('');
}

const generateCodeChallenge = async (codeVerifier: string): Promise<string> => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(codeVerifier));
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

const getToken = (): Record<string, string> => {
  return window.location.search.substring(1).split("&").reduce((initial: Record<string, string>, item) => {
    const parts = item.split("=");
    initial[parts[0]] = decodeURIComponent(parts[1]);
    return initial;
  }, {});
}

const redirectToAuthCodeFlow = async (clientId: string, redirectUri: string) => {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  localStorage.setItem('code_verifier', codeVerifier);

  const state = 'some_random_state'; // Generate a random state for CSRF protection
  const scope = 'user-read-playback-state user-read-currently-playing';

  const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}&state=${state}&code_challenge_method=S256&code_challenge=${codeChallenge}`;
  window.location.href = authUrl;
}

const getAccessToken = async (clientId: string, code: string, redirectUri: string): Promise<string> => {
  const codeVerifier = localStorage.getItem('code_verifier')!;
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier
    })
  });

  const data = await response.json();
  return data.access_token;
}

const Spotify: React.FC = () => {
  const [spotifyToken, setSpotifyToken] = useState<string>("");
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const params = getToken();
    const code = params.code;

    if (!code) {
      // Check if the user has been redirected for authentication
      if (!localStorage.getItem('redirected')) {
        localStorage.setItem('redirected', 'true');
        redirectToAuthCodeFlow(clientId, redirectUri);
      }
    } else {
      getAccessToken(clientId, code, redirectUri).then((token) => {
        if (token) {
          setSpotifyToken(token);
          spotifyApi.setAccessToken(token);
          spotifyApi.getMe().then((user: CurrentUsersProfileResponse) => {
            console.log('User Info:', user);
            setLoggedIn(true);
          }).catch(error => console.error('Error fetching user info:', error));
        }
      }).catch(error => console.error('Error getting access token:', error));
    }
  }, []);

  const getNowPlaying = () => {
    if (!spotifyToken) {
      console.error('No Spotify token available');
      return;
    }

    spotifyApi.getMyCurrentPlaybackState().then((response: PlaybackState) => {
      console.log('Playback State:', response);
      if (response.item) {
        setNowPlaying({
          name: response.item.name,
          albumArt: response.item.album.images[0].url,
          artist: response.item.artists[0].name,
          popular: response.item.popularity
        });
      } else {
        setNowPlaying(null);
        console.log('No track is currently playing');
      }
    }).catch(error => console.error('Error fetching playback state:', error));
  };

  return (
    <div className='spotify'>
      <div className='spotify-content'>
        <h1 style={{margin:"20px"}}><b>Spotify API project site</b></h1>
        {!loggedIn && <a className='login' href='#' onClick={() => redirectToAuthCodeFlow(clientId, redirectUri)}>Login to Spotify</a>}
        {loggedIn && nowPlaying && (
          <>
            <div style={{fontSize:"20px"}}>Now Playing: {nowPlaying.artist}, {nowPlaying.name}</div>
            <div>Popularity: {nowPlaying.popular}</div>
            <div>
              <img src={nowPlaying.albumArt} style={{ height: 250}} alt="Album Art" />
            </div>
          </>
        )}
        {loggedIn && (
          <button onClick={getNowPlaying}>Check Now Playing</button>
        )}
      </div>
    </div>
  );
};

export default Spotify;
