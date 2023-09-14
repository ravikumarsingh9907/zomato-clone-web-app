import { imageMagnifier } from '../../../Context/image-magnifier';
import { useContext } from 'react';

export default function PhotoCard({data}) {
    const { handleIsOpen, elementRef } = useContext(imageMagnifier);

    const handleImageMagnifier = () => {
        handleIsOpen(true);
    }

    const renderPhotos = data.length && data.map(data => {
        return (
            data.images.map(image => {
                return (
                    <div className='image-container' onClick={handleImageMagnifier}>
                        <img src={image} alt='img' ref={elementRef}/>
                    </div>
                )
            })
        )
    });

    return (
        <>
            {renderPhotos}
        </>
    )
}