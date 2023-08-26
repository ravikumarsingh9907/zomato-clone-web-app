import './notFound.scss';

export default function NotFound({image, description}) {
    return (
        <div className='not-found'>
            <img src={image} alt='img'/>
            <p>{description}</p>
        </div>
    )
}