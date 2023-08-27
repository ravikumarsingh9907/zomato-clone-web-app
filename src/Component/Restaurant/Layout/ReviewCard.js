import './reviewCard.scss';
import ReviewerDetail from '../../User/Layout/FollowingFollowersCard';
import ReviewComment from './ReviewComment';
import LikeCommentShare from './LikeCommentShare';
import { useContext, useEffect, useState } from 'react';
import { formContext } from '../../../Context/form-context';
import RestaurantCard from './RestaurantCard';
import { useLoaderData } from 'react-router';

export default function ReviewCard({ data, follow }) {
    const { loggedInUser } = useLoaderData();
    const [isFollowing, setIsFollowing] = useState(false);
    const [isLoggedInUser, setIsLoggedInUser] = useState(false);
    const [followResponse, setFollowResponse] = useState(false);
    const [reviewLikes, setReviewLikes] = useState({ count: 0, likes: [] });
    const [reviewComments, setReviewComments] = useState({ count: 0, comments: [] });
    const { handleFormVisibility, handleLoginForm } = useContext(formContext);

    useEffect(() => {
        (async () => {
            const reviewLikesResponse = await fetch(`http://localhost:3300/restaurants/${data.brand._id}/reviews/${data._id}/like`, {
                method: 'GET',
            });

            const reviewLikesData = await reviewLikesResponse.json();

            const reviewCommentResponse = await fetch(`http://localhost:3300/restaurants/${data.brand._id}/reviews/${data._id}/comment`, {
                method: 'GET',
            });

            const reviewCommentData = await reviewCommentResponse.json();

            if (reviewLikesData.likes) {
                setReviewLikes(reviewLikesData);
            }

            if (reviewCommentData.comments) {
                setReviewComments(reviewCommentData);
            }
        })();
    }, [reviewLikes, data, reviewComments]);

    useEffect(() => {
        !loggedInUser.error && loggedInUser.following.forEach(following => {
            if (following.email === data.user.email) {
                setIsFollowing(true);
            }
        });

        if (!loggedInUser.error) {
            if (loggedInUser.email === data.user.email) {
                setIsLoggedInUser(true);
            }
        }
    }, [data, loggedInUser]);

    const handleFollowClick = async (e) => {
        e.preventDefault();
        if (!loggedInUser.error) {
            setFollowResponse(true);
            let followResponse;

            if (e.target.parentElement.method === 'post') {
                followResponse = await fetch(`http://localhost:3300/users/${e.target.value}/follow`, {
                    method: e.target.parentElement.method,
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
            } else {
                followResponse = await fetch(`http://localhost:3300/users/${e.target.value}/follow`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
            }

            const follow = await followResponse.json();

            if (follow.success) {
                setIsFollowing(!isFollowing);
            }
            setFollowResponse(false);
        } else {
            handleFormVisibility('form-container');
            handleLoginForm();
        }
    }

    return (
        <div className='review-card-container'>
            <div className='follow-reviewer-container'>
                {window.location.pathname.startsWith('/profile') ? <RestaurantCard data={data.brand} edit='false' /> : <ReviewerDetail data={data.user} edit='false' />}
                {!follow && !isFollowing && !isLoggedInUser ? <form method='post' className='follow-btn'>
                    <button className='btn' value={data.user._id} onClick={handleFollowClick}>{!followResponse ? 'Follow' : <i className='bx bx-loader-alt bx-flip-horizontal' ></i>}</button>
                </form> : !follow && !isLoggedInUser ? <form method='delete' className='follow-btn'>
                    <button className='btn following' value={data.user._id} onClick={handleFollowClick}>{!followResponse ? 'Following' : <i className='bx bx-loader-alt bx-flip-horizontal' ></i>}</button>
                </form> : ''}
            </div>
            <ReviewComment data={data} reviewLikes={reviewLikes} comments={reviewComments} />
            <LikeCommentShare data={data} reviewLikes={reviewLikes} comments={reviewComments} />
        </div>
    )
}