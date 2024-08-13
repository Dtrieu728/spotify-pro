import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import * as ROUTES from './constants/routes';
import './App.css';
import NavigationBar from './components/NavigationBar/NavigationBar';
import Hero from './components/Hero';
import WebApp from './components/WebApp/webApp';
import Spotify from './components/SpotifyLogin/Spotify/spotify';
import { SpotifyProvider } from './components/SpotifyLogin/Spotify/SpotifyContext'; // Import the provider

function App() {
  return (
    <Router>
      <SpotifyProvider> {/* Wrap your routes with the provider */}
        <NavigationBar />
        <Routes>
          <Route path={ROUTES.SIGN_UP} element={<Spotify />} />
          <Route path={ROUTES.HOME} element={<Hero />} />
          <Route path={ROUTES.PLAY_LIST} element={<WebApp />} />
        </Routes>
      </SpotifyProvider>
    </Router>
  );
}

export default App;
