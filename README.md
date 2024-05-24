# QuickShrink API

QuickShrink is a URL shortening service API built with Node.js, Express, and MongoDB. It allows users to shorten URLs, create custom short URLs, and manage the expiration of these URLs.

## Table of Contents

- [Features](#features)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Error Handling](#error-handling)
- [Logging](#logging)
- [Rate Limiting](#rate-limiting)
- [Cron Jobs](#cron-jobs)
- [Contributing](#contributing)
- [Terms of Use](#terms-of-use)

## Features

- Shorten URLs
- Create custom short URLs
- Manage URL expiration dates
- Health check endpoint
- Rate limiting to prevent abuse
- Logging of API requests
- Daily cron job to delete expired URLs


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
```

## Error Handling

Errors are handled using a custom error handler middleware. If an error occurs, the API will respond with an appropriate status code and a message describing the error.

## Logging 

The API uses winston for logging. All requests are logged to a `combined.log` file.

## Rate Limiting

The API uses express-rate-limit to limit the number of requests. The current configuration allows 100 requests per 10 minutes per IP address.

## Cron Jobs

A daily cron job is scheduled to delete expired URLs. This job runs at midnight every day.

## Contributing

Contributions to the QuickShrink API are welcome. Please feel free to fork the repository, make changes, and submit pull requests.

## Terms of Use

By using the QuickShrink API, you agree to the following terms:

1. **Personal Use**: You are permitted to clone and use this API for personal purposes. This includes modifying the code to suit your own needs and running the API on your own servers.

2. **Prohibited Actions**: You are not permitted to publish this API as your own work. This includes, but is not limited to, rebranding the API, claiming ownership, or redistributing the API under a different name.

3. **Attribution**: All rights to the QuickShrink API are reserved to Arjun R Nambiar. If you use this API in any public or commercial project, you must provide appropriate credit to the original author.

4. **No Warranty**: The QuickShrink API is provided "as is", without warranty of any kind, express or implied. In no event shall the author be liable for any claim, damages, or other liability arising from the use of the API.

5. **Modifications**: You are allowed to fork and modify the code for personal use. However, any modifications or derivative works must also comply with these terms.

By cloning or using the QuickShrink API, you acknowledge that you have read, understood, and agree to be bound by these terms.

---

**QuickShrink API**  
**Author**: Arjun R Nambiar  
**Contact**: [sslayer441@gmail.com]
