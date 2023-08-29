import ReviewCard from './Layout/ReviewCard';
import './reviews.scss';
import { useLoaderData, useNavigation, useParams } from 'react-router';
import { useState, useEffect, useContext } from 'react';
import OnlineOrderLoader from './Loaders/OrdersLoader';
import GalleryLoader from './Loaders/PhotosLoader';
import ReviewsLoader from './Loaders/ReviewLoader';
import UnviersalLoader from '../Layout/PreLoader';
import NotFound from '../User/Layout/NotFound';
import noFoundReview from '../../Asset/reviews-nothing-here-yet.avif';
import WriteReview from './WriteReview';
import { reviewContext } from '../../Context/review-context';
import { formContext } from '../../Context/form-context';

export default function Reviews() {
    const { loggedInUser } = useLoaderData();
    const [reviews, setReviews] = useState([]);
    const navigation = useNavigation();
    const [renderLoader, setRenderLoader] = useState('');
    const { handleReviewFormVisibility, isFormVisibile } = useContext(reviewContext);
    const { handleFormVisibility } = useContext(formContext);
    const { id } = useParams();

    useEffect(() => {
        if (navigation.location && navigation.location.pathname.endsWith('/gallery') && !navigation.formMethod) {
            setRenderLoader(<GalleryLoader />);
        } else if (navigation.location && navigation.location.pathname.endsWith('/online-order') && navigation.location.pathname.startsWith('/restaurants') && !navigation.formMethod) {
            setRenderLoader(<OnlineOrderLoader />);
        } else if (navigation.location && navigation.location.pathname.endsWith('/reviews') && navigation.location.pathname.startsWith('/restaurants') && !navigation.formMethod) {
            setRenderLoader(<ReviewsLoader />);
        } else if (navigation.location && navigation.location.pathname.startsWith('/user')) {
            setRenderLoader(<UnviersalLoader />);
        } else if (!navigation.formMethod) {
            setRenderLoader(<UnviersalLoader />);
        }
    }, [navigation]);

    useEffect(() => {
        (async () => {
            const reviewsResponse = await fetch(`http://localhost:3300/restaurants/${id}/reviews`, {
                method: 'GET',
            });

            const reviews = await reviewsResponse.json();
            setReviews(reviews)
        })();
        //eslint-disable-next-line
    }, [isFormVisibile, reviews])

    const handleOnClickFormVisibility = () => {
        if (loggedInUser.error) {
            handleFormVisibility('form-container')
        } else {
            handleReviewFormVisibility('write-review-wrapper')
        }
    }

    const renderCards = reviews.map(review => {
        return (
            <ReviewCard data={review}  key={review._id}/>
        )
    });

    return (
        <>
            {navigation.state === 'loading' && !navigation.formMethod ? renderLoader
                : <div className='reviews-wrapper'>
                    <WriteReview />
                    <div className='heading-write-review-container'>
                        <div className='heading-container'>
                            <p className='heading'>{reviews.length > 0 && reviews[0].brand.name} Reviews</p>
                        </div>
                        <div className='write-review' onClick={handleOnClickFormVisibility}>
                            <i className='bx bx-plus'></i>
                            <span className='btn'>Write</span>
                        </div>
                    </div>
                    {reviews.length > 0 ? <div className='list-container'>
                        {renderCards}
                    </div> : <NotFound image={noFoundReview} description='Nothing here yet.' />}
                </div>}
        </>
    )
}

export async function loader({ params }) {
    const loggedInUserResponse = await fetch('http://localhost:3300/users/me', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    const loggedInUser = await loggedInUserResponse.json();

    const reviewsResponse = await fetch(`http://localhost:3300/restaurants/${params.id}/reviews`, {
        method: 'GET',
    });

    const reviews = await reviewsResponse.json();

    return {
        loggedInUser,
        reviews
    };
}