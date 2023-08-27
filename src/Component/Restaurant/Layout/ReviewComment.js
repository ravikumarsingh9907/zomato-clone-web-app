import { useEffect, useState } from 'react';
import './reviewComment.scss';
import moment from 'moment';

export default function ReviewComment({ data, reviewLikes, comments }) {
    const [ratingColor, setRatingColor] = useState('');

    const createdAt = moment(data.createdAt).endOf('hour').fromNow();
    const renderPhotos = data.images.length > 0 && data.images.map(image => {
        return (
            <div className='photos'>
                <img src={image} alt='img' />
            </div>
        )
    })

    useEffect(() => {
        if (data.rating > 3) {
            setRatingColor('rgb(58, 183, 87)');
        } else if (data.rating === 3) {
            setRatingColor('orange');
        } else {
            setRatingColor('red');
        }
    }, [data])

    return (
        <div className='review-comment-container'>
            <div className='rating-container'>
                <div className='rating' style={{ backgroundColor: ratingColor }}>
                    <span className='digit'>{data.rating}</span>
                    <i className='bx bxs-star'></i>
                </div>
                <div className='delivery'>
                    <p>DELIVERY</p>
                </div>
                <div className='created-at-container'>
                    <p className='created-at'>{createdAt}</p>
                </div>
            </div>
            <div className='comment-container'>
                <p className='comment'>{data.review}</p>
            </div>
            <div className='photos-container'>
                {renderPhotos}
            </div>
            <div className='likes-comment-count-container'>
                <p className='likes-comment-count'><span>{reviewLikes.count} Votes for helpful</span>, <span>{comments.count} Comments</span></p>
            </div>
        </div>
    )
}