# 📒 ReflectNote

## 🎥 Recording
is available [here](https://drive.google.com/file/d/1CL5XtNCXyJb32I2vhTNM7kE3pr_FhMpH/view?usp=sharing)

## 🔧 Tech Stack
- Frontend: React Native
- Backend: Express.js, MySQL

## 📝 Description
This is a diary app that lets users write diary entries, assign multiple tags (like “Work”, “Travel”, “Thoughts”), and choose a mood for each one. Users can also filter entries by tags and see when each entry was created or last updated.  

On the frontend, I used **useContext** and **useReducer** to manage state locally. This means the UI updates instantly when something changes, without needing to re-fetch everything from the server, making the app feel smoother and more responsive. I alse used **Navigation** for a smooth transition between multiple screens.  

On the backend, I connected to a **MySQL** database and set up **multiple tables**, including a **join table**, to handle the many-to-many relationship between entries and tags. That way, each entry can have multiple tags without storing them as plain text.  

This project helped me learn:
- Managing state in React Native with useContext and Reducer
- Working with relational databases and join tables
- Building and updating RESTful APIs in Express
- Sending and handling data between frontend and backend efficiently