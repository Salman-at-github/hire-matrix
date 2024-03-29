import React, { useEffect, useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { FaHireAHelper } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  // Close the menu automatically when the page changes
  const location = useLocation();
  const path = location.pathname;
  useEffect(() => {
    setShowMenu(false);
  }, [path]);

  const navigateTo = useNavigate()

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
      <div className="container mx-auto flex justify-between items-center md:px-2">
        {/* Brand Logo */}
        <div>
          <Link
            to="/"
            className="flex justify-center cursor-pointer items-center text-white md:text-2xl font-semibold"
          >
            <FaHireAHelper className="text-2xl md:text-4xl text-black bg-white" />ireM
            <span className="text-black">atrix</span>
          </Link>
        </div>

        {/* User Info */}
        <div
          className="flex items-center space-x-4 relative"
          onMouseOver={() => setShowMenu(true)}
          onMouseOut={() => setShowMenu(false)}
        >
          {/* User Icon (replace with your own user icon) */}
          {user ? (
            user.photoURL ? (
              <div className="group">
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-8 h-8 rounded-full cursor-pointer"
                />
              </div>
            ) : (
              <div className={`block ${auth?.currentUser? "text-green-300 bg-blue-800" : "bg-white"} p-2 rounded-full cursor-pointer`}>
                <FaRegUser className={``}/>
              </div>
            )
          ) : (
            <div className="block bg-white p-2 rounded-full cursor-pointer">
              <FaRegUser />
            </div>
          )}
          {showMenu && user && (
            <ul className="absolute -top-2 -right-2 bg-blue-950 text-blue-400  rounded-md mt-2 space-y-2 px-5 py-2 shadow-md overflow-x-hidden w-52 flex justify-center items-start flex-col ">
              {user && user.displayName ? (
                <li className="w-full p-2 border-b border-white text-lg">
                  <span className=" text-cyan-200">
                    {user.displayName.length < 12
                      ? user.displayName
                      : user.displayName.slice(0, 13) + ".."}
                  </span>
                </li>
              ) : (
                <li className="w-full p-2 border-b border-white text-lg hover:cursor-pointer">
                  <span className="text-cyan-200">
                    {user && user.email && user.email.length <= 13
                      ? user.email
                      : user.email && user.email.slice(0, 12) + ".."}
                  </span>
                </li>
              )}
              <li>
                <Link
                  to="/"
                  className="block font-semibold hover:scale-110 hover:text-white px-4 py-2"
                >
                  Jobs List
                </Link>
              </li>
              <li>
                <Link
                  to="/#"
                  className="block font-semibold hover:scale-110 hover:text-white px-4 py-2"
                >
                  Settings
                </Link>
              </li>

              <li>
                <button
                  onClick={() => {
                    auth.signOut().then(()=>{navigateTo("/login")});
                  }}
                  className="block font-semibold hover:scale-110 hover:text-white px-4 py-2"
                >
                  Logout
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
