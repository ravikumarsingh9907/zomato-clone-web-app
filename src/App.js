import './App.scss';
import Navbar, { loader as userDetailsLoader, action as logoutAction } from './Component/Navbar';
import Forms from './Component/Form';
import HomePage, { loader as homePageLoader } from './Pages/Home';
import Restaurant, { loader as restaurantLoader } from './Pages/Restaurant';
import RestaurantDetail, { loader as restaurantDetailLoader, action as addToBookmarkAction } from './Pages/RestaurantDetail';
import Profile, { loader as profilePictureLoader } from './Pages/Profile';
import UserProfile, { loader as userPorfilePictureLoader, action as FollowUnFollowAction } from './Pages/UserProfile';
import LocationProvider from './Context/locationProvider';
import ReviewProvider from './Context/reviewProvider';
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import FormProvider from './Context/formProvider';
import SearchProvider from './Context/searchProvider';
import FoodCardList from './Component/Restaurant/FoodCardList';
import RestaurantGallery, { loader as restaurantGalleryLoader } from './Component/Restaurant/RestaurantGallery';
import RestaurantReviews, { loader as restaurantReviewsLoader } from './Component/Restaurant/Reviews';
import ProfileReviews, { loader as profileReviewsLoader } from './Component/User/Reviews';
import ProfilePhotos, { loader as photosLoader } from './Component/User/Photos';
import PorfileBookmarks, { loader as bookmarkLoader } from './Component/User/Bookmarks';
import ProfileFollowers, { loader as followDataLoader, action as RemoveFollowingAction } from './Component/User/Followers';

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <FormProvider>
        <LocationProvider>
          <SearchProvider>
            <Navbar />
          </SearchProvider>
          <Forms />
        </LocationProvider>
      </FormProvider>
    ),
    loader: userDetailsLoader,
    children: [
      {
        index: true,
        element: <HomePage />,
        loader: homePageLoader,
      },
      {
        path: '/restaurants',
        element: <Restaurant />,
        loader: restaurantLoader,
      },
      {
        path: '/restaurants/:id',
        element: <FormProvider><RestaurantDetail /></FormProvider>,
        loader: restaurantDetailLoader,
        action: addToBookmarkAction,
        children: [
          {
            path: '/restaurants/:id/online-order',
            element: <FoodCardList />,
          },
          {
            path: '/restaurants/:id/gallery',
            element: <RestaurantGallery />,
            loader: restaurantGalleryLoader,
          },
          {
            path: '/restaurants/:id/reviews',
            element: (<FormProvider>
              <Forms />
              <ReviewProvider>
                <RestaurantReviews />
              </ReviewProvider>
            </FormProvider>),
            loader: restaurantReviewsLoader,
          }
        ]
      },
      {
        path: '/profile/:id',
        element: <Profile />,
        loader: profilePictureLoader,
        children: [
          {
            path: 'reviews',
            element: <ProfileReviews />,
            loader: profileReviewsLoader,
          },
          {
            path: 'photos',
            element: <ProfilePhotos />,
            loader: photosLoader,
          },
          {
            path: 'bookmarks',
            element: <PorfileBookmarks />,
            loader: bookmarkLoader,
          },
          {
            path: 'followers',
            element: <ProfileFollowers />,
            loader: followDataLoader,
            action: RemoveFollowingAction,
          },
        ]
      },
      {
        path: '/user/:id',
        element: (<FormProvider><UserProfile /></FormProvider>),
        loader: userPorfilePictureLoader,
        action: FollowUnFollowAction,
        children: [
          {
            path: 'reviews',
            element: <ProfileReviews />,
            loader: profileReviewsLoader,
          },
          {
            path: 'photos',
            element: <ProfilePhotos />,
            loader: photosLoader,
          },
          {
            path: 'bookmarks',
            element: <PorfileBookmarks />,
            loader: bookmarkLoader,
          },
          {
            path: 'followers',
            element: <ProfileFollowers edit='false' />,
            loader: followDataLoader,
            action: RemoveFollowingAction,
          },
        ]
      }
    ],
  },
  {
    path: "/logout",
    action: logoutAction,
  }
]);

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
};
