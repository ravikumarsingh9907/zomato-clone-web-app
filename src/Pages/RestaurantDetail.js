import './restaurantDetail.scss';
import RestDetailHeader from '../Component/Restaurant/RestDetailHeader';
import FoodDetailNavbar from '../Component/Restaurant/FoodDetailNavbar';
import { Outlet, redirect } from 'react-router';

export default function RestaurantDetail() {
    return(
        <div className='restaurant-detail-wrapper'>
            <RestDetailHeader />
            <FoodDetailNavbar />
            <Outlet />
        </div>
    );
}

export async function loader({params}) {
    const response = await fetch(`http://localhost:3300/restaurants/${params.id}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        },
    });

    const userResponse = await fetch('http://localhost:3300/users/me', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    const user = await userResponse.json();
    const { brand } = await response.json();

    const bookmarkResponse = await fetch(`http://localhost:3300/users/${user._id}/bookmarks`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    const {bookmarks} = await bookmarkResponse.json();

    return {
        brand,
        user,
        bookmarks,
    }
}

export async function action({request, params}) {
    const addToBookmarkResponse = await fetch(`http://localhost:3300/restaurants/${params.id}/bookmark`, {
        method: request.method,
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    const bookmark = await addToBookmarkResponse.json();
    if(bookmark.success) {
        return redirect(window.location.href);
    }

    return bookmark;
}