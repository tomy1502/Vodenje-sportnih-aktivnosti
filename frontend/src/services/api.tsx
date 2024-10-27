import axios from "axios";

const API_URL = "http://localhost:1234/api/events";

export const addEvent = async (event: any) => {
    try {
        const response = await axios.post(API_URL, event);
        return response.data;
    } catch (error) {
        console.error("Napaka pri dodajanju dogodka:", error);
    }
};

export const getAllEvents = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Napaka pri pridobivanju dogodkov:", error);
    }
};