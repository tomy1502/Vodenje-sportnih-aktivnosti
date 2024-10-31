import React from "react";
import { Event } from "../services/api";
import { eventDateToSlovenian } from "../modules/functions/eventHelperFunctions";

interface EventDetailsProps {
    event: Event;
}

const EventDetails: React.FC<EventDetailsProps> = ({event}: EventDetailsProps) => {
    return (
        <div className="event-details">
            <div className="form-group">
                <label htmlFor="name">Ime dogodka:</label>
                <div className="form-control-plaintext">{event.name}</div>
            </div>
            <br />
            <div className="form-group">
                <label htmlFor="description">Opis:</label>
                <div className="form-control-plaintext">{event.description}</div>
            </div>
            <br />
            <div className="form-group">
                <label htmlFor="date">Datum:</label>
                <div className="form-control-plaintext">{eventDateToSlovenian(event.date)}</div>
            </div>
            <br />
            <div className="form-group">
                <label htmlFor="location">Lokacija:</label>
                <div className="form-control-plaintext">{event.location}</div>
            </div>
            <br />
            <div className="form-group">
                <label htmlFor="organizer">Organizator:</label>
                <div className="form-control-plaintext">{event.organizer}</div>
            </div>
        </div>
    );
};

export default EventDetails;
