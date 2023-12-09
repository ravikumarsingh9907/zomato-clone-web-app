import '../../User/Layout/followingFollowers.scss';
import { Link } from 'react-router-dom';

export default function RestaurantCard({ data }) {
    return(
        <div className='following-followers-container'>
            <Link to={`/restaurants/${data._id}/online-order`} className='image-container'>
                <img src={data.image} alt='img'/>
            </Link>
            <Link to={`/restaurants/${data._id}/online-order`} className='user-name-container'>
                <div className='name'>
                    <h2>{data.name}</h2>
                </div>
                <div className='reviews-followers'>
                    <p className='reviews'>{data.locations[0].street + ", " + data.locations[0].city}</p>
                </div>
            </Link>
        </div>
    )
}