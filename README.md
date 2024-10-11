# base-apiato-nest-mongodb

Proyecto base Nestjs con Mongodb, Apiato, Autenticación, y File Upload - Typescript

API Documentation for User Collection

Overview

This API provides CRUD (Create, Read, Update, Delete) operations for the User collection using a flexible and dynamic
controller and service setup. The API supports query parameters for dynamic population of related data and field
selection, enabling optimized data retrieval.

Base URL

/api/users

Endpoints

1. Create a User

Create a new user record.

	•	URL: /
	•	Method: POST
	•	Query Parameters:
	•	populate: Populate related fields dynamically (e.g., populate[fieldName]=true)
	•	select: Comma-separated list of fields to retrieve (e.g., field1,field2)
	•	Request Body: JSON object representing the user data
	•	Response: JSON object with status, message, and created user data

Example Request:

POST /api/users?populate[profile]=true&select=name,email

Example Body:

{
"name": "John Doe",
"email": "john@example.com"
}

Example Response:

{
"status": 200,
"message": "User created successfully",
"data": {
"_id": "61234abcd...",
"name": "John Doe",
"email": "john@example.com",
"profile": { ... } // Populated profile data
}
}

2. Create Multiple Users

Create multiple user records in a single request.

	•	URL: /many
	•	Method: POST
	•	Query Parameters:
	•	populate: Populate related fields dynamically
	•	select: Comma-separated list of fields to retrieve
	•	Request Body: Array of user objects
	•	Response: JSON object with status, message, and created users data

Example Request:

POST /api/users/many

Example Body:

[
{
"name": "John Doe",
"email": "john@example.com"
},
{
"name": "Jane Smith",
"email": "jane@example.com"
}
]

Example Response:

{
"status": 200,
"message": "Users created successfully",
"data": [
{ "_id": "61234abcd...", "name": "John Doe", "email": "john@example.com" },
{ "_id": "61234abce...", "name": "Jane Smith", "email": "jane@example.com" }
]
}

3. Get Users

Retrieve multiple users with optional filtering, sorting, pagination, and population.

	•	URL: /
	•	Method: GET
	•	Query Parameters:
	•	where: Filter conditions (e.g., where[name]=John)
	•	select: Comma-separated list of fields to retrieve
	•	populate: Populate related fields dynamically
	•	paginate[page]: Page number for pagination
	•	paginate[limit]: Number of records per page
	•	sort: Sorting criteria (e.g., sort[name]=asc)
	•	Response: JSON object with status, message, and users data

Example Request:

GET /api/users?where[name]=John&select=name,email&paginate[page]=1&paginate[limit]=10

Example Response:

{
"status": 200,
"message": "ok",
"data": [
{ "_id": "61234abcd...", "name": "John Doe", "email": "john@example.com" }
],
"meta": {
"pagination": { "total": 50, "page": 1, "per_page": 10 }
}
}

4. Get a User by ID

Retrieve a user by their unique ID.

	•	URL: /:id
	•	Method: GET
	•	Query Parameters:
	•	populate: Populate related fields dynamically
	•	select: Comma-separated list of fields to retrieve
	•	Response: JSON object with status, message, and user data

Example Request:

GET /api/users/61234abcd?populate[profile]=true&select=name,email

Example Response:

{
"status": 200,
"message": "ok",
"data": {
"_id": "61234abcd...",
"name": "John Doe",
"email": "john@example.com",
"profile": { ... } // Populated profile data
}
}

5. Update or Create a User

Update a user if they exist, or create a new user if they don’t.

	•	URL: /updateOrCreate
	•	Method: PUT
	•	Query Parameters:
	•	populate: Populate related fields dynamically
	•	select: Comma-separated list of fields to retrieve
	•	Request Body: JSON object representing the user data
	•	Response: JSON object with status, message, and user data

Example Request:

PUT /api/users/updateOrCreate?select=name,email

Example Body:

{
"name": "John Doe",
"email": "john@example.com"
}

Example Response:

{
"status": 200,
"message": "User updated or created successfully",
"data": {
"_id": "61234abcd...",
"name": "John Doe",
"email": "john@example.com"
}
}

6. Delete a User

Delete a user by their unique ID.

	•	URL: /:id
	•	Method: DELETE
	•	Response: JSON object with status, message, and confirmation of deletion

Example Request:

DELETE /api/users/61234abcd

Example Response:

{
"status": 200,
"message": "User deleted successfully"
}

Common Query Parameters

	•	populate: Dynamically populate related fields. Example: populate[profile]=true
	•	select: Specify the fields to return. Example: select=name,email
	•	where: Filter results based on criteria. Example: where[name]=John
	•	paginate[page]: Page number for pagination.
	•	paginate[limit]: Number of results per page.
	•	sort: Sorting criteria. Example: sort[name]=asc

## Auth



## Files

