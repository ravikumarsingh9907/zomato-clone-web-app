import { useState, Suspense } from 'react';
import './followers.scss';
import FollowersFollowingList from './Layout/FollowersList';
import { Await, defer, redirect, useLoaderData } from 'react-router';
import FollowersLoader from './Loaders/FollowersLoader';

export default function ProfileFollowers({ edit }) {
    const [activeBtn, setActiveBtn] = useState('followers');
const {data} = useLoaderData();

    const handleOnClick = (e) => {
        e.target.classList.add('active-btn');
        if (!e.target.parentElement.nextSibling) {
            e.target.parentElement.previousSibling.childNodes[0].classList.remove('active-btn');
        } else {
            e.target.parentElement.nextSibling.childNodes[0].classList.remove('active-btn');
        }
        setActiveBtn(e.target.value);
    }

    return (
        <Suspense fallback={<FollowersLoader />}>
            <Await resolve={data}>
                {(loadedData) => <div className='followers-following-wrapper'>
                    <div className='heading-container'>
                        <h2 className='heading'>Followers</h2>
                    </div>
                    <div className='following-followers-btn-wrapper'>
                        <div className='following'>
                            <button className='btn' value='following' onClick={handleOnClick}>Following</button>
                        </div>
                        <div className='followers'>
                            <button className='btn active-btn' value='followers' onClick={handleOnClick}>Followers</button>
                        </div>
                    </div>
                    <div className='list-container'>
                        {activeBtn === 'following' && <FollowersFollowingList data={loadedData.following} edit={edit}/>}
                        {activeBtn === 'followers' && <FollowersFollowingList data={loadedData.followers} edit={edit}/>}
                    </div>
                </div>}
            </Await>
        </Suspense>
    )
}

async function loadData(id) {
    const followersResponse = await fetch(`http://localhost:3333/users/${id}/follow`, {
        method: 'GET',
    });

    const followersFollowing = await followersResponse.json();

    return followersFollowing;
}

export async function loader({ params }) {
    return defer({
        data: loadData(params.id)
    });
}

export async function action({ params }) {
    const removeFollowing = await fetch(`http://localhost:3333/users/${params.id}/follow`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    const removedUser = await removeFollowing.json();

    if (removedUser.success) {
        return redirect(window.location.pathname);
    }

    return removedUser;
}