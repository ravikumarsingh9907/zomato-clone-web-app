import { useState, useEffect } from "react";
import { profileContext } from "./profile-context";
import { useParams } from "react-router";

export default function ProfileContext(props) {
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [updatedProfile, setUpdatedProfile] = useState(null);
    const {id} = useParams();

    useEffect(() => {
        (async () => {
            const getPorfilePictureResponse = await fetch(`http://localhost:3333/users/${id}/avatar`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (getPorfilePictureResponse.status !== 400) {
                setProfilePhoto(getPorfilePictureResponse.url);
            }
        })();
        // eslint-disable-next-line
    }, [profilePhoto]);

    const handleProfilePicture = async (data) => {
        const uploadProfilePic = await fetch('http://localhost:3333/users/me/avatar', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: data
        });
        const result = await uploadProfilePic.json();
        setProfilePhoto(result);
    }

    const handleRemoveProfilePhoto = async () => {
        const removeProfilePic = await fetch('http://localhost:3333/users/me/avatar', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const result =  await removeProfilePic.json();
        setProfilePhoto(result);
    }

    const handleProfileUpdate = async (data) => {
        const getProfilePic = await fetch('http://localhost:3333/users/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const result =  await getProfilePic.json();
        setUpdatedProfile(result);
    }

    const profileData = {
        handleProfilePicture,
        handleRemoveProfilePhoto,
        profilePhoto,
        handleProfileUpdate,
        updatedProfile,
    }

    return (
        <profileContext.Provider value={profileData}>
            {props.children}
        </profileContext.Provider>
    )
}