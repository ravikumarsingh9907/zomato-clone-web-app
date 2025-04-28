import { useContext, useEffect, useState } from 'react';
import './restDetailHeader.scss';
import { Link, useLoaderData, Form, useNavigation } from 'react-router-dom';
import { formContext } from '../../Context/formProvider';

export default function RestDetailHeader() {
    const { handleLoginForm, handleFormVisibility } = useContext(formContext);
    const [isBookMarked, setIsBookMarked] = useState(false);
    const { brand, bookmarks, reviews } = useLoaderData();
    const [style, setStyle] = useState('100%');
    const [averageRating, setAverageRating] = useState(0);
    const navigation = useNavigation();
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        if ((navigation.state === 'submitting' || navigation.state === 'loading') && navigation.formMethod) {
            setStyle('60%');
        } else {
            setStyle('100%');
        }
    }, [navigation, reviews]);

    useEffect(() => {
        if (reviews.length > 0) {
            const initialValue = 0;
            const totalReview = reviews && reviews.reduce((acc, crr) => acc + crr.rating, initialValue);
            const average = totalReview / reviews.length;
            setAverageRating(average.toFixed(2));
        }
        //eslint-disable-next-line
    }, [])

    useEffect(() => {
        (async () => {
            const data = bookmarks?.length > 0 ? bookmarks.filter((bookmark) => bookmark.name === brand.name) : [];
            setIsBookMarked(data?.length !== 0);
        })();
    }, [bookmarks, brand]);

    const handleBookMarkClick = () => {
        if (!bookmarks) {
            handleFormVisibility('form-container');
            handleLoginForm();
        }
    }

    const handleCopyClick = () => {
        const urlToCopy = window.location.href;
    
        // Create a temporary input element to copy the URL
        const tempInput = document.createElement('input');
        tempInput.value = urlToCopy;
        document.body.appendChild(tempInput);
    
        // Select the URL text and copy it
        tempInput.select();
        document.execCommand('copy');
    
        // Clean up and display a success message
        document.body.removeChild(tempInput);
        setIsCopied(true);
    
        // Reset the success message after a few seconds
        setTimeout(() => {
          setIsCopied(false);
        }, 3000);
      };

    const descriptionArr = brand.description.split(',');

    const renderDescription = descriptionArr.map((item, index) => {
        return <Link to={`/restaurants?query=${item}`} key={item + '-' + index}>{item}, </Link>
    });

    return (
        <div className='food-detail-header-wrapper'>
            <div className='food-image-container'>
                <div className='img-list img-1'>
                    <div className='img'>
                        <img src={brand.gallery[0]} alt='img1' />
                    </div>
                </div>
                <div className='img-list img-2'>
                    <div className='img'>
                        <img src={brand.gallery[1]} alt='img1' />
                    </div>
                </div>
                <div className='img-list img-3'>
                    <div className='img'>
                        <img src={brand.gallery[2]} alt='img1' />
                    </div>
                </div>
                <div className='img-list img-4'>
                    <Link to={`/restaurants/${brand._id}/gallery`} className='img-overlay'>View Gallery</Link>
                    <div className='img'>
                        <img src={brand.gallery[3]} alt='img1' />
                    </div>
                </div>
            </div>
            <div className='about-food-container'>
                <div className='heading-description-location-container'>
                    <h1 className='heading'>{brand.name}</h1>
                    <div className='description'>
                        {renderDescription}
                    </div>
                    <p className='location'>{brand.locations[0].street + ', ' + brand.locations[0].city}</p>
                </div>
                <div className='rating-and-review-container'>
                    <div className='rating'>
                        <span className='digit'>{averageRating}</span>
                        <i className='bx bxs-star star'></i>
                    </div>
                    <div className='rating-count'>
                        <span className='digit'>{reviews && reviews.length ? reviews.length : 0}</span>
                        <span className='note'><a href='/'>Delivery Reviews</a></span>
                    </div>
                </div>
            </div>
            <div className='bookmark-share-container'>
                {!isBookMarked && <Form method='post' style={{ opacity: style }}>
                    <button className='bookmark-btn btn not-bookmarked' onClick={handleBookMarkClick}>
                        {(navigation.state === 'submitting' || navigation.state === 'loading') && navigation.formMethod ? <i className='bx bx-loader-alt loader'></i> : <i className='bx bx-bookmark-plus'></i>}
                        <span className='action'>Bookmark</span>
                    </button>
                </Form>}
                {isBookMarked && <Form method='delete' style={{ opacity: style }}>
                    <button className='bookmark-btn btn bookmarked' onClick={handleBookMarkClick}>
                        {(navigation.state === 'submitting' || navigation.state === 'loading') && navigation.formMethod ? <i className='bx bx-loader-alt loader'></i> : <i className='bx bxs-bookmark-star'></i>}
                        <span className='action'>Bookmark</span>
                    </button>
                </Form>}
                {isCopied ? <button className='share-btn btn' style={{backgroundColor: 'rgb(58, 183, 87)', color: 'white', border: 'none'}}>
                    <span className='action'>URL Copied</span>
                </button> : <button className='share-btn btn' onClick={handleCopyClick}>
                    <i className='bx bx-share bx-flip-horizontal' ></i>
                    <span className='action'>Share</span>
                </button>}
            </div>
        </div>
    )
}