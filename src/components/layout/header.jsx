import React, { useEffect, useState } from 'react';
import './layout.css';
import { FaUserCircle } from 'react-icons/fa';
import { addUserDetails, fetchUserDetails, updateUserDetails } from '../../api/user'; // ← Make sure checkInUser exists
import UserProfile from '../userProfile/UserProfileCantainer';
import { Button } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

const Header = () => {
    const userId = sessionStorage.getItem('userId');

    const [userDetails, setUserDetails] = useState({});
    const [openUserPopup, setOpenUserPopup] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        loadUserDetails();
    }, []);

    useEffect(() => {
        if (userDetails?.is_checked) {

            const interval = setInterval(() => {
                setCurrentTime(new Date());
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [userDetails]);

    const loadUserDetails = async () => {
        const result = await fetchUserDetails(userId);
        if (result?.success) {
            setUserDetails(result.data);
            if (!result?.data?.name) {
                setOpenUserPopup(true);
            }
        }
    };

    const handleSaveUserDetails = async (formData) => {
        formData.user_id = userId;
        let result;
        if (formData?.id) {
            result = await updateUserDetails(formData?.id, formData);
        } else {
            result = await addUserDetails(formData);
        }
        if (result.success) {
            setOpenUserPopup(false);
            loadUserDetails()
        }
    };

    const handleCheckIn = async () => {
        const formData = { ...userDetails };

        if (formData?.is_checked) {

            formData.check_in = null;
            formData.is_checked = false;

            const result = await updateUserDetails(formData?.id, formData);
            if (result.success) {
                loadUserDetails();
            }

        } else {
            // User is not checked in → perform Check-In
            formData.check_in = new Date().toLocaleString();
            formData.is_checked = true;

            const result = await updateUserDetails(formData?.id, formData);
            if (result.success) {
                loadUserDetails();
            }
        }
    };

    const getElapsedTime = (checkInTime) => {
        if (!checkInTime) return '00:00:00';

        const diffMs = new Date() - new Date(checkInTime);

        const totalSeconds = Math.floor(diffMs / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const pad = (n) => n.toString().padStart(2, '0');
        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    };


    const formatUTCToLocal = (utcTime) => {
        if (!utcTime) return '';
        return new Date(utcTime).toLocaleString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };


    return (
        <>
            <header className="header">
                <div className="spacer">

                    {/* Check-In Button */}
                    <Button
                        className={userDetails?.is_checked ? 'checkin-button-checked' : 'checkin-button-unchecked'}
                        onClick={handleCheckIn}
                    >
                        <CheckCircleOutlined style={{ marginRight: 8 }} />
                        {userDetails?.is_checked
                            ? `Check - Out • ${formatUTCToLocal(userDetails.check_in)} (${getElapsedTime(userDetails.check_in)} hrs)`
                            : 'Check - In'}
                    </Button>
                </div>



                {/* Profile Section */}
                <div className="profile-section" onClick={() => setOpenUserPopup(true)}>
                    <FaUserCircle className="profile-icon" />
                    <div className="user-info">
                        <div className="user-name">{userDetails?.name ?? ''}</div>
                    </div>
                </div>
            </header>

            {/* UserProfile Modal */}
            {openUserPopup &&
                <UserProfile
                    isOpen={openUserPopup}
                    onSave={handleSaveUserDetails}
                    userDetails={userDetails}
                    setOpenUserPopup={setOpenUserPopup}
                />
            }
        </>
    );
};

export default Header;
