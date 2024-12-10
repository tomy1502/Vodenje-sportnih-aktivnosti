import  { useEffect, useState } from "react";
import AttachmentForm from "./AttachmentForm";
import {getAllEvents, uploadAttachment, AttachmentData } from "../services/api";

interface Event {
    id: number;
    name: string;
}

export default function AttachmentPage() {
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        getAllEvents().then((events) => {
            if (events) {
                setEvents(events);
            }
        });
    }, []);

    const handleAttachmentSubmit = (data: AttachmentData) => {
        uploadAttachment(data)
            .then(() => alert('Priloga uspešno dodana!'))
            .catch((err) => {
                console.error("Napaka pri nalaganju priloge:", err);
                alert("Napaka pri nalaganju priloge.");
            });
    };

    return (
        <div>
            <h1>Priloge</h1>
            <AttachmentForm events={events} onSubmit={handleAttachmentSubmit} />
        </div>
    );
}