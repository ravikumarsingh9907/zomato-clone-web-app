import './reviews.scss';
import { Await, defer, useLoaderData } from 'react-router';
import NotFound from './Layout/NotFound';
import noPhotosFound from '../../Asset/reviews-nothing-here-yet.avif';
import ReviewCard from '../Restaurant/Layout/ReviewCard';
import ReviewsLoader from '../Restaurant/Loaders/ReviewLoader';
import FullScreenImageShow from '../FullScreenImageShow';
import { Suspense, useEffect, useState } from 'react';

export default function ProfileReviews() {
    const { reviews } = useLoaderData();
    const [loggedInUser, setLoggedInUser] = useState({error: 'error'});

    useEffect(() => {
        (async () => {
            const loggedInUserResponse = await fetch('https://foodie-api-nine.vercel.app/users/me', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const loggedInUser = await loggedInUserResponse.json();
            setLoggedInUser(loggedInUser);
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
    const getReviews = await fetch(`https://foodie-api-nine.vercel.app/users/${id}/reviews`, {
        method: 'GET',
    });

    const reviews = await getReviews.json();
    return reviews;
}

export async function loader({ params }) {
    return defer({
        reviews: getReviews(params.id),
    })
}