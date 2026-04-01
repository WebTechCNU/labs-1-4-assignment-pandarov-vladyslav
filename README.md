# Laboratory Assignment 1: REST API

## Author

Vladyslav Pandarov

---

## Project Description

This project is a simple REST API application built using Netlify Functions and MongoDB.
It allows users to create, read, update, and delete items through API endpoints and a basic web interface.

---

## Technologies Used

* Node.js
* Netlify Functions
* MongoDB Atlas
* HTML, CSS, JavaScript (frontend)
* Fetch API

---

## How to Run Locally

1. Clone the repository:

```bash
git clone https://github.com/WebTechCNU/labs-1-4-assignment-pandarov-vladyslav.git
cd labs-1-4-assignment-pandarov-vladyslav
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file in the root directory:

```env
MONGO_URI=your_mongodb_connection_string
DB_NAME=lab1
```

4. Run the project:

```bash
npx netlify dev
```

5. Open in browser:

```text
http://localhost:8888
```

---

## API Endpoints

### GET all items

```text
GET /.netlify/functions/items
```

### Create item

```text
POST /.netlify/functions/items
```

Body:

```json
{
  "name": "Item name",
  "description": "Item description"
}
```

---

### GET item by ID

```text
GET /.netlify/functions/itemById?id=<id>
```

---

### Update item

```text
PUT /.netlify/functions/itemById?id=<id>
```

Body:

```json
{
  "name": "New name",
  "description": "New description"
}
```

---

### Delete item

```text
DELETE /.netlify/functions/itemById?id=<id>
```

---

## Frontend

The project includes a simple frontend interface that:

* displays all items
* allows adding new items
* supports editing and deleting items

The frontend communicates with the backend using the Fetch API.

---

## Database

MongoDB Atlas is used as a database to store items.
Data persists after server restart.

---

## Notes

* Environment variables are stored in `.env` and are not included in the repository.
* CORS is enabled for development purposes.

---

## Features

* Full CRUD functionality
* REST API implementation
* MongoDB integration
* Simple frontend interface

---

## Deployment

The backend can be deployed on Netlify.
Frontend can be hosted via Netlify or GitHub Pages.

---

## Conclusion

This project demonstrates the implementation of a REST API using serverless functions and integration with a cloud database.

---
