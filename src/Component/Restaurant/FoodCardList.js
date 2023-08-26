import { useState, useEffect } from 'react';
import './foodCardList.scss';
import FoodCard from './Layout/FoodCard';
import { useLoaderData, useNavigation } from 'react-router-dom';
import OnlineOrderLoader from './Loaders/OrdersLoader';
import GalleryLoader from './Loaders/PhotosLoader';
import ReviewsLoader from './Loaders/ReviewLoader';
import UnviersalLoader from '../Layout/PreLoader';

export default function FoodCardList() {
    const [inputValue, setInputValue] = useState('');
    const { dishes } = useLoaderData();
    const navigation = useNavigation();
    const [renderLoader, setRenderLoader] = useState('');

    useEffect(() => {
        if (navigation.location && navigation.location.pathname.endsWith('/gallery') && !navigation.formMethod) {
            setRenderLoader(<GalleryLoader />);
        } else if (navigation.location && navigation.location.pathname.endsWith('/online-order') && !navigation.formMethod) {
            setRenderLoader(<OnlineOrderLoader />);
        } else if (navigation.location && navigation.location.pathname.endsWith('/reviews') && !navigation.formMethod) {
            setRenderLoader(<ReviewsLoader />);
        } else if (!navigation.formMethod) {
            setRenderLoader(<UnviersalLoader />);
        }
    }, [navigation])

    const renderCards = dishes && dishes.map(food => {
        return (
            <FoodCard data={food} />
        )
    });

    const handleOnChange = (e) => {
        setInputValue(e.target.value);
    }

    const clearInputValue = () => {
        setInputValue('');
    }

    return (
        <>
            {navigation.state === 'loading' && !navigation.formMethod ? renderLoader : <div className='food-card-list-wrapper'>
                <div className='online-order-container'>
                    <div className='online-order-wrapper'>
                        <p className='heading'>Order Online</p>
                        <p className='track-order'>
                            <i className='bx bx-compass' ></i>
                            <span>Live track your order</span>
                        </p>
                    </div>
                    <form className='search-restaurant-food'>
                        <i className='bx bx-search search-icon'></i>
                        <input className='search' placeholder='Search within menu' value={inputValue} onChange={handleOnChange} />
                        <i className='bx bx-x close-icon' onClick={clearInputValue}></i>
                    </form>
                </div>
                <div className='food-card-wrapper'>
                    {renderCards}
                </div>
            </div>}
        </>
    )
}

export async function loader({ params }) {
    const response = await fetch(`http://localhost:3300/restaurants/${params.id}/dishes`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const { dishes } = await response.json();

    return {
        dishes
    }
}