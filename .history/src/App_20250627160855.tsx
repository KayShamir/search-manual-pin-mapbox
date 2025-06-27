import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { SearchBox } from "@mapbox/search-js-react";
import "mapbox-gl/dist/mapbox-gl.css";

const accessToken = "pk.eyJ1Ijoia2F5c2hhbWlyIiwiYSI6ImNtODl2YmtjYjAwN2EybG9odzZweXdhb2QifQ.C5EUWZuBSRb85zlFfnC4IA";
mapboxgl.accessToken = accessToken;

export default function MapWithGeocoder() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  const [selectedLocation, setSelectedLocation] = useState<{ lng: number; lat: number; } | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [lastPinType, setLastPinType] = useState<"manual" | "search" | null>( null );

  useEffect(() => {
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current!,
      center: [123.8869, 10.3291],
      zoom: 15,
      style: "mapbox://styles/mapbox/streets-v11",
    });

    mapRef.current.on("click", (e) => {
      const { lng, lat } = e.lngLat;
      placeMarker(lng, lat, "manual");
    });

    return () => mapRef.current?.remove();
  }, []);

  const placeMarker = (
    lng: number,
    lat: number,
    type: "manual" | "search"
  ) => {  
    if (markerRef.current) markerRef.current.remove();

    const marker = new mapboxgl.Marker({
      color: "green",
    })
      .setLngLat([lng, lat])
      .addTo(mapRef.current!);

    markerRef.current = marker;
    setSelectedLocation({ lng, lat });
    setLastPinType(type);

    mapRef.current?.flyTo({ center: [lng, lat] });
  };

  return (
    <div className="relative flex flex-col items-center justify-center">
      <SearchBox
        accessToken={accessToken}
        map={mapRef.current}
        mapboxgl={mapboxgl}
        value={inputValue}
        onChange={setInputValue}
        onRetrieve={(res) => {
          const coords = res?.features?.[0]?.geometry?.coordinates;
          if (coords) {
            placeMarker(coords[0], coords[1], "search");
          }
        }}
        options={{ language: "en", country: "PH" }}
      />

      <div
        ref={mapContainerRef}
        id="map-container"
        className="w-[222vh] h-[700px]"
      />
      {selectedLocation && (
        <div style={{ fontSize: "0.95rem" }}>
          <b>Coordinates:</b> {selectedLocation.lat.toFixed(6)},{" "}
          {selectedLocation.lng.toFixed(6)}
        </div>
      )}
    </div>
  );
}
