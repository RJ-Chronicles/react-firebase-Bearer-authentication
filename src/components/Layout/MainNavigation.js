import { Link } from 'react-router-dom';
import { useContext } from 'react';
import classes from './MainNavigation.module.css';
import AuthContext from '../../store/auth-context';

const MainNavigation = () => {
  const authContext = useContext(AuthContext)
  const isLoggedIn = authContext.isLoggedIn;

  const handleLogout = ()=>{
    authContext.logout();
  }
  return (
    <header className={classes.header}>
      <Link to='/'>
        <div className={classes.logo}>React Auth</div>
      </Link>
      <nav>
        <ul>
          {!isLoggedIn &&
            <li>
              <Link to='/auth'>Login</Link>
            </li>
          }
          {isLoggedIn &&
            <li>
              <Link to='/profile'>Profile</Link>
            </li>
          }
          {isLoggedIn &&
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          }
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
