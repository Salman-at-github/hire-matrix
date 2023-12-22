import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaHireAHelper } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-600 to-indigo-600 text-gray-300 py-8 md:relative">
        <div className='hidden md:block'>
        <div className='absolute top-14 left-10'>
          <Link
            to="/"
            className="flex justify-center cursor-pointer items-center text-white md:text-2xl font-semibold"
          >
            <FaHireAHelper className="text-2xl md:text-4xl text-black bg-white" />ireM
            <span className="text-black">atrix</span>
          </Link>
        </div>
        </div>
      <div className="container mx-auto flex flex-col items-center">
        <div className="flex space-x-4 mb-4">
          <a href="/" className="hover:text-white hover:scale-105">
            <FaFacebook size={24} />
          </a>
          <a href="/" className="hover:text-white hover:scale-105">
            <FaTwitter size={24} />
          </a>
          <a href="/" className="hover:text-white hover:scale-105">
            <FaInstagram size={24} />
          </a>
          <a href="/" className="hover:text-white hover:scale-105">
            <FaLinkedin size={24} />
          </a>
          <a href="/" className="hover:text-white hover:scale-105">
            <FaEnvelope size={24} />
          </a>
        </div>
        <p className="text-sm mb-4">Connect with us on social media for the latest updates!</p>
        <p className="text-xs">&copy; {new Date().getFullYear()} HireMatrix. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
