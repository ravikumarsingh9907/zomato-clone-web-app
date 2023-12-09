export default function PhotosLoader() {
    return (
        <div className='photos-wrapper'>
            <div className='photos-heading'>
                <h2 className='heading'>Photos</h2>
            </div>
            <div className='list-container-loader'>
                <div className='image-container-loader'></div>
                <div className='image-container-loader'></div>
                <div className='image-container-loader'></div>
                <div className='image-container-loader'></div>
                <div className='image-container-loader'></div>
                <div className='image-container-loader'></div>
                <div className='image-container-loader'></div>
                <div className='image-container-loader'></div>
            </div>
        </div>
    )
}