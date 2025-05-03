import React from 'react';
import './layout.css';
import { FaUserCircle } from 'react-icons/fa';

const Header = () => {
    const emailId = sessionStorage.getItem('emailId');
    return (
        <header className="header">
            <div className="spacer" />
            <div className="profile-section">
                <FaUserCircle className="profile-icon" />
                <div className="user-info"> {/* Parent div wrapping name & role */}
                    <div className="user-name">{emailId}</div>
                    {/* <div className="user-role">Admin</div> */}
                </div>
            </div>
        </header>
    );
};

export default Header;
