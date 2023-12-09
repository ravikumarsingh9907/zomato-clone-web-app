import CardList from "../Component/CardList";
import Header from '../Component/Header';
import RestaurantList from '../Component/RestaurantList';
import LocationProvider from '../Context/locationProvider';
import { useLoaderData, useNavigation } from 'react-router';
import UniversalLoader from '../Component/Layout/PreLoader';
import Footer from "../Component/Footer";

export default function Home() {
    const { brands, cuisines } = useLoaderData();
    const navigation = useNavigation();

    const css = {
        backgroundColor: "rgb(128 128 128 / 8%",
        boxShadow: "rgba(0, 0, 0, 0) 0px 0px 0px",
        width: '100%',
    };

    return (
        <>
        { navigation.state !== 'loading' ? <div className='home-page-container'>
            <Header />
            <CardList data={cuisines} heading='Inspiration for your first order' css={css} />
            <CardList data={brands} heading='Top brands for you' />
            <LocationProvider>
                <RestaurantList data={brands} />
            </LocationProvider>
            <Footer />
        </div> : <UniversalLoader />
        }
        </>
    )
}

export async function loader() {
    const brandResponse = await fetch("http://localhost:3333/restaurants", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        }
    });

    const cuisineResponse = await fetch("http://localhost:3333/cuisines", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const { brands } = await brandResponse.json();
    const { cuisines } = await cuisineResponse.json();
    return {
        brands,
        cuisines,
    };
}