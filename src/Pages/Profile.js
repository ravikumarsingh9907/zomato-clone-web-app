import './Profile.scss'
import ProfileCard from '../Component/User/ProfileCard';
import Sidebar from '../Component/User/Sidebar';
import { Outlet } from 'react-router';
import Footer from '../Component/Footer';
import EditProfile from '../Component/User/EditProfile';

const activity = {
    heading: 'Activity',
    item: [
        {
            id: 'act1',
            name: 'Reviews',
            url: 'reviews',
        },
        {
            id: 'act2',
            name: 'Photos',
            url: 'photos',
        },
        {
            id: 'act3',
            name: 'Followers',
            url: 'followers',
        },
        {
            id: 'act4',
            name: 'Bookmarks',
            url: 'bookmarks',
        }
    ]
}

export default function Profile() {
    return (
        <>
            <div className='profile-page-wrapper'>
                <ProfileCard />
                <EditProfile />
                <div className='profile-content-container'>
                    <div className='sidebar'>
                        <Sidebar data={activity} />
                    </div>
                    <div className='show-activity'>
                        <Outlet />
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export async function loader({ params }) {
    const getReviews = await fetch(`https://foodie-api-nine.vercel.app/users/${params.id}/reviews`, {
        method: 'GET',
    });

    const reviews = await getReviews.json();

    return {
        reviews,
    };
}