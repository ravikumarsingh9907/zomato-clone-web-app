import { useEffect, useState } from "react";
import { profileContext } from "./profile-context";
import { useParams, redirect, useNavigation } from "react-router";
import UniversalLoader from '../Component/Layout/PreLoader';

export default function ProfileContext(props) {
    const [profile, setProfile] = useState({fullname: '', phone: ''});
    const [profilePicture, setProfilePicture] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCorrectCredential, setIsCorrectCredential] = useState(false);
    const [credentialErrorMessage, setCredentialErrorMessage] = useState({ 'color': '#ff00006e' });
    const { id } = useParams();
    const navigation = useNavigation();

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            if(window?.location?.pathname?.startsWith('/user') || navigation.location?.pathname?.startsWith('/user')) {
                console.log(id);
                const profileResponse = await fetch(`http://localhost:3300/users/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
                });

                const profile = await profileResponse.json();
                    if (profile.error) {
                    return redirect(`/user/${id}/reviews`)
                } else {
                    setProfile(profile);
                }

                const profilePictureResponse = await fetch(`http://localhost:3300/users/me/avatar`, {
                    method: 'GET',
                    headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (profilePictureResponse.status !== 400) {
                    setProfilePicture(profilePictureResponse.url);
                    setIsLoading(false);
                } else {
                    setIsLoading(false);
                }
            } else {
                const profileResponse = await fetch('http://localhost:3300/users/me', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
                });

                const profile = await profileResponse.json();
                    if (profile.error) {
                    return redirect(`/user/${id}/reviews`)
                } else {
                    setProfile(profile);
                }

                const profilePictureResponse = await fetch(`http://localhost:3300/users/${id}/avatar`, {
                    method: 'GET',
                });

                if (profilePictureResponse.status !== 400) {
                    setProfilePicture(profilePictureResponse.url);
                    setIsLoading(false);
                } else {
                    setIsLoading(false);
                }
            }
        })();
        //eslint-disable-next-line
    }, [credentialErrorMessage, navigation]);

    const handleProfilePicture = async (data) => {
        const uploadProfilePic = await fetch('http://localhost:3300/users/me/avatar', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: data
        });

        const result = await uploadProfilePic.json();
        if (!result.data) {
            setCredentialErrorMessage({ ...credentialErrorMessage, data: result });
        } else {
            setCredentialErrorMessage({ ...credentialErrorMessage, color: 'green', data: result.data });
        }
    }

    const handleRemoveProfilePhoto = async () => {
        const removeProfilePic = await fetch('http://localhost:3300/users/me/avatar', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const result = await removeProfilePic.json();

        if (!result.data) {
            setCredentialErrorMessage({ ...credentialErrorMessage, data: result });
        } else {
            setProfilePicture(null);
            setCredentialErrorMessage({ ...credentialErrorMessage, color: 'green', data: result.data });
        }
    }

    const handleProfileUpdate = (data) => {
        setProfile(data)
    }

    const profileData = {
        profile,
        profilePicture,
        handleProfilePicture,
        credentialErrorMessage,
        handleRemoveProfilePhoto,
        setIsCorrectCredential,
        isCorrectCredential,
        handleProfileUpdate,
    }

    return (
        <profileContext.Provider value={profileData}>
            {isLoading && !profilePicture ? <UniversalLoader /> : isLoading && profilePicture ? <><div></div>{props.children}</> : props.children}
        </profileContext.Provider>
    )
}