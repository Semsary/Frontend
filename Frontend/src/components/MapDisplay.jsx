import React from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

const libraries = ["places"];

const mapContainerStyle = {
    width: "100%",
    height: "100%",
};

const MapDisplay = ({ latitude, longitude, title = "موقع العقار" }) => {
    const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: API_KEY,
        libraries,
    });

    if (!isLoaded)
        return (
            <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );

    if (!latitude || !longitude) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                    <p>لا يمكن عرض الموقع</p>
                    <p className="text-sm">إحداثيات غير متوفرة</p>
                </div>
            </div>
        );
    }

    const center = {
        lat: parseFloat(latitude),
        lng: parseFloat(longitude),
    };

    return (
        <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={15}
            center={center}
            options={{
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: true,
            }}
        >
            <Marker
                position={center}
                title={title}
            />
        </GoogleMap>
    );
};

export default MapDisplay;
