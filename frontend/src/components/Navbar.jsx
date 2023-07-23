import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../redux/actions/authActions';
import './styles/Navbar.css'; // Import the CSS file

const Navbar = () => {
  const authState = useSelector(state => state.authReducer);
  const dispatch = useDispatch();
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  }

  const handleLogoutClick = () => {
    dispatch(logout());
  }

  return (
    <>
      <header className={`navbar ${isNavbarOpen ? '' : 'transparent'}`}>
        <h1 className="cursor-pointer font-medium plan-ahead">
          <Link to="/">PlanAhead</Link>
        </h1>
        {authState.isLoggedIn && (
          <h1 className="navbar-welcome">{authState.user.name}</h1>
        )}
        <ul className="hidden md:flex gap-4 uppercase font-medium">
          {authState.isLoggedIn ? (
            <>
              <li className="navbar-link" style={{ background: '#25274D' }}>
                <Link to="/tasks/add" className="block w-full h-full px-4 py-2">
                  <i className="fa-solid fa-plus"></i> Add task
                </Link>
              </li>
              <li className="logout py-2 px-3 cursor-pointer" onClick={handleLogoutClick}>
                Logout
              </li>
            </>
          ) : (
            <li className="navbar-link py-2 px-3 cursor-pointer">
              <Link to="/login">Login</Link>
            </li>
          )}
        </ul>
        <span className="md:hidden cursor-pointer" onClick={toggleNavbar}>
          <i className="fa-solid fa-bars"></i>
        </span>

        {/* Navbar displayed as sidebar on smaller screens */}
        <div className={`sidebar ${isNavbarOpen ? '' : 'hide'}`}>
          <div className="flex">
            <span className="close-icon" onClick={toggleNavbar}>
              <i className="fa-solid fa-xmark"></i>
            </span>
          </div>
          <ul>
            {authState.isLoggedIn ? (
              <>
                <li style={{ background: '#25274D' }}>
                  <Link to="/tasks/add" className="block w-full h-full">
                    <i className="fa-solid fa-plus"></i> Add task
                  </Link>
                </li>
                <li className="logout" onClick={handleLogoutClick}>
                  Logout
                </li>
              </>
            ) : (
              <li>
                <Link to="/login">Login</Link>
              </li>
            )}
          </ul>
        </div>
      </header>
    </>
  );
}

export default Navbar;
