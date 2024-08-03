import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import * as ROUTES from"./constants/routes"
import "./App.css";
import NavigationBar from "./components/NavigationBar";
import Hero from "./components/Hero";
import SignupForm from "./components/Sign-Up";

function App() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path= {ROUTES.SIGN_UP} Component={SignupForm} element={<h1>Welcome</h1>} />
        <Route path= {ROUTES.HOME} Component={Hero}/>
      </Routes>
    </Router>
  );
}

export default App;
