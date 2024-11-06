import React from "react";
import { Event } from "../services/api";
import { eventDateToSlovenian } from "../modules/functions/eventHelperFunctions";
import {FaFacebookF, FaTwitter, FaInstagram, FaCopy} from "react-icons/fa";

interface EventDetailsProps {
    event: Event;
}

const EventDetails: React.FC<EventDetailsProps> = ({ event }: EventDetailsProps) => {
    const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;


    const shareEvent = () => {
        const shareUrl = `${window.location.origin}/events/${event.id}`;
        navigator.clipboard.writeText(shareUrl);
        alert("Povezava dogodka je kopirana v odložišče!");
    };

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
                <div className="mt-2">
                    <iframe
                        title="map"
                        width="100%"
                        height="200"
                        style={{ border: 0 }}
                        src={`https://www.google.com/maps/embed/v1/place?key=${googleMapsApiKey}&q=${encodeURIComponent(
                            event.location
                        )}`}
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
            <br />
            <div className="form-group">
                <label htmlFor="organizer">Organizator:</label>
                <div className="form-control-plaintext">{event.organizer}</div>
            </div>
            <br />
            <div className="form-group">
                <div className="d-flex gap-3">
                    <a href="#" className="text-primary" title="Copy" onClick={shareEvent}>
                        <FaCopy size={24}/>
                    </a>
                    <a href="#" onClick={(e) => e.preventDefault()} className="text-primary" title="Facebook">
                        <FaFacebookF size={24}/>
                    </a>
                    <a href="#" onClick={(e) => e.preventDefault()} className="text-info" title="Twitter">
                        <FaTwitter size={24}/>
                    </a>
                    <a href="#" onClick={(e) => e.preventDefault()} className="text-danger" title="Instagram">
                        <FaInstagram size={24}/>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;