// src/components/EventDetail.jsx
import React, { useEffect, useState } from "react";
import { getEvent, leaveEvent } from "../service/Events";
import { useParams } from "react-router-dom";

const EventDetail = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await getEvent(eventId);
        setEvent(response.data);
      } catch (error) {
        console.error("Error al obtener el evento", error);
      }
    };
    fetchEvent();
  }, [eventId]);

  const handleLeaveEvent = async () => {
    try {
      await leaveEvent(eventId);
      alert("Has abandonado el evento exitosamente");
    } catch (error) {
      console.error("Error al abandonar el evento", error);
    }
  };

  return (
    <div>
      {event ? (
        <>
          <h2>{event.title}</h2>
          <p>{event.description}</p>
          <p>Fecha: {new Date(event.date).toLocaleDateString()}</p>
          <button onClick={handleLeaveEvent}>Abandonar Evento</button>
        </>
      ) : (
        <p>Cargando evento...</p>
      )}
    </div>
  );
};

export default EventDetail;
