# Excel Analytics Platform

A comprehensive platform for uploading, analyzing, and managing Excel files with a secure authentication system.

## Table of Contents
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [API Documentation](#api-documentation)
  - [Authentication](#authentication)
  - [Excel File Management](#excel-file-management)
  - [Analysis](#analysis)
- [Using the Postman Collection](#using-the-postman-collection)
- [Troubleshooting](#troubleshooting)

## Features

- User registration and authentication with JWT
- Excel file upload and management
- Data analysis capabilities
- RESTful API for integration with frontend applications

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or bun

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd excel-analytic-platform
   ```

2. Install dependencies for the server:
   ```
   cd server
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the server directory with the following variables:
   ```
   PORT=5001
   MONGO_URI=mongodb://localhost:27017/excel-analytics
   JWT_SECRET=your_jwt_secret_key
   ```

4. Start the server:
   ```
   npm start
   ```
   or with nodemon:
   ```
   npm run dev
   ```

## API Documentation

### Authentication

#### Register User
- **Endpoint**: `POST /api/auth/register`
- **Description**: Register a new user
- **Request Body**:
  ```json
  {
    "firstName": "Test",
    "lastName": "User",
    "organization": "Test Org",
    "username": "testuser",
    "email": "test@example.com",
    "password": "Password123!",
    "role": "analyst"
  }
  ```
- **Valid Roles**: student, analyst, cxo, data engineer, data scientist, devops, engineer, fullstack developer, director, product manager, system architect, others
- **Response**: 201 Created

#### Login User
- **Endpoint**: `POST /api/auth/login`
- **Description**: Login and receive JWT token
- **Request Body**:
  ```json
  {
    "email": "test@example.com",
    "password": "Password123!"
  }
  ```
- **Response**: 200 OK with JWT token
  ```json
  {
    "message": "Login successful",
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "firstName": "Test",
      "lastName": "User",
      "email": "test@example.com",
      "username": "testuser",
      "role": "analyst"
    }
  }
  ```

### Excel File Management

#### Upload Excel File
- **Endpoint**: `POST /api/excel/upload`
- **Description**: Upload an Excel file for processing
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Request Body**: Form data with:
  - `excelFile`: Excel file (.xlsx, .xls, .ods)
  - `name`: Name for the file (optional)
  - `description`: Description for the file (optional)
- **Response**: 201 Created with file details

#### Get All Excel Files
- **Endpoint**: `GET /api/excel`
- **Description**: Get all Excel files uploaded by the user
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Response**: 200 OK with array of files

#### Get Excel File by ID
- **Endpoint**: `GET /api/excel/:id`
- **Description**: Get details of a specific Excel file
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Response**: 200 OK with file details

#### Delete Excel File
- **Endpoint**: `DELETE /api/excel/:id`
- **Description**: Delete an Excel file
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Response**: 200 OK

### Analysis

#### Create Analysis
- **Endpoint**: `POST /api/analysis`
- **Description**: Create a new analysis from an Excel file
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Request Body**:
  ```json
  {
    "excelId": "excel_file_id",
    "name": "Analysis Name",
    "description": "Analysis Description",
    "analysisType": "correlation",
    "parameters": {
      "columns": ["column1", "column2"]
    }
  }
  ```
- **Response**: 201 Created with analysis details

## Using the Postman Collection

1. Import the Postman collection:
   - Open Postman
   - Click "Import" > "File" > Select the `excel-analytics-platform.postman_collection.json` file from the `server/tests` directory

2. Set up environment variables:
   - Create a new environment in Postman
   - Add a variable named `baseUrl` with the value `http://localhost:5001`
   - Add a variable named `authToken` (this will be automatically set after login)

3. Test the API endpoints in order:
   - Start with the "Health Checks" folder to ensure the server is running
   - Register a new user using the "Register User" request
   - Login with the "Login User" request (this will automatically set the `authToken` variable)
   - Use the "Upload Excel File" request to upload the sample Excel file
   - Explore other endpoints as needed

4. Resend Email Verification
   - Added a feature where users can resend the verification email if they did nor receive it the first time.
   - This helps users to activate their account easily in case the original email was lost or went to spam.
   - Add a key named `token` with the vlaue `{{verificationToken}}` 

## Troubleshooting

### Common Issues

1. **403 Forbidden Error**:
   - Check if port 5000 is being used by another service (like AirPlay/AirTunes on macOS)
   - Change the server port to 5001 in the `.env` file

2. **500 Internal Server Error during Registration**:
   - Ensure you're using a valid role value from the allowed list
   - Check that the username and email are unique in the database
   - Email verification is bypassed in development mode

3. **Excel Upload Issues**:
   - Ensure you're using a valid Excel file (.xlsx, .xls, .ods)
   - Check that the file is properly formatted with at least one sheet and data
   - Verify that the `excelFile` field name is used in the form data
   - Make sure you're including the Authorization header with a valid JWT token

4. **JWT Authentication Issues**:
   - Ensure the token is included in the Authorization header as `Bearer <token>`
   - Check that the JWT_SECRET in the .env file matches the one used to generate the token
   - Tokens expire after 1 day by default

### Getting Help

If you encounter any issues not covered here, please check the server logs for more detailed error messages or open an issue in the repository.
