import React, { useEffect } from 'react';

const MapComponent = ({ addressList }) => {
    useEffect(() => {
        // Kakao Maps API script load
        const script = document.createElement('script');
        script.src = "https://dapi.kakao.com/v2/maps/sdk.js?appkey=954c56e411af6cf22c15660906e30af8&libraries=services";
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            const kakao = window.kakao; // Access kakao from window
            const container = document.getElementById('map');
            const options = {
                center: new kakao.maps.LatLng(33.450701, 126.570667),
                level: 3
            };
            const map = new kakao.maps.Map(container, options);
            const geocoder = new kakao.maps.services.Geocoder();
            const markers = [];
            const positions = [];
            const bounds = new kakao.maps.LatLngBounds(); // LatLngBounds 객체 생성

            addressList.forEach((address, index) => {
                geocoder.addressSearch(address, (result, status) => {
                    if (status === kakao.maps.services.Status.OK && result[0]) {
                        const { x, y } = result[0].address || {}; // Destructure safely
                        if (x && y) {
                            const latLng = new kakao.maps.LatLng(y, x);

                            // Create a marker
                            const marker = new kakao.maps.Marker({
                                position: latLng,
                                map: map
                            });
                            markers.push(marker);
                            positions.push(latLng);

                            // Extend the bounds to include this position
                            bounds.extend(latLng);

                            // Draw a line connecting the markers when the last marker is added
                            if (index === addressList.length - 1) {
                                const polyline = new kakao.maps.Polyline({
                                    path: positions,
                                    strokeWeight: 3,
                                    strokeColor: '#171717',
                                    strokeOpacity: 0.7,
                                    strokeStyle: 'solid'
                                });
                                polyline.setMap(map);

                                // Adjust map bounds to include all markers
                                map.setBounds(bounds);
                            }
                        } else {
                            console.error(`Coordinates are missing for address: ${address}`);
                        }
                    } else {
                        console.error(`Address search failed for ${address}, status: ${status}`);
                    }
                });
            });
        };

        return () => {
            // Clean up script
            document.body.removeChild(script);
        };
    }, [addressList]);

    return (
        <div id="map" style={{ width: '100%', height: '500px' }}></div>
    );
};

export default MapComponent;
