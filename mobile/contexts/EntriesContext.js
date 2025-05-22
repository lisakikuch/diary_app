import React, { createContext, useReducer, useEffect } from "react";
import axios from "axios";
import { API_URL } from '@env';

export const EntriesContext = createContext();

const entriesReducer = (state, action) => {
    switch (action.type) {
        case 'SET_ENTRIES':
            return action.payload;
        case 'ADD_ENTRY':
            return [action.payload, ...state];
        case 'UPDATE_ENTRY':
            return state.map(entry =>
                entry.id == action.payload.id ? { ...entry, ...action.payload } : entry
            );
        case 'DELETE_ENTRY':
            return state.filter(entry => entry.id !== action.payload);
        default:
            return state;
    }
};

export const EntriesProvider = ({ children }) => {
    const [entries, dispatch] = useReducer(entriesReducer, []);

    const fetchEntries = async (tags = []) => {
        try {
            const query = tags.length > 0 ? `?tags=${tags.join(',')}` : '';
            const res = await axios.get(`${API_URL}/entries${query}`);
            dispatch({ type: 'SET_ENTRIES', payload: res.data });
        } catch (err) {
            console.error("Error fetching entries data: ", err);
        }
    };

    useEffect(() => {
        fetchEntries();
    }, []);

    return (
        <EntriesContext.Provider value={{ entries, dispatch, fetchEntries }}>
            {children}
        </EntriesContext.Provider>
    );
}