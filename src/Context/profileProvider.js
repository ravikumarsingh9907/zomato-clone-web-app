import { useState, useEffect } from "react";
import { profileContext } from "./profile-context";
import { useParams } from "react-router";
import { deleteData, fetchData, fetchDataMultipart, postData } from "../Utilities/api";

export default function ProfileContext(props) {
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [updatedProfile, setUpdatedProfile] = useState(null);
    const {id} = useParams();

    useEffect(() => {
        (async () => {
            const getPorfilePictureResponse = await fetchDataMultipart(`/users/${id}/avatar`, {
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
        const result = await postData('/users/me/avatar', data, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        });

        setProfilePhoto(result);
    }

    const handleRemoveProfilePhoto = async () => {
        const result = await deleteData('/users/me/avatar', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        setProfilePhoto(result);
    }

    const handleProfileUpdate = async (data) => {
        const result = await fetchData('/users/me', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
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