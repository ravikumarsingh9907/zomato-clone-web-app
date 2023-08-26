import Header from "../Component/Header";
import Forms from '../Component/Form';
import FormProvider from '../Context/formProvider';
import LocationProvider from '../Context/locationProvider';
import RestaurantList from "../Component/RestaurantList";
import { useNavigation } from "react-router";
import UniversalLoader from '../Component/Layout/PreLoader'

export default function Restaurant() {
    const navigation = useNavigation();
    
    return (
        <FormProvider>
            { navigation.state !== 'loading' ? <div className="restaurant-page-container">
                <Forms />
                < Header />
                <LocationProvider>
                    <RestaurantList />
                </LocationProvider>
            </div> : <UniversalLoader />
            }
        </FormProvider>
    )
}

export async function loader({request}) {
    const urlObj = new URL(request.url);
    const brandResponse = await fetch("http://localhost:3300/restaurants"+ urlObj.search, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        }
    });
    const { brands } = await brandResponse.json();

    return {
        brands,
    };
}