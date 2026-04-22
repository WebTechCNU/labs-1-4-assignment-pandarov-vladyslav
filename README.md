# Web Technologies Labs 1–3

## Author
Vladyslav Pandarov

---

## Project Overview
This project was developed as a sequence of laboratory assignments for modern client-side web technologies.

The application started as a REST API, was extended with GraphQL, and finally enhanced with JWT-based authentication and user registration.

It allows users to:
- view items
- create, update, delete items
- register a new account
- log in and receive a JWT token

---

## Technologies Used
- Node.js
- Netlify Functions
- MongoDB Atlas
- GraphQL (Apollo Server)
- JWT (jsonwebtoken)
- bcryptjs
- HTML, CSS, JavaScript
- Fetch API

---

## How to Run Locally

```bash
git clone https://github.com/WebTechCNU/labs-1-4-assignment-pandarov-vladyslav.git
cd labs-1-4-assignment-pandarov-vladyslav
npm install
==================================================================================
Create .env file:
MONGO_URI=your_mongodb_connection_string
DB_NAME=lab1
JWT_SECRET=your_secret_key
==================================================================================
Run project:
npx netlify dev
==================================================================================
Open in browser:
http://localhost:8888
==================================================================================
Laboratory Assignment 1: REST API

Implemented REST API with full CRUD operations.

Endpoints
GET /.netlify/functions/items
POST /.netlify/functions/items
GET /.netlify/functions/itemById?id=<id>
PUT /.netlify/functions/itemById?id=<id>
DELETE /.netlify/functions/itemById?id=<id>
Features
CRUD operations
MongoDB storage
Data persistence
Frontend integration
==================================================================================
Laboratory Assignment 2: GraphQL

Added GraphQL API with queries and mutations.

Endpoint
POST /.netlify/functions/graphql
Example Query
query {
  items {
    _id
    name
    description
  }
}

Example Mutation
mutation {
  createItem(name: "Test", description: "Test item") {
    _id
    name
  }
}
Features
GraphQL schema and resolvers
Queries (read data)
Mutations (modify data)
MongoDB integration
==================================================================================
Laboratory Assignment 3: JWT Authentication

Implemented authentication and authorization.

Endpoints
Register
POST /.netlify/functions/register
Login
POST /.netlify/functions/login

Response:

{
  "token": "JWT_TOKEN"
}

Features
User registration
Password hashing (bcryptjs)
JWT token generation
Token-based authentication
Protected GraphQL mutations
Token stored in localStorage

Protected operations
Require JWT:
createItem
updateItem
deleteItem
Public:
items
item
==================================================================================
Frontend
The frontend provides:
registration and login forms
item list display
add/edit/delete functionality
animated UI with separate CSS
GraphQL requests via Fetch API

Database
MongoDB Atlas is used.
Collections:
items
users (with hashed passwords)

Security
JWT authentication
bcrypt password hashing
protected endpoints
environment variables in .env

Deployment
Designed for Netlify:
Netlify Functions for backend
Static frontend
GraphQL redirect:
[[redirects]]from = "/graphql"to = "/.netlify/functions/graphql"status = 200

Features Summary
REST API
GraphQL API
MongoDB integration
JWT authentication
User registration
Password hashing
Protected mutations
Responsive UI with animations

Conclusion
The project demonstrates building a full-stack application step by step:
Lab 1 — REST API
Lab 2 — GraphQL
Lab 3 — Authentication (JWT)
The final result is a functional mini full-stack application with a serverless backend and modern frontend.
