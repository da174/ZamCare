import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope } from "react-icons/fa";
import React from "react";

const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-blue-700 to-blue-500 text-white py-8">
            <div className="container mx-auto px-4 flex flex-col lg:flex-row justify-between items-center">
                {/* Brand Section */}
                <div className="text-center lg:text-left mb-6 lg:mb-0">
                    <h2 className="text-2xl font-extrabold tracking-wide">ZamCare</h2>
                    <p className="text-sm mt-2">Helping children, building futures.</p>
                </div>

                {/* Navigation Links */}
                <nav className="flex flex-wrap justify-center lg:justify-start space-x-6 text-sm font-medium mb-6 lg:mb-0">
                    <Link to="/home" className="hover:text-gray-200">
                        Home
                    </Link>
                    <Link to="/volunteer" className="hover:text-gray-200">
                        Volunteer
                    </Link>
                    <Link to="/donate" className="hover:text-gray-200">
                        Donate
                    </Link>
                    <Link to="/contact" className="hover:text-gray-200">
                        Contact
                    </Link>
                </nav>

                {/* Social Media Icons */}
                <div className="flex space-x-4">
                    <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gray-200"
                        aria-label="Facebook"
                    >
                        <FaFacebook size={24} />
                    </a>
                    <a
                        href="https://twitter.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gray-200"
                        aria-label="Twitter"
                    >
                        <FaTwitter size={24} />
                    </a>
                    <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gray-200"
                        aria-label="Instagram"
                    >
                        <FaInstagram size={24} />
                    </a>
                    <a
                        href="mailto:support@zamcare.com"
                        className="hover:text-gray-200"
                        aria-label="Email"
                    >
                        <FaEnvelope size={24} />
                    </a>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="mt-8 border-t border-blue-400 pt-4 text-center text-sm">
                <p className="text-gray-300">
                    &copy; {new Date().getFullYear()} <span className="font-bold">ZamCare</span>. All rights reserved.
                </p>
                <p className="mt-2">
                    Built with ❤️ by the ZamCare team.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
