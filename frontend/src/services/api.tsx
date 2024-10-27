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