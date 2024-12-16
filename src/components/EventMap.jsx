import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import L from "leaflet";
import {
  faUser,
  faLocationDot,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import { getEvents } from "../service/events";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../components/Button/PrimaryButton";
import SecondaryButton from "../components/Button/SecondaryButton";
const API_URL = import.meta.env.VITE_API_URL;

const EventMap = () => {
  const [isListVisible, setIsListVisible] = useState(false);
  const [eventos, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate();

  const categoryStyles = {
    encuentro: "bg-red-200 text-red-800",
    competencia: "bg-blue-200 text-blue-800",
    rally: "bg-green-200 text-green-800",
    exhibición: "bg-yellow-200 text-yellow-800",
    otros: "bg-gray-200 text-gray-800",
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsData = await getEvents();
        setEvents(eventsData.data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Error al cargar los eventos. Intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const toggleListVisibility = () => {
    setIsListVisible(!isListVisible);
  };

  const handleEventShow = (event) => {
    setSelectedEvent(event);
    navigate(`/events/${event._id}`);
  };

  const MapFlyTo = ({ event }) => {
    const map = useMap();

    useEffect(() => {
      if (event && map) {
        map.flyTo([event.latitude, event.longitude], 15);
      }
    }, [event, map]);

    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100   ">
        <div className="loader">
          <svg
            xml:space="preserve"
            viewBox="0 0 254.532 254.532"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            xmlns="http://www.w3.org/2000/svg"
            id="Capa_1"
            version="1.1"
            className="wheel"
          >
            <g>
              <path
                d="M127.267,0C57.092,0,0,57.091,0,127.266s57.092,127.266,127.267,127.266c70.174,0,127.266-57.091,127.266-127.266
      S197.44,0,127.267,0z M127.267,217.656c-49.922,0-90.391-40.468-90.391-90.39s40.469-90.39,90.391-90.39
      c49.92,0,90.39,40.468,90.39,90.39S177.186,217.656,127.267,217.656z"
                id="tire"
              ></path>
              <path
                d="M127.267,48.578c-43.39,0-78.689,35.299-78.689,78.688c0,43.389,35.3,78.688,78.689,78.688
      c43.389,0,78.688-35.299,78.688-78.688C205.955,83.877,170.655,48.578,127.267,48.578z M195.878,122.249h-38.18
      c-0.78-4.825-2.686-9.275-5.435-13.079l26.954-26.954C188.679,93.112,194.771,106.996,195.878,122.249z M132.204,58.648
      c15.244,1.087,29.123,7.156,40.025,16.591l-26.948,26.949c-3.804-2.748-8.253-4.653-13.077-5.433V58.648z M122.329,58.648v38.106
      c-4.824,0.78-9.274,2.685-13.078,5.434L82.302,75.24C93.204,65.805,107.085,59.735,122.329,58.648z M75.313,82.217l26.955,26.954
      c-2.749,3.803-4.654,8.253-5.434,13.077h-38.18C59.761,106.996,65.853,93.113,75.313,82.217z M58.643,132.123h38.192
      c0.779,4.824,2.685,9.274,5.434,13.078l-27.029,27.029C65.788,161.308,59.714,147.398,58.643,132.123z M122.329,195.884
      c-15.285-1.09-29.197-7.188-40.113-16.666l27.035-27.035c3.804,2.749,8.254,4.654,13.078,5.434V195.884z M122.329,147.459v0.072
      c-2.131-0.518-4.131-1.36-5.953-2.474l0.047-0.047c-2.85-1.738-5.244-4.132-6.982-6.983l-0.046,0.046
      c-1.114-1.822-1.956-3.821-2.474-5.952h0.071c-0.385-1.585-0.611-3.233-0.611-4.937c0-1.704,0.227-3.352,0.611-4.937h-0.071
      c0.518-2.13,1.359-4.129,2.474-5.951l0.046,0.046c1.738-2.85,4.133-5.245,6.982-6.982l-0.047-0.047
      c1.822-1.114,3.822-1.957,5.953-2.474v0.072c1.586-0.385,3.233-0.612,4.938-0.612s3.352,0.227,4.938,0.612v-0.072
      c2.131,0.518,4.13,1.359,5.951,2.473l-0.047,0.047c2.851,1.737,5.245,4.132,6.983,6.982l0.046-0.046
      c1.115,1.822,1.957,3.822,2.475,5.953h-0.071c0.385,1.585,0.611,3.233,0.611,4.937c0,1.704-0.227,3.352-0.611,4.937h0.071
      c-0.518,2.131-1.359,4.131-2.475,5.953l-0.046-0.046c-1.738,2.85-4.133,5.244-6.983,6.982l0.047,0.046
      c-1.821,1.114-3.82,1.956-5.951,2.474v-0.072c-1.586,0.385-3.233,0.612-4.938,0.612S123.915,147.845,122.329,147.459z
      M132.204,195.884v-38.267c4.824-0.78,9.273-2.685,13.077-5.433l27.034,27.034C161.4,188.696,147.488,194.794,132.204,195.884z
      M179.292,172.23l-27.028-27.028c2.749-3.804,4.654-8.254,5.435-13.079h38.191C194.818,147.398,188.745,161.308,179.292,172.23z"
                id="rim"
              ></path>
            </g>
          </svg>
          <div className="road"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-700">{error}</p>;
  }

  if (eventos.length === 0) {
    return <p className="text-center">No hay eventos disponibles.</p>;
  }

  return (
    <div className="flex fixed z-0 h-screen w-full">
      {isListVisible && (
        <div className="md:w-9/12 sm:w-full bg-white shadow-lg mt-16">
          <div className="h-full overflow-y-auto p-4">
            {eventos.map((event) => (
              <div
                key={event._id}
                className="border-b py-2 px-3 flex flex-col text-sm w-full"
              >
                <div
                  onClick={() => setSelectedEvent(event)}
                  className="cursor-pointer border rounded shadow-md w-full"
                >
                  <img
                    src={
                      event.image ? `${event.image}` : "../default-image.jpg"
                    }
                    alt="Post"
                    className="w-full h-48 object-cover object-center rounded-t"
                  />
                  <div className="w-full p-4 ">
                    <div>
                      <p className="text-gray-500 text-sm mt-2">
                        {new Date(event.createdAt).toLocaleDateString()}
                      </p>
                      <p className="font-bold  text-2xl">{event.title}</p>
                      <p className="font-medium text-gray-600 mb-2">
                        {event.description.length > 80
                          ? `${event.description.substring(0, 80)}...`
                          : event.description}
                      </p>

                      <p className="flex items-center text-gray-500 mb-2">
                        <FontAwesomeIcon
                          icon={faLocationDot}
                          className="mr-1"
                        />
                        {event.location}
                      </p>

                      <p className="text-gray-500 mb-2">
                        <FontAwesomeIcon icon={faUser} className="mr-1" />
                        {event.participants.length}
                      </p>

                      {event.category && (
                        <span
                          className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                            categoryStyles[event.category.toLowerCase()] ||
                            categoryStyles.otros
                          }`}
                        >
                          {event.category}
                        </span>
                      )}

                      <div className="mt-2 flex justify-end">
                        <PrimaryButton
                          onClick={() => handleEventShow(event)}
                          className="mt-4"
                        >
                          Ver más
                        </PrimaryButton>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className=" fixed bottom-16 left-1/2 z-50">
        <SecondaryButton onClick={toggleListVisibility}>
          {isListVisible ? "Ocultar eventos" : "Mostrar eventos"}
        </SecondaryButton>
      </div>
      <MapContainer
        center={[-34.5937, -58.4416]}
        zoom={12}
        className="mt-16 h-screen w-full z-0"
      >
        <TileLayer
          url="https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWlndWVsamltZW5leiIsImEiOiJjbTNtYm1zZzUxMDJhMmpwcm51b3hna2RkIn0.9QKStVrjBehwt8j5GbyGig"
          id="mapbox/streets-v9"
          tileSize={512}
          zoomOffset={-1}
          attribution='&copy; <a href="https://www.mapbox.com/">Mapbox</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {eventos.map((event) => (
          <Marker
            key={event._id}
            position={[event.latitude, event.longitude]}
            icon={L.divIcon({
              className: "custom-icon",
              html: `<img src="${event.image}" alt="${event.title}" class="h-10 w-10 rounded-full object-cover object-center">`,
            })}
          >
            <Popup
              closeButton={true}
              autoClose={true}
              closeOnClick={true}
              autoPan={true}
              className=""
            >
              <div
                onClick={() => handleEventShow(event)}
                className=" cursor-pointer"
              >
                <img
                  src={`${event.image}`}
                  alt={event.title}
                  className="h-36 w-full object-cover object-center m-0"
                />
                <p className="font-bold">{event.title}</p>
                <p className="text-gray-500">
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                  {new Date(event.date).toLocaleDateString()}
                </p>
                <p className="text-gray-500 text-xs">
                  <FontAwesomeIcon icon={faLocationDot} className="mr-1" />
                  {(event.location.length > 30 &&
                    `${event.location.substring(0, 30)}...`) ||
                    event.location}
                </p>
                <p className="text-gray-500">
                  <FontAwesomeIcon icon={faUser} className="mr-1" />
                  {event.participants.length}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
        {selectedEvent && <MapFlyTo event={selectedEvent} />}
      </MapContainer>
    </div>
  );
};

EventMap.propTypes = {
  eventos: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      participants: PropTypes.array.isRequired,
      category: PropTypes.string,
      image: PropTypes.string.isRequired,
    })
  ),
};

export default EventMap;
