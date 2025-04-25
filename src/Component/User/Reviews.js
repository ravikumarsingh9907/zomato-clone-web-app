import './reviews.scss';
import { Await, defer, useLoaderData } from 'react-router';
import NotFound from './Layout/NotFound';
import noPhotosFound from '../../Asset/reviews-nothing-here-yet.avif';
import ReviewCard from '../Restaurant/Layout/ReviewCard';
import ReviewsLoader from '../Restaurant/Loaders/ReviewLoader';
import FullScreenImageShow from '../FullScreenImageShow';
import { Suspense, useEffect, useState } from 'react';
import { fetchData } from '../../Utilities/api';

export default function ProfileReviews() {
    const { reviews } = useLoaderData();
    const [loggedInUser, setLoggedInUser] = useState({error: 'error'});

    useEffect(() => {
        (async () => {
            const loggedInUserResponse = await fetchData('/users/me', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setLoggedInUser(loggedInUserResponse);
        })();
    }, []);

    return (
        <Suspense fallback={<ReviewsLoader />}>
            <Await resolve={reviews}>
                {(loadedReviews) => <div className='user-reviews-wrapper'>
                    <FullScreenImageShow />
                    <div className='reviews-heading'>
                        <h2 className='heading'>Reviews</h2>
                    </div>
                    <div className='list-container'>
                        {loadedReviews.length > 0 ? loadedReviews.map(review => {
                            return <ReviewCard data={review} follow='false' key={review._id} loggedInUser={loggedInUser} />
                        }) : <NotFound image={noPhotosFound} description='Nothing here yet' />}
                    </div>
                </div>}
            </Await>
        </Suspense>
    )
}

async function getReviews(id) {
    return await fetchData(`/users/${id}/reviews`);
}

export async function loader({ params }) {
    return defer({ reviews: getReviews(params.id) });
}