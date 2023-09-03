import './editProfile.scss';
import profileImg from '../../Asset/user-profile.svg';
import { useContext, useRef, useState } from 'react';
import { formContext } from '../../Context/form-context';
import { profileContext } from '../../Context/profile-context';

export default function EditProfile() {
    const [editIsOpen, setEditIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { editProfileForm, setEditProfileForm } = useContext(formContext);
    const profileRef = useRef();
    const { profilePicture,
            profile,
            handleProfilePicture,
            handleRemoveProfilePhoto,
            credentialErrorMessage,
            isCorrectCredential,
            setIsCorrectCredential,
            handleProfileUpdate } = useContext(profileContext);
    const [input, setInput] = useState({ fullname: profile.fullname, phone: profile.phone });

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
        await handleProfilePicture(formData);
        setIsLoading(false);
    }

    const handleRemoveProfile = async (e) => {
        setIsLoading(true)
        await handleRemoveProfilePhoto();
        setIsLoading(false);
    }

    const handleFormVisibility = () => {
        setEditProfileForm('hidden');
    }

    const handleOnChangeProfileInfo = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value })
    }

    const updateFormData = async (e) => {
        e.preventDefault();

        setIsLoading(true);
        const updateInfo = await fetch('https://foodie-api-nine.vercel.app/users/me', {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fullname: input.fullname, phone: input.phone }),
        });

        const result = await updateInfo.json();
        if (result.user) {
            handleProfileUpdate(result.user);
            setIsLoading(false);
        } else {
            setIsCorrectCredential(true);
            setIsLoading(false);
        }
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
                        <button className='delete-photo btn' onClick={handleRemoveProfile}>Remove Photo</button>
                    </div>}
                </div>
                <form className='details-container'>
                    <div className='list name'>
                        <label htmlFor='name'>Name</label>
                        <input id='name' name='fullname' type='text' value={input.fullname} onChange={handleOnChangeProfileInfo} />
                    </div>
                    <div className='list number'>
                        <label htmlFor='number'>Mobile number</label>
                        <input id='number' name='phone' type='number' value={input.phone} onChange={handleOnChangeProfileInfo} />
                    </div>
                    <div className='list btn-container'>
                        {isLoading ? <button className='btn'><i class='bx bx-loader-alt loader'></i></button> : <button className='btn' type='submit' onClick={updateFormData}>Update</button>}
                    </div>
                </form>
            </div>
            <div className='overlay'></div>
        </div >
    )
}