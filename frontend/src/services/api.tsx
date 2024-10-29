import axios from "axios";

const API_URL = "http://localhost:1234/api/events";

export interface Event {
    id: number;
    name: string;
    description: string;
    date: string;
    location: string;
}

export interface NewEvent {
    name: string;
    description: string;
    date: string;
    location: string;
}

export const addEvent = async (event: NewEvent): Promise<Event | undefined> => {
    try {
        const response = await axios.post<Event>(API_URL, event);
        return response.data;
    } catch (error) {
        console.error("Napaka pri dodajanju dogodka:", error);
    }
};

export const getAllEvents = async (): Promise<Event[] | undefined> => {
    try {
        const response = await axios.get<Event[]>(API_URL);
        return response.data;
    } catch (error) {
        console.error("Napaka pri pridobivanju dogodkov:", error);
    }
};

export const deleteEvent = async (id: number): Promise<void> => {
    try {
        await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error("Napaka pri brisanju dogodka:", error);
    }
};
//update
export const updateEvent = async (id: number, updatedEvent: Omit<Event, "id">): Promise<void> => {
    try {
        console.log("Posodabljam dogodek z ID:", id, "s podatki:", updatedEvent);
        const response = await axios.put<Event>(`${API_URL}/${id}`, updatedEvent);
        console.log("Odgovor strežnika:", response.data);
    } catch (error) {
        console.error("Napaka pri posodabljanju dogodka:", error);
    }
};
