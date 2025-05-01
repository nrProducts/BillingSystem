import React from 'react';
import './layout.css';
import { FaUserCircle } from 'react-icons/fa';

const Header = () => {
    return (
        <header className="header">
            <div className="spacer" /> {/* Empty spacer to push profile to right */}
            <div className="profile-section">
                <FaUserCircle className="profile-icon" />
                <div className="user-details">
                    <div className="user-name">Nithin P</div>
                    <div className="user-role">Admin</div>
                </div>
            </div>
        </header>

    );
};

export default Header;
