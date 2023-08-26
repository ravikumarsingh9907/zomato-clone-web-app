import './restaurantList.scss';
import RectangleCard from './Layout/RectangleCard';
import { locationContext } from '../Context/location-context';
import { useContext, useEffect } from 'react';
import { useLoaderData } from "react-router-dom";

export default function RestaurantList() {
    const { brands } = useLoaderData();
    const { location, handleLocation } = useContext(locationContext);

    useEffect(() => {
        handleLocation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderList = brands.map(item => {
        return <RectangleCard data={item} key={item._id}/>
    });

    return (
        <div className='restaurant-wrapper'>
            <div className='heading-container'>
                <h2 className='heading'>Delivery restaurants in {location}</h2>
            </div>
            <div className='restaurant-list-container'>
                {renderList}
            </div>
        </div>
    )
}