import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useEffect } from "react";
import { useRef } from "react";
import StatCard from "../common/StatCard";
import MapSampleDetails from "../modals/mapSampleDetails";

// L.Icon.Default.mergeOptions({
//   iconUrl: markerIcon,
//   shadownUrl: markerShadow,
// });

const defaultPosition = [6.5244, 3.3792];

const FitBounds = ({ markers }) => {
  const map = useMap();

  useEffect(() => {
    // console.log(markers);
    if (markers.length > 0) {
      try {
        const bounds = L.latLngBounds(
          markers.map((m) => {
            return [m.coordinates.lat, m.coordinates.lng];
          })
        );
        map.fitBounds(bounds, { padding: [50, 50] });
      } catch (e) {
        console.log(e.message);
      }
    }
  }, []);
};

const getDefaultIcon = (position) => {
  return new L.Icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [30, 45],
    iconAnchor: position,
    popupAnchor: [-5, -35],
  });
};

function handleClick(e) {
  console.log("ive been clicked");
}

export default function Map({ samples }) {
  const popupRef = useRef(null);
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
          {samples.map((s) => {
            if (s.coordinates.lat && s.coordinates.lng) {
              return (
                <Marker
                  key={s.id}
                  ref={popupRef}
                  position={[s.coordinates.lat, s.coordinates.lng]}
                  icon={getDefaultIcon([s.coordinates.lat, s.coordinates.lng])}
                  eventHandlers={{
                    mouseover: (e) => e.target.openPopup(),
                    click: (e) => {
                      // Prevent Leaflet default popup toggle
                      e.originalEvent.stopPropagation();
                    },
                    mouseout: (e) => e.target.closePopup(),
                  }}
                >
                  <Popup
                    closeOnClick={false}
                    autoClose={false}
                    closeButton={false}
                  >
                    <div>
                      <h3>{s.state}</h3>
                      <h4>Total: 2 samples</h4>
                      <p>👍</p>
                    </div>
                  </Popup>
                </Marker>
              );
            }
          })}
          {/* fit bounds makes all the markers show at once after rendering */}
          <FitBounds markers={samples} />
        </MapContainer>
        {/* Overlay */}
        <MapSampleDetails />
      </div>
    </>
  );
}
