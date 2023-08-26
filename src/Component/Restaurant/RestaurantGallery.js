import './restaurantGallery.scss';
import { useLoaderData, useNavigation } from 'react-router';
import { useState, useEffect } from 'react';
import OnlineOrderLoader from './Loaders/OrdersLoader';
import GalleryLoader from './Loaders/PhotosLoader';
import ReviewsLoader from './Loaders/ReviewLoader';
import UnviersalLoader from '../Layout/PreLoader';
import NotFound from '../User/Layout/NotFound';
import noFoundPhotos from '../../Asset/photos-not-posted-yet.avif';

export default function RestaurantGallery() {
    const { brand } = useLoaderData();
    const navigation = useNavigation();
    const [renderLoader, setRenderLoader] = useState('');

    useEffect(() => {
        if (navigation.location && navigation.location.pathname.endsWith('/gallery') && !navigation.formMethod) {
            setRenderLoader(<GalleryLoader />);
        } else if (navigation.location && navigation.location.pathname.endsWith('/online-order') && !navigation.formMethod) {
            setRenderLoader(<OnlineOrderLoader />);
        } else if (navigation.location && navigation.location.pathname.endsWith('/reviews') && !navigation.formMethod) {
            setRenderLoader(<ReviewsLoader />);
        } else if (!navigation.formMethod) {
            setRenderLoader(<UnviersalLoader />);
        }
    }, [navigation])

    const renderGallery = brand && brand.gallery.map(gallery => {
        return (
            <div className='image'>
                <img src={gallery} alt='img' />
            </div>
        )
    })

    return (
        <>
            {navigation.state === 'loading' && !navigation.formMethod ? renderLoader :
                <div className='restaurant-gallery-container'>
                    <div className='heading'>
                        <p>{brand.name} Photos</p>
                    </div>
                    {renderGallery.length > 0 ? <div className='gallery-container'>{renderGallery}</div> : <NotFound image={noFoundPhotos} description='Nothing here yet.' />}
                </div>}
        </>
    )
}

export async function loader({ params }) {
    const response = await fetch(`http://localhost:3300/restaurants/${params.id}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        },
    });

    const { brand } = await response.json();

    return {
        brand,
    }
}
