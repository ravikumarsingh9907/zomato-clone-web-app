import './followingFollowers.scss';
import profileImg from '../../../Asset/user-profile.svg';
import { Form, Link } from 'react-router-dom';
import { formContext } from '../../../Context/formProvider';
import { useContext, useEffect, useState } from 'react';
import noFollowerFoundImg from '../../../Asset/followers-no-followers-yet.avif';
import NotFound from './NotFound';

export default function FollowingFollowersCard({ data, activeBtn, edit }) {
    const { loggedInUser } = useContext(formContext);
    const [redirectLink, setRedirectLink] = useState('');

    useEffect(() => {
        if(activeBtn === 'following') {
            data.following.forEach(following => {
                if (loggedInUser && loggedInUser.users && following.email === loggedInUser.users.email) {
                    setRedirectLink(`/profile/${following._id}/reviews`)
                }
            })
        } else {
            data.followers.forEach(follower => {
                if (loggedInUser && loggedInUser.users && follower.email === loggedInUser.users.email) {
                    setRedirectLink(`/profile/${follower._id}/reviews`)
                }
            })
        }
        //eslint-disable-next-line
    }, [activeBtn]);

    let renderFollowersOrFollowing;

    if (activeBtn === 'following') {
        renderFollowersOrFollowing = data.following.map(following => {
            return (
                <div className='following-followers-container' key={following._id}>
                    <Link to={redirectLink} className='image-container'>
                        <img src={profileImg} alt='img' />
                    </Link>
                    <Link to={redirectLink} className='user-name-container'>
                        <div className='name'>
                            <h2>{following.fullname}</h2>
                        </div>
                        <div className='reviews-followers'>
                            <p className='reviews'>{following.reviews ? following.reviews.length : 0} reviews</p>
                            <p className='followers'>{following.followers.length} followers</p>
                        </div>
                    </Link>
                    {!edit && <Form method='delete' action={`/profile/${following._id}/followers`} className='remove-add-following-btn'>
                        <button><i className='bx bxs-user-check' ></i></button>
                    </Form>}
                </div>
            );
        });
    } else if (activeBtn === 'followers') {
        renderFollowersOrFollowing = data.followers.map(follower => {
            return (
                <div className='following-followers-container' key={follower._id}>
                    <Link to={redirectLink} className='image-container'>
                        <img src={profileImg} alt='img' />
                    </Link>
                    <Link to={redirectLink} className='user-name-container'>
                        <div className='name'>
                            <h2>{follower.fullname}</h2>
                        </div>
                        <div className='reviews-followers'>
                            <p className='reviews'>{follower.reviews ? follower.reviews.length : 0} reviews</p>
                            <p className='followers'>{follower.followers.length} followers</p>
                        </div>
                    </Link>
                    {!edit && <Form method='delete' action={`/profile/${follower._id}/followers`} className='remove-add-following-btn'>
                        <button><i className='bx bxs-user-check' ></i></button>
                    </Form>}
                </div>
            )
        });
    }

    return (
        <>
            {renderFollowersOrFollowing.length > 0 ? renderFollowersOrFollowing : activeBtn === 'followers' ? <NotFound image={noFollowerFoundImg} description='You are not followed by any user yet.' /> : <NotFound image={noFollowerFoundImg} description='You are not following any user yet.' />}
        </>
    )
}