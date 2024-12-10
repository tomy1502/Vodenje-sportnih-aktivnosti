import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

interface AttachmentFormProps {
    events: { id: number; name: string }[];
    onSubmit: (data: { eventId: number; file: File; description: string }) => void; // Updated type
}

export default function AttachmentForm({ events, onSubmit }: AttachmentFormProps) {
    const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [description, setDescription] = useState<string>("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedEvent && file) {
            onSubmit({ eventId: selectedEvent, file, description });
        }
    };

    return (
        <div>
            <h2>Dodaj prilogo dogodku</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="eventSelect">
                    <Form.Label>Izberi dogodek</Form.Label>
                    <Form.Control
                        as="select"
                        onChange={(e) => setSelectedEvent(Number(e.target.value))}
                        required
                    >
                        <option value="">Izberi dogodek</option>
                        {events.map((event) => (
                            <option key={event.id} value={event.id}>
                                {event.name}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="fileInput">
                    <Form.Label>Naloži datoteko</Form.Label>
                    <Form.Control
                        type="file"
                        onChange={(e) => setFile((e.target as HTMLInputElement).files?.[0] || null)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="descriptionInput">
                    <Form.Label>Opis</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Dodaj opis datoteke (neobvezno)"
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Form.Group>

                <Button type="submit" variant="primary" className="mt-3">
                    Pošlji
                </Button>
            </Form>
        </div>
    );
}
