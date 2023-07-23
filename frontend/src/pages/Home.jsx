import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Tasks from '../components/Tasks';
import MainLayout from '../layouts/MainLayout';
import './Home.css';
const Home = () => {
  const authState = useSelector((state) => state.authReducer);
  const { isLoggedIn } = authState;

  useEffect(() => {
    document.title = authState.isLoggedIn
      ? `${authState.user.name}'s tasks`
      : 'Task Manager';
  }, [authState]);

  return (
    <>
      <MainLayout>
       
        {!isLoggedIn ? (
          <div className="give_background">
          <div
         className="text-white py-8 flex flex-col justify-center items-center min-h-screen home-text"


          >
            <h1 className="home-text"> Welcome to Task Manager App</h1>
            <Link
              to="/signup"
              className="mt-10 text-xl block space-x-2 hover:space-x-4"
            >
              <span className="transition-[margin] task-2">
                Join now to manage your tasks
              </span>
              <span className="relative ml-4 text-base transition-[margin]">
                <i className="fa-solid fa-arrow-right"></i>
              </span>
            </Link>
          </div>
          </div>
        ) : (
          <>
            <Tasks />
          </>
          
        )}
     
        
      </MainLayout>
    </>
  );
};

export default Home;
