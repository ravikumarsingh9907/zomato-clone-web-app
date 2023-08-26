import './photos.scss';
import { useLoaderData } from 'react-router-dom';
import PhotosLoader from './Loaders/PhotosLoader';
import BookmarksLoader from './Loaders/BookmarksLoader';
import FollowersLoader from './Loaders/FollowersLoader';
import { useNavigation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import NotFound from './Layout/NotFound';
import noPhotosFound from '../../Asset/photos-not-posted-yet.avif';
import UnviersalLoader from '../Layout/PreLoader';
import ReviewsLoader from '../Restaurant/Loaders/ReviewLoader';

export default function ProfilePhotos() {
    const data = useLoaderData();
    const navigation = useNavigation();
    const [renderLoader, setRenderLoader] = useState('');

    console.log(data);

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

    const renderPhotos = data.length && data.map(data => {
        return (
            data.images.map(image => {
                return (
                    <div className='image-container'>
                        <img src={image} alt='img' />
                    </div>
                )
            })
        )
    });

    console.log(renderPhotos);

    return (
        <>
            {navigation.state !== 'loading' ?
                <div className='photos-wrapper'>
                    <div className='photos-heading'>
                        <h2 className='heading'>Photos</h2>
                    </div>
                    <div className='list-container'>
                        {renderPhotos.length > 1 ? renderPhotos : <NotFound image={noPhotosFound} description='No photos posted yet.' />}
                    </div>
                </div> :
                renderLoader
            }
        </>
    )
}

export async function loader({params}) {
    const response = await fetch(`http://localhost:3300/users/${params.id}/reviews`, {
        method: 'GET',
    });

    const data = await response.json();

    return data;
}