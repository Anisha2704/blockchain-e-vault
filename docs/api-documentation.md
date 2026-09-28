# REST API Documentation

Base URL: `http://localhost:5000/api`

---

## 1. Authentication Endpoints

### `POST /api/auth/register`
Registers a new user account.

- **Access**: Public
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "walletAddress": "0x1234...5678" // Optional
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "65d8a...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "token": "eyJhbGciOi..."
    }
  }
  ```

---

### `POST /api/auth/login`
Authenticates user and returns JWT token.

- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "65d8a...",
      "name": "John Doe",
      "email": "john@example.com",
      "token": "eyJhbGciOi..."
    }
  }
  ```

---

### `GET /api/auth/me`
Fetches current authenticated user profile.

- **Access**: Private (Requires `Authorization: Bearer <token>`)
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "65d8a...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
  ```

---

## 2. Document Management Endpoints

### `POST /api/documents`
Uploads a new document file, computes SHA-256 hash, and registers hash on smart contract.

- **Access**: Private (Requires `Authorization: Bearer <token>`)
- **Content-Type**: `multipart/form-data`
- **Body Form Data**:
  - `file`: Document file (PDF, PNG, JPG, JPEG)
  - `title`: Document Title (String)
  - `category`: Category (`Certificate`, `Identity`, `Experience`, `Achievement`, `Legal`, `Other`)
  - `description`: Notes (String)
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Document uploaded and registered on blockchain successfully",
    "data": {
      "_id": "65d8b...",
      "title": "B.Tech Certificate",
      "sha256Hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      "blockchainDocumentId": "DOC-1711382000000-4821",
      "blockchainTransactionHash": "0x98f...",
      "status": "Registered"
    }
  }
  ```

---

### `GET /api/documents`
Retrieves documents uploaded by the logged-in user with search & category filters.

- **Access**: Private
- **Query Parameters**:
  - `search` (optional): Filter by title or Doc ID
  - `category` (optional): Filter by category
  - `page` (default 1)
  - `limit` (default 20)

---

### `GET /api/documents/:id`
Retrieves single document details.

- **Access**: Private (Owner or Admin)

---

### `DELETE /api/documents/:id`
Deletes local document file and database record.

- **Access**: Private (Owner or Admin)
- **Response**:
  ```json
  {
    "success": true,
    "message": "Document deleted from application storage. Note: Blockchain audit record remains immutable on-chain."
  }
  ```

---

## 3. Document Verification Endpoints

### `POST /api/verification/verify`
Public endpoint to upload a document copy and compare its SHA-256 hash against the smart contract.

- **Access**: Public
- **Content-Type**: `multipart/form-data`
- **Body Form Data**:
  - `documentId`: String (e.g. `DOC-1711382000000-4821`)
  - `file`: Document copy to test
- **Response (200 OK - Match)**:
  ```json
  {
    "success": true,
    "verified": true,
    "documentId": "DOC-1711382000000-4821",
    "uploadedHash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "blockchainHash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "message": "Document Verified - Original. Hash matches the blockchain record."
  }
  ```
- **Response (200 OK - Mismatch)**:
  ```json
  {
    "success": true,
    "verified": false,
    "documentId": "DOC-1711382000000-4821",
    "uploadedHash": "1110c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "blockchainHash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "message": "Document Verification Failed - Document may have been modified."
  }
  ```

---

## 4. Health Check Endpoint

### `GET /api/health`
Returns system status.
- **Access**: Public
