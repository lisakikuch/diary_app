import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList } from "react-native";
import { EntriesContext } from "../contexts/EntriesContext";

import { Ionicons } from '@expo/vector-icons';
import { MultiSelect } from 'react-native-element-dropdown';

const HomeScreen = ({ navigation }) => {

    const { entries, fetchEntries } = useContext(EntriesContext);

    const [tags, setTags] = useState([]);
    const TAGTYPES = ["Thoughts", "Goals", "Work", "School", "Family", "Love", "Travel", "Others"];
    const formattedTagTypes = TAGTYPES.map((item) => ({
        label: item, value: item
    }));

    useEffect(() => {
        fetchEntries(tags);
    }, [tags]);

    return (
        <View style={styles.container}>
            <MultiSelect
                style={styles.input}
                data={formattedTagTypes}
                labelField="label"
                valueField="value"
                placeholder="Filter Entries"
                value={tags}
                onChange={setTags}
                selectedTextStyle={{ color: '#000' }}
                placeholderStyle={{ color: '#aaa' }}
                itemTextStyle={{ color: '#000' }}
                activeColor="#e6f0ff"
            />

            {entries.length === 0 ? (
                <View style={styles.noDataText}>
                    <Text style={{ textAlign: 'center' }}>No Entry Data to Show</Text>
                </View>
            ) : (
                <FlatList
                    data={entries}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                        const createdAt = new Date(item.created_at);
                        const updatedAt = new Date(item.updated_at);
                        const showDate = updatedAt > createdAt ? updatedAt : createdAt;

                        return (
                            <TouchableOpacity
                                style={styles.entryCard}
                                onPress={() => navigation.navigate('Details', { entry: item })}
                            >
                                <Text style={styles.entryTitle}>{item.title}</Text>
                                <View style={styles.tagContainer}>
                                    {(typeof item.tags === 'string' ? item.tags.split(',') : []).map((tag, index) => (
                                        <View key={index} style={styles.tagChip}>
                                            <Text style={styles.tagText}>{tag.trim()}</Text>
                                        </View>
                                    ))}
                                </View>


                                <Text style={styles.entryDate}>{showDate.toLocaleString()}</Text>
                            </TouchableOpacity>
                        );
                    }}
                />)}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('Add')}
            >
                <Ionicons name='add' size={28} color='black' />
            </TouchableOpacity>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#F8F9FA",
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 30,
        backgroundColor: '#4A90E2',
        borderRadius: 30,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        zIndex: 10,
    },
    noDataText: {
        flex: 1, justifyContent: 'center', alignItems: 'center'
    },
    entryCard: {
        backgroundColor: "#fff",
        padding: 16,
        marginBottom: 12,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    entryTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 4,
        color: "#333",
    },
    entryTag: {
        fontSize: 14,
        color: "#6a5acd",
        marginBottom: 4,
    },
    entryDate: {
        fontSize: 12,
        color: "#888",
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 4,
    },
    tagChip: {
        backgroundColor: '#DCEEFF',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 6,
        marginBottom: 6,
    },
    tagText: {
        fontSize: 12,
        color: '#333',
    },
    input: {
        backgroundColor: "#E9ECEF",
        padding: 12,
        borderRadius: 5,
        marginTop: 5,
        marginBottom: 15,
        fontSize: 16,
        color: "#333",
    },
});

export default HomeScreen;