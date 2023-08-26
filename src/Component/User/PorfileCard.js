import './profileCard.scss';
import profileImg from '../../Asset/user-profile.svg';
import { useLoaderData, useNavigation } from 'react-router';
import { useEffect, useState } from 'react';
import { Form } from 'react-router-dom';

export default function ProfileCard({edit, data}) {
    const [isFollow, setIsFollow] = useState(false);
    let { profile, profilePicture } = useLoaderData();
    const [style, setStyle] = useState('100%');
    const navigation = useNavigation();

    useEffect(() => {
        if(navigation.state === 'submitting' || navigation.state === 'loading') {
            setStyle('60%');
        } else {
            setStyle('100%');
        }
    }, [navigation]);

    useEffect(() => {
        data && data.users && profile.followers.forEach(follower => {
            if(follower.email === data.users.email) {
                return setIsFollow(true);
            }
        });

        !profile.followers.length && setIsFollow(false);
    }, [profile, data]);

    return (
        <div className='profile-card-wrapper'>
            <div className='profile-card-container'>
                <div className='profile-image-name-container'>
                    <div className='image-container'>
                        <div className='image'>
                            <img src={profilePicture || profileImg} alt='profile-img' />
                        </div>
                    </div>
                    <div className='name-container'>
                        <p className='name'>{profile.fullname}</p>
                        {/* <p className='place'> */}
                            {/* <span className="material-symbols-outlined">location_on</span> */}
                            {/* <span>City, State</span> */}
                        {/* </p> */}
                    </div>
                </div>
                <div className='profile-followers-reviews-edit-container'>
                    <div className='edit-profile'>
                        { !edit ? <button className='edit'>
                            <i className='bx bxs-edit'></i>
                            <span>Edit profile</span>
                        </button> 
                            : !isFollow ? <Form method='post'>
                                <button className='edit' style={{opacity: style}}>
                                {navigation.state === 'submitting' ? <i className='bx bx-loader-alt loader'></i> : <i className='bx bx-plus'></i>}
                                <span> Follow </span></button>
                            </Form> 
                            : <Form method='delete'>
                                <button className='edit' style={{opacity: style}}>
                                {navigation.state === 'submitting' ? <i className='bx bx-loader-alt loader'></i> : ''}
                                <span>Following</span></button>
                            </Form> }
                    </div>
                    <div className='following-followers'>
                        <p className='reviews list'>
                            <span className='count'>0</span>
                            <span className='name'>Reviews</span>
                        </p>
                        <p className='photos list'>
                            <span className='count'>0</span>
                            <span className='name'>Photos</span>
                        </p>
                        <p className='followers list'>
                            <span className='count'>{profile.followers && profile.followers.length}</span>
                            <span className='name'>Followers</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}