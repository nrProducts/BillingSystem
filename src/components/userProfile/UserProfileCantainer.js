// src/components/UserDetailsPopup.js
import React, { useEffect, useState } from 'react';
import './UserProfile.css';
import UserProfile from './UserProfile';

const UserProfileContainer = ({ isOpen, onSave, userDetails, setOpenUserPopup }) => {

    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (isOpen) {
            setFormData(userDetails)
            console.info(isOpen, 'use');
        }
    }, [isOpen])

    console.info(isOpen, 'isOpen');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            billImage: e.target.files[0],
        }));
    };

    const handleSave = () => {
        // Validation can be added here if needed
        onSave(formData);
    };

    return <UserProfile setOpenUserPopup={setOpenUserPopup} isOpen={isOpen} handleSave={handleSave} handleFileChange={handleFileChange} handleChange={handleChange} formData={formData} />;
};

export default UserProfileContainer;
