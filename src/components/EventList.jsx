// src/components/EventList.jsx
import React, { useEffect, useState } from "react";
import { getEvents, joinEvent } from "../service/events";

const EventList = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getEvents();
        setEvents(response.data);
      } catch (error) {
        console.error("Error al obtener los eventos", error);
      }
    };
    fetchEvents();
  }, []);

  const handleJoinEvent = async (eventId) => {
    try {
      await joinEvent(eventId);
      alert("Te has unido al evento exitosamente");
      // Actualizar la lista de eventos o el estado según sea necesario
    } catch (error) {
      console.error("Error al unirse al evento", error);
    }
  };

  return (
    <div>
      <h2>Lista de Eventos</h2>
      <ul>
        {events.map((event) => (
          <li key={event._id}>
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <button onClick={() => handleJoinEvent(event._id)}>Unirse</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventList;
