import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
     return (
          <nav className="bg-blue-600 p-4 text-white">
               <div className="container mx-auto flex justify-between items-center">
                   
                    <div className="space-x-4">
                         <Link to="/" className="hover:underline">Home</Link>
                         <Link to="/profiles" className="hover:underline">Profiles</Link>
                         <Link to="/donate" className="hover:underline">Donate</Link>
                         <Link to="/volunteer" className="hover:underline">Volunteer</Link>
                         <Link to="/login" className="hover:underline">Login</Link>
                         <Link to="/signup" className="hover:underline">Signup</Link>
                    </div>
               </div>
          </nav>
     );
}

export default Navbar;
