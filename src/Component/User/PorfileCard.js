import './profileCard.scss';
import profileImg from '../../Asset/user-profile.svg';
import { useLoaderData, useNavigation } from 'react-router';
import { useContext, useEffect, useState } from 'react';
import { Form } from 'react-router-dom';
import { formContext } from '../../Context/form-context';

export default function ProfileCard({ edit, data }) {
    const { setEditProfileForm } = useContext(formContext)
    const [isFollow, setIsFollow] = useState(false);
    let { profile, profilePicture, reviews } = useLoaderData();
    const [style, setStyle] = useState('100%');
    const [totalPhotosPosted, setTotalPhotosPosted] = useState(0);
    const navigation = useNavigation();

    useEffect(() => {
        let count = 0;
        reviews && reviews.forEach(review => {
            review.images.forEach((image) => {
                count += 1;
            });
        });

        setTotalPhotosPosted(count);
        //eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (navigation.state === 'submitting' || navigation.state === 'loading') {
            setStyle('60%');
        } else {
            setStyle('100%');
        }
    }, [navigation]);

    useEffect(() => {
        data && data.users && profile.followers.forEach(follower => {
            if (follower.email === data.users.email) {
                return setIsFollow(true);
            }
        });

        !profile.followers.length && setIsFollow(false);
    }, [profile, data]);

    const handleFormVisivility = () => {
        setEditProfileForm('edit-profile-wrapper');
    }

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
                    </div>
                </div>
                <div className='profile-followers-reviews-edit-container'>
                    <div className='edit-profile'>
                        {!edit ? <button className='edit' onClick={handleFormVisivility}>
                            <i className='bx bxs-edit'></i>
                            <span>Edit profile</span>
                        </button>
                            : !isFollow ? <Form method='post'>
                                <button className='edit' style={{ opacity: style }}>
                                    {navigation.state === 'submitting' ? <i className='bx bx-loader-alt loader'></i> : <i className='bx bx-plus'></i>}
                                    <span> Follow </span></button>
                            </Form>
                                : <Form method='delete'>
                                    <button className='edit' style={{ opacity: style }}>
                                        {navigation.state === 'submitting' ? <i className='bx bx-loader-alt loader'></i> : ''}
                                        <span>Following</span></button>
                                </Form>}
                    </div>
                    <div className='following-followers'>
                        <p className='reviews list'>
                            <span className='count'>{reviews && reviews.length}</span>
                            <span className='name'>Reviews</span>
                        </p>
                        <p className='photos list'>
                            <span className='count'>{totalPhotosPosted}</span>
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