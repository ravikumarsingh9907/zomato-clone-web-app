import { useEffect, useState } from 'react';
import './foodCard.scss';

export default function FoodCard({ data, addToCart, removeFromCart, quantity }) {
    const [toggleDescription, setToogleDescription] = useState(false);

    useEffect(() => {
        if (data.description.length > 110) {
            setToogleDescription(!toggleDescription)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleDescriptionClick = () => {
        if (data.description.length > 110) {
            setToogleDescription(!toggleDescription)
        }
    }

    return (
        <div className='food-card-container'>
            <div className='image-container'>
                <div className='image'>
                    <img src={data.image} alt='img' />
                </div>
            </div>
            <div className='about-food-container'>
                <div className='food-name'>
                    <h2 className='name'>{data.name}</h2>
                </div>
                <div className='food-price'>
                    <p className='price'>
                        <i className='bx bx-rupee' ></i>
                        <span>{data.price}</span>
                    </p>
                </div>
                <div className='food-description'>
                    <p className='description'>
                        {toggleDescription && data.description.length > 110 ? data.description.slice(0, 110) + '...' : data.description}
                        {toggleDescription && <span onClick={handleDescriptionClick}>read more</span>}
                    </p>
                </div>
                {quantity ? <div className="food-card-actions">
                <button onClick={() => removeFromCart(data._id)} disabled={quantity === 0}>
                    -
                </button>
                <span>{quantity}</span>
                <button onClick={() => addToCart(data._id)}>+</button>
            </div> :
                <div className="food-card-actions">
                    <button onClick={() => addToCart(data._id)}>Add</button>
                </div>}
            </div>
        </div>
    )
}