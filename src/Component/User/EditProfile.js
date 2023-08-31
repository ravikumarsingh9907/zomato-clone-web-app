import { useLoaderData } from 'react-router';
import './editProfile.scss';
import profileImg from '../../Asset/user-profile.svg';
import { useContext, useRef, useState } from 'react';
import { formContext } from '../../Context/form-context';

export default function EditProfile() {
    const [editIsOpen, setEditIsOpen] = useState(false);
    const { profile, profilePicture, } = useLoaderData();
    const [credentialErrorMessage, setCredentialErrorMessage] = useState({ 'color': '#ff00006e' });
    const [isCorrectCredential, setIsCorrectCredential] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { editProfileForm, setEditProfileForm } = useContext(formContext)
    const profileRef = useRef();

    const handleAlertClick = () => {
        setIsCorrectCredential(!isCorrectCredential)
    }

    const handleIsOpenToggling = () => {
        setEditIsOpen(!editIsOpen);
    }

    const handleChangePhotoClick = () => {
        if (profileRef.current) {
            profileRef.current.click();
        }
    }

    const handleFileInput = async (e) => {
        const selectedFile = e.target.files[0];
        const formData = new FormData();
        formData.append('avatar', selectedFile);

        setIsLoading(true)
        const uploadProfilePic = await fetch('http://localhost:3300/users/me/avatar', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        });

        const result = await uploadProfilePic.json();
        if (!result.data) {
            setCredentialErrorMessage({ ...credentialErrorMessage, data: result });
        } else {
            setCredentialErrorMessage({ ...credentialErrorMessage, color: 'green', data: result.data });
        }
        setIsCorrectCredential(true);
        setIsLoading(false);
    }

    const handleRemoveProfilePhoto = async (e) => {
        setIsLoading(true)
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
            setCredentialErrorMessage({ ...credentialErrorMessage, color: 'green', data: result.data });
        }
        setIsCorrectCredential(true);
        setIsLoading(false);
    }

    const handleFormVisibility = () => {
        console.log('hello');
        setEditProfileForm('hidden');
    }

    return (
        <div className={editProfileForm}>
            <div className='edit-profile-container'>
                <div className='close-btn'>
                    <i class='bx bx-x' onClick={handleFormVisibility}></i>
                </div>
                {isCorrectCredential && <div className='alert-error' style={{ backgroundColor: credentialErrorMessage.color }}>
                    <p className='alert-name'>{credentialErrorMessage.data}</p>
                    <span className="material-symbols-outlined" onClick={handleAlertClick}>close</span>
                </div>}
                <div className='image-container'>
                    <div className='image'>
                        {isLoading ? <div className='img-overlay'><i class='bx bx-loader-alt loader'></i></div> : <div className='img-overlay'><i class='bx bxs-camera-plus' onClick={handleIsOpenToggling}></i></div>}
                        <img src={profilePicture ? profilePicture : profileImg} alt='profile-img' />
                    </div>
                    {editIsOpen && !isLoading && <div className='edit-delete-profile-picture-container'>
                        <button className='change-photo btn' onClick={handleChangePhotoClick}>Change Photo</button>
                        <input id='progile-img' type='file' className='edit-profile' style={{ display: 'none' }} ref={profileRef} onChange={handleFileInput} />
                        <button className='delete-photo btn' onClick={handleRemoveProfilePhoto}>Remove Photo</button>
                    </div>}
                </div>
                <form className='details-container'>
                    <div className='list name'>
                        <label htmlFor='name'>Name</label>
                        <input id='name' type='text' value={profile.fullname} />
                    </div>
                    <div className='list number'>
                        <label htmlFor='number'>Mobile number</label>
                        <input id='number' type='number' value={profile.phone} />
                    </div>
                    <div className='list btn-container'>
                        <button className='bnt'>Update</button>
                    </div>
                </form>
            </div>
            <div className='overlay'></div>
        </div >
    )
}