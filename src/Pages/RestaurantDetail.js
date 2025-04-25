import './restaurantDetail.scss';
import RestDetailHeader from '../Component/Restaurant/RestDetailHeader';
import FoodDetailNavbar from '../Component/Restaurant/FoodDetailNavbar';
import { Outlet, redirect } from 'react-router';
import Footer from '../Component/Footer';
import { fetchData } from '../Utilities/api';

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
    const {brand} = await fetchData(`/restaurants/${params.id}`);
    
    const user = await fetchData('/users/me', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    const {bookmarks} = await fetchData(`/users/${user._id}/bookmarks`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });

    const reviews = await fetch(`/restaurants/${params.id}/reviews`);

    return { brand, user, bookmarks, reviews };
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