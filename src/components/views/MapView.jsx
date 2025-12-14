import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSamples } from "../../redux/slice/samplesSlice";
import MapSampleDetailsModal from "../modals/MapSampleDetailsModal";
import { MapPin } from "lucide-react";
import Map from "../other/Map";

// coordinates for LAGOS
const defaultPosition = [6.5244, 3.3792];

const FitBounds = ({ markers }) => {
  const map = useMap();
  useEffect(() => {
    if (markers.length > 0) {
      try {
        const bounds = L.latLngBounds(
          markers.map((m) => {
            return [parseFloat(m.gpsLatitude), parseFloat(m.gpsLongitude)];
          })
        );

        map.fitBounds(bounds, { padding: [50, 50] });
      } catch (e) {
        console.error(e.message);
      }
    }
  }, []);
};

const iconObject = (samplesLength, position) => {
  return new L.divIcon({
    className: "",
    html: ` <div class='relative '>
                <img
                src=${markerIcon}
                alt='marker'
                class='h-[50px]'
                />
                ${
                  samplesLength > 1
                    ? `<span class='absolute rounded-full grid place-items-center -top-2 -left-2 w-6 h-6 bg-red-800 text-white  '>
                ${samplesLength}
                </span>`
                    : ""
                }    
            </div>`,

    shadowUrl: markerShadow,
    iconSize: null,
    iconAnchor: position,
    popupAnchor: [-5, -35],
  });
};

const MapView = ({ theme: propTheme, samples: propSamples }) => {
  const dispatch = useDispatch();
  const { samples: reduxSamples } = useSelector((state) => state.samples);
  const samples = propSamples || reduxSamples || [];

  const [mapDetails, setMapDetails] = useState({
    isOpen: false,
    samples: null,
  });

  // Fetch samples on mount if not provided via props
  useEffect(() => {
    if (!propSamples) {
      dispatch(fetchSamples());
    }
  }, [dispatch, propSamples]);

  const sameLngAndLat = (samplesArray, LatAndLngArray) => {
    return samplesArray.filter(
      (s) =>
        parseFloat(s.gpsLatitude) === parseFloat(LatAndLngArray[0]) &&
        parseFloat(s.gpsLongitude) === parseFloat(LatAndLngArray[1])
    );
  };

  const getDefaultIcon = (samples, position) => {
    const samplesLength = sameLngAndLat(samples, position).length;
    return iconObject(samplesLength, position);
  };

  const handleMarkerClick = (samplesArray, LatAndLngArray) => {
    const samplesWithSameCoordinates = sameLngAndLat(
      samplesArray,
      LatAndLngArray
    );
    setMapDetails({ isOpen: true, samples: samplesWithSameCoordinates });
  };

  // Filter samples with GPS coordinates
  const samplesWithCoords =
    samples?.filter((s) => s.gpsLatitude && s.gpsLongitude) || [];

  if (samplesWithCoords.length === 0) {
    return (
      <div
        className={`${propTheme?.card} rounded-lg shadow-md p-6 border ${propTheme?.border} text-center py-12`}
      >
        <MapPin className='w-16 h-16 mx-auto mb-4 text-gray-400' />
        <p className={propTheme?.textMuted}>
          No samples with GPS coordinates yet
        </p>
      </div>
    );
  }

  return (
    <>
      <div className='border-0 rounded-xl overflow-hidden shadow-2xl bg-white dark:bg-gray-800'>
        {/* Map Header */}
        <div className='bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 dark:from-blue-700 dark:via-blue-600 dark:to-cyan-600 px-6 py-4 flex items-center gap-3'>
          <div className='w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm'>
            <svg
              className='w-6 h-6 text-white'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 20l-5.447-2.724A1 1 0 003 16.382V5.618a1 1 0 011.553-.894L9 7m0 13l6.447 3.268A1 1 0 0021 19.382V8.618a1 1 0 00-1.553-.894L15 10m0 13V7m0 0L9.553 3.732A1 1 0 008 4.618v10.764'
              />
            </svg>
          </div>
          <div>
            <h2 className='text-xl font-bold text-white'>
              Geographic Distribution
            </h2>
            <p className='text-blue-100 text-sm'>
              Interactive map of sample locations
            </p>
          </div>
          {samplesWithCoords.length > 0 && (
            <div className='ml-auto bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg'>
              <p className='text-white font-semibold text-sm'>
                {samplesWithCoords.length} samples
              </p>
            </div>
          )}
        </div>
        <Map samples={samplesWithCoords} />
      </div>
    </>
  );
};

export default MapView;
