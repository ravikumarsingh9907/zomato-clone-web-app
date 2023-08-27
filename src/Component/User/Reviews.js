import './reviews.scss';
import { useLoaderData, useNavigation } from 'react-router';
import PhotosLoader from './Loaders/PhotosLoader';
import BookmarksLoader from './Loaders/BookmarksLoader';
import FollowersLoader from './Loaders/FollowersLoader';
import { useEffect, useState } from 'react';
import NotFound from './Layout/NotFound';
import noPhotosFound from '../../Asset/reviews-nothing-here-yet.avif';
import UnviersalLoader from '../Layout/PreLoader';
import ReviewCard from '../Restaurant/Layout/ReviewCard';
import ReviewsLoader from '../Restaurant/Loaders/ReviewLoader';

export default function ProfileReviews() {
    const {Reviews} = useLoaderData();
    const navigation = useNavigation();
    const [renderLoader, setRenderLoader] = useState('');

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
    },[navigation]);

    const renderReviews = Reviews.map(item => {
        return <ReviewCard data={item} follow='false' />
    });

    return(
        <>
            {navigation.state !== 'loading' ?
                <div className='user-reviews-wrapper'>
                    <div className='reviews-heading'>
                        <h2 className='heading'>Reviews</h2>
                    </div>
                    <div className='list-container'>
                        {Reviews.length > 0 ? renderReviews :<NotFound image={noPhotosFound} description='Nothing here yet' /> }
                    </div>
                </div> :
                renderLoader
            }
        </>
    )
}

export async function loader({params}) {
    const getReviews = await fetch(`http://localhost:3300/users/${params.id}/reviews`, {
        method: 'GET',
    });

    const Reviews = await getReviews.json();

    const loggedInUserResponse = await fetch('http://localhost:3300/users/me', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    const loggedInUser = await loggedInUserResponse.json();

    return {
        loggedInUser,
        Reviews
    };
}