import React, { useEffect, useState } from 'react';

const MapComponent = ({ addressList, focusedIndex }) => {
    const [markers, setMarkers] = useState([]);
    const [polylines, setPolylines] = useState([]);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://dapi.kakao.com/v2/maps/sdk.js?appkey=954c56e411af6cf22c15660906e30af8&libraries=services";
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            const kakao = window.kakao;
            const container = document.getElementById('map');
            const options = {
                center: new kakao.maps.LatLng(33.450701, 126.570667),
                level: 3
            };
            const map = new kakao.maps.Map(container, options);
            const geocoder = new kakao.maps.services.Geocoder();
            const bounds = new kakao.maps.LatLngBounds();
            const newMarkers = [];
            const newPolylines = [];

            // Convert addressList to LatLng coordinates
            Promise.all(
                addressList.map((address) =>
                    new Promise((resolve) => {
                        geocoder.addressSearch(address, (result, status) => {
                            if (status === kakao.maps.services.Status.OK && result[0]) {
                                const { x, y } = result[0];
                                const latLng = new kakao.maps.LatLng(y, x);
                                resolve(latLng);
                            } else {
                                resolve(null);
                            }
                        });
                    })
                )
            ).then((results) => {
                // Create markers
                results.forEach((latLng, index) => {
                    if (latLng) {
                        const isFocused = index === focusedIndex;
                        const markerImage = new kakao.maps.MarkerImage(
                            isFocused
                                ? '/marker2.png'  // Focused marker image
                                : '/marker.png',       // Default marker image
                            new kakao.maps.Size(64, 69),
                            { offset: new kakao.maps.Point(32, 69) }  // Center the marker image
                        );

                        const marker = new kakao.maps.Marker({
                            position: latLng,
                            map: map,
                            image: markerImage,
                            clickable: true
                        });

                        newMarkers.push(marker);
                        bounds.extend(latLng);

                        // Create a polyline if not the first marker
                        if (index > 0 && results[index - 1]) {
                            const polyline = new kakao.maps.Polyline({
                                path: [results[index - 1], latLng],
                                strokeWeight: 5,
                                strokeColor: '#ff9ef770', // Line color (purple)
                                strokeOpacity: 0.7,
                                strokeStyle: 'solid'
                            });
                            polyline.setMap(map);
                            newPolylines.push(polyline);
                        }
                    }
                });

                map.setBounds(bounds);
                setMarkers(newMarkers);
                setPolylines(newPolylines);
            });
        };

        return () => {
            document.body.removeChild(script);
            markers.forEach(marker => marker.setMap(null));
            polylines.forEach(polyline => polyline.setMap(null));
        };
    }, [addressList, focusedIndex]);

    return (
        <div id="map" style={{ width: '100%', height: '500px' }}></div>
    );
};

export default MapComponent;
