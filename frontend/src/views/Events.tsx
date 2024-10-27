import { useEffect, useState } from "react";
import { getAllEvents } from "../services/api";
import AddEvent from "../components/AddEvent";
import { Modal, Button } from "react-bootstrap";

interface Event {
    id: number;
    name: string;
    description: string;
    date: string;
    location: string;
}

const Events = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [showModal, setShowModal] = useState(false);

    const fetchEvents = async () => {
        const data = await getAllEvents();
        setEvents(data);
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleModalClose = () => setShowModal(false);
    const handleModalShow = () => setShowModal(true);

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Seznam Dogodkov</h2>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {events.map((event) => (
                    <div key={event.id} className="col">
                        <div className="card h-100 shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title">{event.name}</h5>
                                <h6 className="card-subtitle mb-2 text-muted">{event.date}</h6>
                                <p className="card-text">{event.description}</p>
                                <p className="card-text"><small className="text-muted">{event.location}</small></p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="text-center mt-4">
                <Button variant="primary" onClick={handleModalShow}>
                    Dodaj Dogodek
                </Button>
            </div>

            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Dodaj Dogodek</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddEvent onClose={handleModalClose} onAddEvent={fetchEvents} />
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Events;