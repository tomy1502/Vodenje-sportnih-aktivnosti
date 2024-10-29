import { useEffect, useState } from "react";
import { getAllEvents, deleteEvent, Event } from "../services/api";
import AddEvent from "../components/AddEvent";
import UpdateEvent from "../components/UpdateEvent";
import { Modal, Button } from "react-bootstrap";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { signedInUserAtom } from "../atoms/signedInUserAtom";
import { useAtom } from "jotai";
import { userRole } from "../services/usersApi";

const Events = () => {
    const [signedInUser] = useAtom(signedInUserAtom);
    const [events, setEvents] = useState<Event[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [eventToEdit, setEventToEdit] = useState<Event | null>(null);

    const fetchEvents = async () => {
        const data = await getAllEvents();
        setEvents(data ?? []);
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleModalClose = () => setShowModal(false);
    const handleModalShow = () => setShowModal(true);

    const handleDeleteModalShow = (id: number) => {
        setSelectedEventId(id);
        setShowDeleteModal(true);
    };

    const handleDeleteModalClose = () => {
        setSelectedEventId(null);
        setShowDeleteModal(false);
    };

    const handleDeleteEvent = async () => {
        if (selectedEventId !== null) {
            await deleteEvent(selectedEventId);
            fetchEvents();
            handleDeleteModalClose();
        }
    };

    // Funkcija za prikaz modala za urejanje dogodka
    const handleEditModalShow = (event: Event) => {
        setEventToEdit(event);
        setShowEditModal(true);
    };

    const handleEditModalClose = () => {
        setEventToEdit(null);
        setShowEditModal(false);
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Seznam Dogodkov</h2>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {events.map((event) => (
                    <div key={event.id} className="col">
                        <div className="card h-100 shadow-sm position-relative">
                            {signedInUser && signedInUser.role==userRole.MANAGEMENT &&
                                <>
                                    <FaEdit
                                        className="position-absolute text-primary"
                                        style={{ top: "10px", right: "40px", cursor: "pointer" }}
                                        onClick={() => handleEditModalShow(event)}
                                    />
                                    <FaTrashAlt
                                        className="position-absolute text-danger"
                                        style={{ top: "10px", right: "10px", cursor: "pointer" }}
                                        onClick={() => handleDeleteModalShow(event.id)}
                                    />
                                </>
                            }
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

            {signedInUser && signedInUser.role==userRole.MANAGEMENT &&
                <div className="text-center mt-4">
                    <Button variant="primary" onClick={handleModalShow}>
                        Dodaj Dogodek
                    </Button>
                </div>
            }

            <Modal show={showEditModal} onHide={handleEditModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Uredi Dogodek</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {eventToEdit && (
                        <UpdateEvent
                            onClose={handleEditModalClose}
                            onUpdateEvent={fetchEvents}
                            eventToEdit={eventToEdit}
                        />
                    )}
                </Modal.Body>
            </Modal>

            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Dodaj Dogodek</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddEvent onClose={handleModalClose} onAddEvent={fetchEvents} />
                </Modal.Body>
            </Modal>

            <Modal show={showDeleteModal} onHide={handleDeleteModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Potrditev Izbrisa</Modal.Title>
                </Modal.Header>
                <Modal.Body>Ali ste prepričani, da želite izbrisati ta dogodek?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleDeleteModalClose}>
                        Prekliči
                    </Button>
                    <Button variant="danger" onClick={handleDeleteEvent}>
                        Izbriši
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Events;