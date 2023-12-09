import './rectangleCard.scss'
import maxSafety from '../../Asset/mac-safety.webp';
import { Link } from 'react-router-dom';
import React from 'react';

function RectangleCard({data}) {
    const randomThumnail = Math.floor(Math.random() * data.gallery.length);

    return (
        <Link to={`/restaurants/${data._id}/online-order`} className='rectangle-card-container'>
            <div className='image-container'>
                <img src={data.gallery[randomThumnail]} alt={data.name}/>
            </div>
            <div className='description-container'>
                <div className='name-and-rating'>
                    <h4 className='name'>{data.name}</h4>
                    <p className='rating'>
                        <p>3.7</p>
                        <span className="material-symbols-outlined">star_rate</span>
                    </p>
                </div>
                <div className='description'>
                    <p>{data.description.length > 25 ? data.description.slice(0, 25) + '...' : data.description}</p>
                    <p className='price'><span>$25</span><span> for one</span></p>
                </div>
                <div className='max-safety-banner'>
                    <img src={maxSafety} alt='max-safety'/>
                    <span>Follows all Max Safety measures to ensure your food is safe</span>
                </div>
            </div>
        </Link>
    )
}

export default React.memo(RectangleCard);