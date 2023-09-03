import './photos.scss';
import { useLoaderData } from 'react-router-dom';
import PhotosLoader from './Loaders/PhotosLoader';
import BookmarksLoader from './Loaders/BookmarksLoader';
import FollowersLoader from './Loaders/FollowersLoader';
import { useNavigation } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import NotFound from './Layout/NotFound';
import noPhotosFound from '../../Asset/photos-not-posted-yet.avif';
import UnviersalLoader from '../Layout/PreLoader';
import ReviewsLoader from '../Restaurant/Loaders/ReviewLoader';
import FullScreenImageShow from '../FullScreenImageShow';
import { imageMagnifier } from '../../Context/image-magnifier';

export default function ProfilePhotos() {
    const data = useLoaderData();
    const navigation = useNavigation();
    const [renderLoader, setRenderLoader] = useState('');
    const { handleIsOpen, elementRef} = useContext(imageMagnifier);

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

    const handleImageMagnifier = () => {
        handleIsOpen(true);
    }

    const renderPhotos = data.length && data.map(data => {
        return (
            data.images.map(image => {
                return (
                    <div className='image-container' onClick={handleImageMagnifier}>
                        <img src={image} alt='img' ref={elementRef}/>
                    </div>
                )
            })
        )
    });

    return (
        <>
            {navigation.state !== 'loading' ?
                <div className='photos-wrapper'>
                    <FullScreenImageShow />
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
    const response = await fetch(`https://foodie-api-nine.vercel.app/users/${params.id}/reviews`, {
        method: 'GET',
    });

    const data = await response.json();

    return data;
}