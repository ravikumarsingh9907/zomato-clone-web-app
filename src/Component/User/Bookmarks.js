import './bookmarks.scss';
import { Await, defer, useLoaderData } from 'react-router';
import BookmarkCard from './Layout/BookmarkCard';
import NotFound from './Layout/NotFound';
import noBookMarkFound from '../../Asset/bookmark-no-bookmark-yet.avif';
import BookmarksLoader from './Loaders/BookmarksLoader';
import { Suspense } from 'react';

export default function PorfileBookmarks() {
    const { bookmarks } = useLoaderData();

    return (
        <Suspense fallback={<BookmarksLoader />}>
            <Await resolve={bookmarks}>
                {(loadedBookmarks) => <div className='bookmark-wrapper'>
                    <div className='bookmark-heading'>
                        <h2 className='heading'>Bookmarks</h2>
                    </div>
                    <div className='list-container'>
                        {loadedBookmarks.bookmarks.length > 0 ? loadedBookmarks.bookmarks.map(bookmark => {
                            return <BookmarkCard data={bookmark} />
                        }) : <NotFound image={noBookMarkFound} description='Nothing in your Bookmarks yet.' />}
                    </div>
                </div>}
            </Await>
        </Suspense>
    )
}

async function loadBookmarks(id) {
    const bookmarkResponse = await fetch(`https://foodie-api-nine.vercel.app/users/${id}/bookmarks`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    const { bookmarks } = await bookmarkResponse.json();

    return { bookmarks };
}

export async function loader({ params }) {
    return defer({
        bookmarks: loadBookmarks(params.id)
    })
}