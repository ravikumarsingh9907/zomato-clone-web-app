import './photos.scss';
import { Await, defer, useLoaderData } from 'react-router-dom';
import PhotosLoader from './Loaders/PhotosLoader';
import { Suspense } from 'react';
import NotFound from './Layout/NotFound';
import noPhotosFound from '../../Asset/photos-not-posted-yet.avif';
import FullScreenImageShow from '../FullScreenImageShow';
import PhotoCard from './Layout/PhotoCard';

export default function ProfilePhotos() {
    const { data } = useLoaderData();

    return (
        <Suspense fallback={<PhotosLoader/>}>
            <Await resolve={data}>
                {(loadedPhotos) =>
                    <div className='photos-wrapper'>
                        <FullScreenImageShow />
                        <div className='photos-heading'>
                            <h2 className='heading'>Photos</h2>
                        </div>
                        <div className='list-container'>
                            {loadedPhotos.length > 0 ? <PhotoCard data={loadedPhotos}/> : <NotFound image={noPhotosFound} description='No photos posted yet.'/>}
                        </div>
                    </div>
                }
            </Await>
        </Suspense>
    )
}

async function loadPhotos(id) {
    const response = await fetch(`https://foodie-api-nine.vercel.app/users/${id}/reviews`, {
        method: 'GET',
    });

    const data = await response.json();
    return data;
}

export async function loader({ params }) {
    return defer({
        data: loadPhotos(params.id),
    })
}