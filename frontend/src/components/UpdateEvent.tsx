import { useState, useEffect } from "react";
import { updateEvent, Event } from "../services/api";

interface UpdateEventProps {
    onClose: () => void;
    onUpdateEvent: () => void;
    eventToEdit: Event; // Dogodek, ki ga urejamo
}

const UpdateEvent = ({ onClose, onUpdateEvent, eventToEdit }: UpdateEventProps) => {
    const [event, setEvent] = useState({
        name: "",
        description: "",
        date: "",
        location: "",
    });

    // Inicializiraj obrazec s podatki dogodka za urejanje
    useEffect(() => {
        if (eventToEdit) {
            setEvent({
                name: eventToEdit.name,
                description: eventToEdit.description,
                date: eventToEdit.date,
                location: eventToEdit.location,
            });
        }
    }, [eventToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEvent({
            ...event,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Posodabljam dogodek:", eventToEdit.id, event); // Dodan log
        await updateEvent(eventToEdit.id, event);
        onUpdateEvent();
        onClose();
    };


    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="name">Ime dogodka</label>
                <input
                    type="text"
                    name="name"
                    value={event.name}
                    onChange={handleChange}
                    className="form-control"
                    required
                />
            </div>
            <br />
            <div className="form-group">
                <label htmlFor="description">Opis</label>
                <textarea
                    name="description"
                    value={event.description}
                    onChange={handleChange}
                    className="form-control"
                    rows={4}
                    required
                />
            </div>
            <br />
            <div className="form-group">
                <label htmlFor="date">Datum</label>
                <input
                    type="date"
                    name="date"
                    value={event.date}
                    onChange={handleChange}
                    className="form-control"
                    required
                />
            </div>
            <br />
            <div className="form-group">
                <label htmlFor="location">Lokacija</label>
                <input
                    type="text"
                    name="location"
                    value={event.location}
                    onChange={handleChange}
                    className="form-control"
                    required
                />
            </div>
            <button type="submit" className="btn btn-primary mt-3">
                Shrani Spremembe
            </button>
        </form>
    );
};

export default UpdateEvent;
