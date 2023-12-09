import './bookmarkCard.scss';
import { Link, useNavigation } from 'react-router-dom';
import React from 'react';
import UniversalLoader from '../../Layout/PreLoader'

function BookmarkCard({ data }) {
    const randomImage = Math.floor(Math.random() * data.gallery.length);
    const navigation = useNavigation();

    return (
        <>
            {navigation.state === 'loading' && <UniversalLoader />}
            <Link to={`/restaurants/${data._id}/online-order`} className='card-container'>
                <div className='card-image-container'>
                    <div className='image'>
                        <img src={data.gallery[randomImage]} alt='name' />
                    </div>
                </div>
                <div className='about-restaurant'>
                    <div className='name-container'>
                        <h2 className='name'>{data.name}</h2>
                    </div>
                    <div className='rating-container'>
                        <p className='rating'>
                            <span>3.8</span>
                            <i className='bx bxs-star'></i>
                        </p>
                        <p className='rating-type'>DELIVERY</p>
                    </div>
                    <div className='address-container'>
                        <p>{data.description.length > 30 ? data.description.slice(0, 30) + '...' : data.description}</p>
                        <p>{data.locations[0].street.length + data.locations[0].city.length > 30 ? data.locations[0].street : data.locations[0].street + ',' + data.locations[0].city}</p>
                    </div>
                </div>
            </Link>
        </>
    )
}

export default React.memo(BookmarkCard);