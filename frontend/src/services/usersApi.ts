import axios from "axios";
import { API_URL } from "./apiConstants";

const usersUrl = API_URL+"/users";

export enum userRole {
    MANAGEMENT = "management",
    EMPLOYEE = "employee",
    UNASSIGNED = "unassigned"
}

export interface User {
    username: string, 
    password: string, 
    fullName: string, 
    role: userRole
}

export interface UserWithId extends User {
    id: number;
}

export const addUser = async (user: User): Promise<number | undefined> => {
    try {
        const response = await axios.post<number>(usersUrl, user);
        return response.data;
    } catch (error) {
        console.error("Napaka pri dodajanju uporabnika:", error);
    }
};

export const getAllUsers = async (): Promise<UserWithId[] | undefined> => {
    try {
        const response = await axios.get<UserWithId[]>(usersUrl);
        return response.data;
    } catch (error) {
        console.error("Napaka pri pridobivanju uporabnikov:", error);
    }
};

export const deleteUser = async (id: number): Promise<void> => {
    try {
        await axios.delete(`${usersUrl}/${id}`);
    } catch (error) {
        console.error("Napaka pri brisanju uporabnika:", error);
    }
};

export const updateUser = async (id: number, updatedEvent: Omit<UserWithId, "id">): Promise<void> => {
    try {
        console.log("Posodabljam uporabnika z ID:", id, "s podatki:", updatedEvent);
        const response = await axios.put<UserWithId>(`${usersUrl}/${id}`, updatedEvent);
        console.log("Odgovor strežnika:", response.data);
    } catch (error) {
        console.error("Napaka pri posodabljanju uporabnika:", error);
    }
};
