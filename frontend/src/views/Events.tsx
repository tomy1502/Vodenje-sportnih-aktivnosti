import { useEffect, useState } from "react";
import { getAllEvents, deleteEvent, Event, registerForEvent, deregisterFromEvent } from "../services/api";
import AddEvent from "../components/AddEvent";
import UpdateEvent from "../components/UpdateEvent";
import { Modal, Button } from "react-bootstrap";
import { FaTrashAlt, FaEdit, FaInfoCircle, FaUserPlus, FaUserMinus } from "react-icons/fa";
import { signedInUserAtom } from "../atoms/signedInUserAtom";
import { useAtom } from "jotai";
import { UserRole } from "../services/usersApi";
import { eventDateToSlovenian } from "../modules/functions/eventHelperFunctions";
import EventDetails from "../components/EventDetails";

const Events = () => {
    const [signedInUser] = useAtom(signedInUserAtom);
    const [events, setEvents] = useState<Event[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [eventToEdit, setEventToEdit] = useState<Event | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [eventToShowDetails, setEventToShowDetails] = useState<Event | null>(null);
    const [registeredEvents, setRegisteredEvents] = useState<number[]>([]);

    const fetchEvents = async () => {
        const data = await getAllEvents();
        setEvents(data ?? []);
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        if (signedInUser) {
            const fetchRegisteredEvents = async () => {
                // Get all registered events for the logged-in user
                const registered = await fetchRegisteredForUser(signedInUser.id);
                setRegisteredEvents(registered);
            };

            fetchRegisteredEvents();
        }
    }, [signedInUser]);

    const fetchRegisteredForUser = async (userId: number) => {
        // Fetch the list of events the user is registered for from the backend or localStorage
        const registeredFromStorage = JSON.parse(localStorage.getItem(`registeredEvents_${userId}`) || "[]");
        return registeredFromStorage;
    };

    const handleRegister = async (eventId: number) => {
        if (signedInUser?.id) {
            try {
                console.log(`Registering user ${signedInUser.id} for event ${eventId}`);
                await registerForEvent(eventId, signedInUser.id);
                setRegisteredEvents((prev) => [...prev, eventId]);

                // Store the registered event in localStorage to persist the registration
                localStorage.setItem(`registeredEvents_${signedInUser.id}`, JSON.stringify([...registeredEvents, eventId]));
                console.log(`User ${signedInUser.id} registered for event ${eventId}`);
            } catch (error) {
                console.error("Registration failed:", error);
            }
        }
    };

    const handleDeregister = async (eventId: number) => {
        if (signedInUser?.id) {
            try {
                console.log(`Deregistering user ${signedInUser.id} from event ${eventId}`);
                await deregisterFromEvent(eventId, signedInUser.id);
                setRegisteredEvents((prev) => prev.filter((id) => id !== eventId));

                // Update localStorage when the user deregisters
                localStorage.setItem(`registeredEvents_${signedInUser.id}`, JSON.stringify(registeredEvents.filter((id) => id !== eventId)));
                console.log(`User ${signedInUser.id} deregistered from event ${eventId}`);
            } catch (error) {
                console.error("Deregistration failed:", error);
            }
        }
    };

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

    const handleEditModalShow = (event: Event) => {
        setEventToEdit(event);
        setShowEditModal(true);
    };

    const handleEditModalClose = () => {
        setEventToEdit(null);
        setShowEditModal(false);
    };

    const handleDetailsModalShow = (event: Event) => {
        setEventToShowDetails(event);
        setShowDetailsModal(true);
    };

    const handleDetailsModalClose = () => {
        setEventToShowDetails(null);
        setShowDetailsModal(false);
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Seznam Dogodkov</h2>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {events.map((event) => (
                    <div key={event.id} className="col">
                        <div className="card h-100 shadow-sm position-relative">
                            <FaInfoCircle
                                className="position-absolute text-primary"
                                style={{ top: "10px", right: (signedInUser && signedInUser.role == UserRole.MANAGEMENT ? "110px" : "10px"), cursor: "pointer" }}
                                onClick={() => handleDetailsModalShow(event)}
                            />

                            {signedInUser && signedInUser.role == UserRole.MANAGEMENT &&
                                <>
                                    <FaEdit
                                        className="position-absolute text-secondary"
                                        style={{ top: "10px", right: "80px", cursor: "pointer" }}
                                        onClick={() => handleEditModalShow(event)}
                                    />
                                    <FaTrashAlt
                                        className="position-absolute text-danger"
                                        style={{ top: "10px", right: "50px", cursor: "pointer" }}
                                        onClick={() => handleDeleteModalShow(event.id)}
                                    />
                                </>
                            }

                            {signedInUser && (
                                registeredEvents.includes(event.id) ? (
                                    <FaUserMinus
                                        className="position-absolute text-warning"
                                        style={{
                                            top: "10px",
                                            right: signedInUser.role !== UserRole.MANAGEMENT ? "30px" : "20px", // Adjust for normal users
                                            cursor: "pointer"
                                        }}
                                        onClick={() => handleDeregister(event.id)}
                                        title="Odjava iz dogodka"
                                    />
                                ) : (
                                    <FaUserPlus
                                        className="position-absolute text-success"
                                        style={{
                                            top: "10px",
                                            right: signedInUser.role !== UserRole.MANAGEMENT ? "30px" : "20px", // Adjust for normal users
                                            cursor: "pointer"
                                        }}
                                        onClick={() => handleRegister(event.id)}
                                        title="Prijava na dogodek"
                                    />
                                )
                            )}


                            <div className="card-body">
                                <h5 className="card-title">{event.name}</h5>
                                <h6 className="card-subtitle mb-2 text-muted">{eventDateToSlovenian(event.date)}</h6>
                                <p className="card-text">{event.description}</p>
                                <p className="card-text"><small className="text-muted">{event.location}</small></p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {signedInUser && signedInUser.role == UserRole.MANAGEMENT &&
                <div className="text-center mt-4">
                    <Button variant="primary" onClick={handleModalShow}>
                        Dodaj Dogodek
                    </Button>
                </div>
            }

            <Modal show={showDetailsModal} onHide={handleDetailsModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Podrobnosti</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {eventToShowDetails && (
                        <EventDetails event={eventToShowDetails} />
                    )}
                </Modal.Body>
            </Modal>

            <Modal show={showEditModal} onHide={handleEditModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Uredi</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {eventToEdit && (
                        <UpdateEvent onClose={handleEditModalClose} onUpdateEvent={fetchEvents} eventToEdit={eventToEdit} />
                    )}
                </Modal.Body>
            </Modal>

            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Dodaj dogodek</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddEvent onClose={handleModalClose} onAddEvent={fetchEvents} />
                </Modal.Body>
            </Modal>

            <Modal show={showDeleteModal} onHide={handleDeleteModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Potrditev izbrisa</Modal.Title>
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
