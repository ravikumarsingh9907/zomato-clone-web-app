import './bookmarks.scss';
import { useState, useEffect } from 'react';
import { useLoaderData, useNavigation } from 'react-router';
import BookmarkCard from './Layout/BookmarkCard';
import NotFound from './Layout/NotFound';
import noBookMarkFound from '../../Asset/bookmark-no-bookmark-yet.avif';
import BookmarksLoader from './Loaders/BookmarksLoader';
import FollowersLoader from './Loaders/FollowersLoader';
import PhotosLoader from './Loaders/PhotosLoader';
import UnviersalLoader from '../Layout/PreLoader';
import ReviewsLoader from '../Restaurant/Loaders/ReviewLoader';

export default function PorfileBookmarks() {
    const { bookmarks } = useLoaderData();
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
    },[navigation]) 

    const renderCards = bookmarks.map(bookmark => {
        return <BookmarkCard data={bookmark} />
    });

    return (
        <>  
        {navigation.state !== 'loading' ? <div className='bookmark-wrapper'>
            <div className='bookmark-heading'>
                <h2 className='heading'>Bookmarks</h2>
            </div>
            <div className='list-container'>
                {renderCards.length > 0 ? renderCards : <NotFound image={noBookMarkFound} description='Nothing in your Bookmarks yet.'/>}
            </div>
        </div>
        : renderLoader
        }
        </>
    )
}

export async function loader({params}) {
    const bookmarkResponse = await fetch(`https://foodie-api-nine.vercel.app/users/${params.id}/bookmarks`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    const { bookmarks } = await bookmarkResponse.json();

    return { bookmarks };
}