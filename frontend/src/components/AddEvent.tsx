import { useState } from "react";
import { addEvent } from "../services/api.tsx";

interface AddEventProps {
    onClose: () => void;
    onAddEvent: () => void;
}

const AddEvent = ({ onClose, onAddEvent }: AddEventProps) => {
    const [event, setEvent] = useState({
        name: "",
        description: "",
        date: "",
        location: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEvent({
            ...event,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await addEvent(event);
        setEvent({ name: "", description: "", date: "", location: "" });
        onAddEvent();
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
            <br/>
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
            <br/>
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
            <br/>
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
            <button type="submit" className="btn btn-primary mt-3">Dodaj Dogodek</button>
        </form>
    );
};

export default AddEvent;