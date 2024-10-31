import axios from "axios";
import { API_URL } from "./apiConstants";

const eventsUrl = API_URL+"/events";

export interface NewEvent {
    name: string;
    description: string;
    date: string;
    location: string;
    organizer: string;
}

export interface Event extends NewEvent {
    id: number;
}

export const addEvent = async (event: NewEvent): Promise<Event | undefined> => {
    try {
        const response = await axios.post<Event>(eventsUrl, event);
        return response.data;
    } catch (error) {
        console.error("Napaka pri dodajanju dogodka:", error);
    }
};

export const getAllEvents = async (): Promise<Event[] | undefined> => {
    try {
        const response = await axios.get<Event[]>(eventsUrl);
        return response.data;
    } catch (error) {
        console.error("Napaka pri pridobivanju dogodkov:", error);
    }
};

export const deleteEvent = async (id: number): Promise<void> => {
    try {
        await axios.delete(`${eventsUrl}/${id}`);
    } catch (error) {
        console.error("Napaka pri brisanju dogodka:", error);
    }
};
//update
export const updateEvent = async (id: number, updatedEvent: Omit<Event, "id">): Promise<void> => {
    try {
        console.log("Posodabljam dogodek z ID:", id, "s podatki:", updatedEvent);
        const response = await axios.put<Event>(`${eventsUrl}/${id}`, updatedEvent);
        console.log("Odgovor strežnika:", response.data);
    } catch (error) {
        console.error("Napaka pri posodabljanju dogodka:", error);
    }
};
