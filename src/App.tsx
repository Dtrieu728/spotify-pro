import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import * as ROUTES from"./constants/routes"
import "./App.css";
import NavigationBar from "./components/NavigationBar/NavigationBar.tsx";
import Hero from "./components/Hero"; 
import WebApp from "./components/WebApp/webApp.tsx";
import Spotify from "./components/SpotifyLogin/Spotify/spotify.tsx";

function App() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path= {ROUTES.SIGN_UP} Component={Spotify} element={<h1>Welcome</h1>} />
        <Route path= {ROUTES.HOME} Component={Hero}/>
        <Route path= {ROUTES.PLAY_LIST} Component={WebApp}/>
      </Routes>
    </Router>
  );
}

export default App;
