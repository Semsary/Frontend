import React, { useState } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

const libraries = ["places"];

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const center = {
  lat: 25.6829748,
  lng: 32.6461548,
};

const MapLocation = ({ addLocation }) => {
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: API_KEY,
    libraries,
  });

  const [location, setLocation] = useState({
    country: "",
    city: "",
    district: "",
    street: "",
    lat: null,
    lng: null,
  });

  const handleMapClick = async (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    // console.log(lat, lng);

    const geocodeResponse = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`
    );
    const geocodeData = await geocodeResponse.json();

    // console.log(geocodeData);

    if (geocodeData.results.length > 0) {
      const addressComponents = geocodeData.results[0].address_components;
      const newLocation = {
        country: "",
        city: "",
        district: "",
        street: "",
        lat,
        lng,
      };

      addressComponents.forEach((component) => {
        const types = component.types;

        if (types.includes("country")) {
          newLocation.country = component.long_name;
        } else if (types.includes("administrative_area_level_1")) {
          newLocation.city = component.long_name;
        } else if (types.includes("administrative_area_level_2")) {
          newLocation.district = component.long_name;
        } else if (types.includes("route")) {
          newLocation.street = component.long_name;
        }
      });

      setLocation(newLocation);
      //   console.log("newLocation", newLocation);
      addLocation(newLocation);
    } else {
      console.error("Geocode API did not return valid data.");
    }
  };

  if (!isLoaded)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="w-full py-4">
      <h3 className="text-lg font-semibold text-center my-2 ">
        اختر الموقع على الخريطة
      </h3>
      <div className="rounded-xl h-64   shadow-lg overflow-hidden">
        <GoogleMap
          width="100%"
          mapContainerStyle={mapContainerStyle}
          zoom={15}
          center={center}
          onClick={handleMapClick}
        >
          {location.lat && location.lng ? (
            <Marker position={{ lat: location.lat, lng: location.lng }} />
          ) : (
            <div>No location selected</div>
          )}
        </GoogleMap>
      </div>
    </div>
  );
};

export default MapLocation;
