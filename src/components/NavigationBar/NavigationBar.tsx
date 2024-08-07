import { Link } from 'react-router-dom';
import './NavigationBar.css'; 
import * as ROUTES from "../../constants/routes";
function NavigationBar() {
  return (
    <header className='NavigationBar'>
      <nav>
        <ul className='nav-list'>
          <li className='nav-item'>
            <Link to={ROUTES.HOME}>Home</Link>
          </li>
          <li className='nav-item'>
            <Link to={ROUTES.SIGN_UP}>Profile</Link>
          </li>
          <li className='nav-item'>
            <Link to={ROUTES.PLAY_LIST}>PlayList</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default NavigationBar;
