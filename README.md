# QuickShrink API

QuickShrink is a URL shortening service API built with Node.js, Express, and MongoDB. It allows users to shorten URLs, create custom short URLs, and manage the expiration of these URLs.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Error Handling](#error-handling)
- [Logging](#logging)
- [Rate Limiting](#rate-limiting)
- [Cron Jobs](#cron-jobs)
- [License](#license)

## Features

- Shorten URLs
- Create custom short URLs
- Manage URL expiration dates
- Health check endpoint
- Rate limiting to prevent abuse
- Logging of API requests
- Daily cron job to delete expired URLs

## Installation

1. Clone the repository:
    
```bash
    git clone https://github.com/yourusername/quickshrink.git
    cd quickshrink
    ```
c276a8e3-8ab3-43f9-ad27-bc5aa29dec41


2. Install dependencies:
    
```bash
    npm install
    ```
a2582635-ebf7-4aec-94da-65bbf49e469d


3. Create a `.env` file in the root directory and add the necessary environment variables (see [Environment Variables](#environment-variables)).

4. Start the server:
    
```bash
    npm start
    ```

## Usage

Once the server is running, you can interact with the API using tools like [Postman](https://www.postman.com/) or [curl](https://curl.se/).

## API Endpoints

### Health Check

- **GET** `/api/healthcheck`
    - **Response**: `{ "message": "OK", "status": 200 }`

### Shorten URL

- **POST** `/api/shorten`
    - **Body**: `{ "url": "https://example.com" }`
    - **Response**: `{ "short": "http://localhost:3000/abcde", "status": 200 }`

### Create Custom Short URL

- **POST** `/api/custom/:customSlug`
    - **Params**: `customSlug` (string)
    - **Body**: `{ "originalURL": "https://example.com" }`
    - **Response**: `{ "originalURL": "https://example.com", "slug": "customSlug", "expiryDate": "2024-06-24T00:00:00.000Z" }`

### Get All URLs

- **GET** `/api/urls`
    - **Response**: `[{ "originalURL": "https://example.com", "slug": "abcde", "expiryDate": "2024-06-24T00:00:00.000Z" }]`

### Redirect to Original URL

- **GET** `/:slug`
    - **Params**: `slug` (string)
    - **Response**: Redirects to the original URL

### Update Expiration Date

- **PATCH** `/api/expiration/:slug`
    - **Params**: `slug` (string)
    - **Body**: `{ "expirationDate": "2024-06-24T00:00:00.000Z" }`
    - **Response**: `{ "message": "Expiration Date Changed Successfully!", "status": 200 }`

## Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
PORT=3000
URL=http://localhost:3000
MONGO_URI=mongodb://localhost:27017/quickshrink
ENV=development

## Error Handling

Errors are handled using a custom error handler middleware. If an error occurs, the API will respond with an appropriate status code and a message describing the error.

## Contributing

Contributions to the QuickShrink API are welcome. Please feel free to fork the repository, make changes, and submit pull requests.
