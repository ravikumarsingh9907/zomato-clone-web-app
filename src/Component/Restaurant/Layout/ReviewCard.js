import './reviewCard.scss';
import ReviewerDetail from '../../User/Layout/FollowersFollowingCard';
import ReviewComment from './ReviewComment';
import LikeCommentShare from './LikeCommentShare';
import { useContext, useEffect, useState } from 'react';
import { formContext } from '../../../Context/form-context';
import RestaurantCard from './RestaurantCard';
import { fetchData } from '../../../Utilities/api';

export default function ReviewCard({ data, follow, loggedInUser}) {
    const [isFollowing, setIsFollowing] = useState(false);
    const [isLoggedInUser, setIsLoggedInUser] = useState(false);
    const [followResponse, setFollowResponse] = useState(false);
    const [reviewLikes, setReviewLikes] = useState({ count: 0, likes: [] });
    const [reviewComments, setReviewComments] = useState({ count: 0, comments: [] });
    const { handleFormVisibility, handleLoginForm } = useContext(formContext);
    const [commentVisibility, setCommentVisibilty] = useState(false);

    useEffect(() => {
        (async () => {
            const reviewLikesData = await fetchData(`/restaurants/${data.brand._id}/reviews/${data._id}/like`);
            const reviewCommentData = await fetchData(`/restaurants/${data.brand._id}/reviews/${data._id}/comment`);

            if (reviewLikesData.likes) setReviewLikes(reviewLikesData);
            if (reviewCommentData.comments) setReviewComments(reviewCommentData);
        })();
    }, [commentVisibility, data]);

    const handleCommentVisibilty = () => {
        commentVisibility ? setCommentVisibilty(false) : setCommentVisibilty(true);
    }

    const handleCommentData = (data) => {
        setCommentVisibilty(data)
    };

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
                followResponse = await fetch(`https://foodie-api-nine.vercel.app/users/${e.target.value}/follow`, {
                    method: e.target.parentElement.method,
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
            } else {
                followResponse = await fetch(`https://foodie-api-nine.vercel.app/users/${e.target.value}/follow`, {
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
                {window.location.pathname.startsWith('/profile') || window.location.pathname.startsWith('/user') ? <RestaurantCard data={data.brand} edit='false' /> : <ReviewerDetail data={data.user} edit='false' />}
                {!follow && !isFollowing && !isLoggedInUser ? <form method='post' className='follow-btn'>
                    <button className='btn' value={data.user._id} onClick={handleFollowClick}>{!followResponse ? 'Follow' : <i className='bx bx-loader-alt bx-flip-horizontal' ></i>}</button>
                </form> : !follow && !isLoggedInUser ? <form method='delete' className='follow-btn'>
                    <button className='btn following' value={data.user._id} onClick={handleFollowClick}>{!followResponse ? 'Following' : <i className='bx bx-loader-alt bx-flip-horizontal' ></i>}</button>
                </form> : ''}
            </div>
            <ReviewComment data={data} reviewLikes={reviewLikes} comments={reviewComments} />
            <LikeCommentShare data={data} reviewLikes={reviewLikes} comments={reviewComments} loggedInUser={loggedInUser} setCommentVisibilty={handleCommentVisibilty} commentVisibility={commentVisibility} handleCommentData={handleCommentData} />
        </div>
    )
}