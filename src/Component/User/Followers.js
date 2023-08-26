import { useState, useEffect } from 'react';
import './followers.scss';
import FollowingFollowersCard from './Layout/FollowingFollowersCard';
import { redirect, useLoaderData, useNavigation } from 'react-router';
import noFollowerFoundImg from '../../Asset/followers-no-followers-yet.avif';
import NotFound from './Layout/NotFound';
import FollowersLoader from './Loaders/FollowersLoader';
import BookmarksLoader from './Loaders/BookmarksLoader';
import PhotosLoader from './Loaders/PhotosLoader';
import UnviersalLoader from '../Layout/PreLoader';
import ReviewsLoader from '../Restaurant/Loaders/ReviewLoader';

export default function ProfileFollowers({ edit }) {
    const [activeBtn, setActiveBtn] = useState('followers');
    const data = useLoaderData();
    const navigation = useNavigation();
    const [renderLoader, setRenderLoader] = useState(<PhotosLoader />);

    useEffect(() => {
        if(navigation.location && navigation.location.pathname.endsWith('/bookmarks')) {
            setRenderLoader(<BookmarksLoader />);
        } else if (navigation.location && navigation.location.pathname.endsWith('/followers')) {
            setRenderLoader(<FollowersLoader />);
        } else if (navigation.location && navigation.location.pathname.endsWith('/photos')) {
            setRenderLoader(<PhotosLoader />);
        } else if (navigation.location && navigation.location.pathname.endsWith('/reviews')) {
            setRenderLoader(<ReviewsLoader />); 
        } else {
            setRenderLoader(<UnviersalLoader />);
        }
    },[navigation]) 

    const handleOnClick = (e) => {
        e.target.classList.add('active-btn');
        if (!e.target.parentElement.nextSibling) {
            e.target.parentElement.previousSibling.childNodes[0].classList.remove('active-btn');
        } else {
            e.target.parentElement.nextSibling.childNodes[0].classList.remove('active-btn');
        }
        setActiveBtn(e.target.value);
    }

    let renderFollowersOrFollowing;

    if (activeBtn === 'following') {
        renderFollowersOrFollowing = data.following.map(following => {
            return <FollowingFollowersCard data={following} key={following._id} edit={edit} />
        });
    } else if (activeBtn === 'followers') {
        renderFollowersOrFollowing = data.followers.map(follower => {
            return <FollowingFollowersCard data={follower} key={follower._id} edit={edit} />
        });
    }

    return (
        <>
            {navigation.state !== 'loading' ? <div className='followers-following-wrapper'>
                <div className='heading-container'>
                    <h2 className='heading'>Followers</h2>
                </div>
                <div className='following-followers-btn-wrapper'>
                    <div className='following'>
                        <button className='btn' value='following' onClick={handleOnClick}>Following ({data.following.length})</button>
                    </div>
                    <div className='followers'>
                        <button className='btn active-btn' value='followers' onClick={handleOnClick}>Followers ({data.followers.length})</button>
                    </div>
                </div>
                <div className='list-container'>
                    {renderFollowersOrFollowing.length > 0 ? renderFollowersOrFollowing : activeBtn === 'followers' ? <NotFound image={noFollowerFoundImg} description='You are not followed by any user yet.' /> : <NotFound image={noFollowerFoundImg} description='You are not following any user yet.' />}
                </div>
            </div>
                : renderLoader 
            }
        </>
    )
}

export async function loader({ params }) {
    const followersResponse = await fetch(`http://localhost:3300/users/${params.id}/follow`, {
        method: 'GET',
    });

    const followersFollowing = await followersResponse.json();

    return followersFollowing;
}

export async function action({ params }) {
    const removeFollowing = await fetch(`http://localhost:3300/users/${params.id}/follow`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    const removedUser = await removeFollowing.json();

    if (removedUser.success) {
        return redirect(window.location.pathname);
    }

    return removedUser;
}