import './Profile.scss'
import ProfileCard from '../Component/User/PorfileCard';
import Sidebar from '../Component/User/Sidebar';
import { Outlet } from 'react-router';

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
                <div className='profile-content-container'>
                    <div className='sidebar'>
                        <Sidebar data={activity} />
                    </div>
                    <div className='show-activity'>
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    )
}

export async function loader({params}) {
    const profileResponse = await fetch('http://localhost:3300/users/'+params.id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    const profile = await profileResponse.json();

    const profilePictureResponse = await fetch(`http://localhost:3300/users/${profile._id}/avatar`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    });

    let profilePicture;

    if (profilePictureResponse.status !== 400) {
        profilePicture = profilePictureResponse.url;
    }

    return {
        profile,
        profilePicture
    };
}