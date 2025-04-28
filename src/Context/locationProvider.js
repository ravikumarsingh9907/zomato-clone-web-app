import axios from 'axios';
import { useState } from "react";

import { createContext } from "react";

const locationContext = createContext({});

export {locationContext};

export default function LocationProvider(props) {
    const [location, setLocation] = useState('New Delhi');

    const handleLocation = () => {
        getLocation();
        function getLocation() {
            navigator.geolocation.getCurrentPosition(showPosition);
        };
        async function showPosition(position) {
            const location = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${position.coords.longitude},${position.coords.latitude}.json?access_token=pk.eyJ1IjoicmF2aWt1bWFyc2luZ2g5OTA3IiwiYSI6ImNsa3RsM2RqNzAxYWozZG1xNGowa3hxbDIifQ.KHPGIHq4xCg6h4fPlN_4Hg`);
            setLocation(location.data.features[0].text + ', '+ location.data.features[4].text);
        }
    }

    const data = { 
        handleLocation,
        location
    }

    return(
        <locationContext.Provider value={data}>
            {props.children}
        </locationContext.Provider>
    )
}