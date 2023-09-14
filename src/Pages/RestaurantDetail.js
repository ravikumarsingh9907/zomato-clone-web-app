import './restaurantDetail.scss';
import RestDetailHeader from '../Component/Restaurant/RestDetailHeader';
import FoodDetailNavbar from '../Component/Restaurant/FoodDetailNavbar';
import { Outlet, redirect } from 'react-router';
import Footer from '../Component/Footer';

export default function RestaurantDetail() {
    return (
        <>
            <div className='restaurant-detail-wrapper'>
                <RestDetailHeader />
                <FoodDetailNavbar />
                <Outlet />
            </div>
            <Footer />
        </>
    );
}

export async function loader({ params }) {
    const response = await fetch(`https://foodie-api-nine.vercel.app/restaurants/${params.id}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        },
    });

    const userResponse = await fetch('https://foodie-api-nine.vercel.app/users/me', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    const user = await userResponse.json();
    const { brand } = await response.json();

    const bookmarkResponse = await fetch(`https://foodie-api-nine.vercel.app/users/${user._id}/bookmarks`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    const { bookmarks } = await bookmarkResponse.json();

    const reviewResponse = await fetch(`https://foodie-api-nine.vercel.app/restaurants/${params.id}/reviews`, {
        method: 'GET',
    });

    const reviews = await reviewResponse.json();

    return {
        brand,
        user,
        bookmarks,
        reviews,
    }
}

export async function action({ request, params }) {
    const addToBookmarkResponse = await fetch(`https://foodie-api-nine.vercel.app/restaurants/${params.id}/bookmark`, {
        method: request.method,
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    const bookmark = await addToBookmarkResponse.json();
    if (bookmark.success) {
        return redirect(window.location.href);
    }

    return bookmark;
}