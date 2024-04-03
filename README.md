# QuickShrink API Documentation

## Overview

QuickShrink API provides a simple and efficient way to create short URLs. 
It's built using Node.js and Express, and it leverages MongoDB for storage. 
This API is perfect for applications needing URL shortening functionality. 
Below is the documentation on how to interact with the QuickShrink API.

## Getting Started

### API UR:

The API Base URL is set up as https://quickshrink-api

## Endpoints

### Welcome Message

- **Method:** `GET`
- **Endpoint:** `/`
- **Description:** Displays a welcome message.
- **Response:**

  ```json

  {
    "message": "WELCOME TO QuickShrink API!!"
  }
  
```

### List All URLs

- **Method:** `GET`
- **Endpoint:** `/urls`
- **Description:** Retrieves all shortened URLs stored in the database.
- **Response:**
  ```json

  [
    {
      "_id": "MongoDB ObjectId",
      "originalURL": "Original URL",
      "slug": "Shortened part",
      "__v": 0
    },
    ...
  ]
  
```

### Redirect to Original URL

- **Method:** `GET`
- **Endpoint:** `/:slug`
- **Description:** Redirects to the original URL based on the provided slug.
- **Parameters:**
  - `slug`: The shortened part of the URL.
- **Response:** HTTP 301 redirect to the original URL.

### Create Short URL

- **Method:** `POST`
- **Endpoint:** `/api/shorten`
- **Description:** Creates a new short URL.
- **Body:**
  ```json

  {
    "url": "URL to be shortened"
  }
  
```
- **Response:**
  ```json

  {
    "short": "Shortened URL",
    "status": "HTTP status code"
  }
  
```

## Error Handling

Errors are handled using a custom error handler middleware. If an error occurs, the API will respond with an appropriate status code and a message describing the error.

## Contributing

Contributions to the QuickShrink API are welcome. Please feel free to fork the repository, make changes, and submit pull requests.
