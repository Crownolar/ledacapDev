import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useEffect } from "react";

// L.Icon.Default.mergeOptions({
//   iconUrl: markerIcon,
//   shadownUrl: markerShadow,
// });

const defaultPosition = [6.5244, 3.3792];

const FitBounds = ({ markers }) => {
  const map = useMap();

  useEffect(() => {
    console.log(markers);
    if (markers.length > 0) {
      try {
        setTimeout(() => {
          const bounds = L.latLngBounds(
            markers.map((m) => {
              console.log([m.coordinates.lat, m.coordinates.lng]);
              return [m.coordinates.lat, m.coordinates.lng];
            })
          );
          map.fitBounds(bounds, { padding: [50, 50] });
        }, 3000);
      } catch (e) {
        console.log(e.message);
      }
    }
  }, [map, markers]);
};

const getDefaultIcon = (position) => {
  console.log(position);
  return new L.Icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [30, 45],
    iconAnchor: position,
    popupAnchor: position,
  });
};

export default function Map({ samples }) {
  return (
    <>
      <div className='border border-red-950'>
        <MapContainer
          center={defaultPosition}
          zoom={13}
          style={{
            height: "600px",
            width: "100%",
          }}
        >
          <TileLayer
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          ></TileLayer>
          {samples.map((s) => (
            <Marker
              key={s.id}
              position={[s.coordinates.lat, s.coordinates.lng]}
              icon={getDefaultIcon([[s.coordinates.lat, s.coordinates.lng]])}
            >
              <Popup>
                hello there
                {/* <div className='flex flex-col'>
                  <p>{s.state}</p>
                  <p>Total:{2} samples</p>
                </div> */}
              </Popup>
            </Marker>
          ))}
          {/* <FitBounds markers={samples} /> */}
        </MapContainer>

        <div>
          <h1>samples[0].market</h1>
        </div>
      </div>
    </>
  );
}
