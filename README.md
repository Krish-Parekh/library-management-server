# Express.js Application

## Description

This is an Express.js application that serves as a RESTful API with user authentication, and CRUD operations for books, authors, and categories. It is secured with HTTPS and uses environment variables for configuration. The application also includes middleware for security and authentication, and schema validation using Zod.

## Features

- User authentication (JWT)
- CRUD operations for users, books, authors, and categories
- HTTPS security
- Environment-based configuration
- Helmet for security headers
- CORS support
- Role-based access control
- Schema validation with Zod

## Installation

### Prerequisites

Make sure you have the following installed:

- Node.js (>= 14.x)
- npm (>= 6.x)
- MongoDB

### Steps

1. Clone the repository:

```sh
git clone https://github.com/Krish-Parekh/library-management-server.git
cd library-management-server
```

2. Install the dependencies:

```sh
npm install
```

3. Set up environment variables:

Create a `.env` file in the root directory of your project and add the following environment variables:

- For Development:
  - PORT = 5000
  - CLIENT_URL = http://localhost:3000

- For Production:
  - PORT = 8000
  - CLIENT_URL = https://main.d34xp5l8s3t11r.amplifyapp.com

```env
MONGO_DB_URI=
PORT=
JWT_SECRET=
CLIENT_URL=
EMAIL_USERNAME=
EMAIL_PASSWORD=
AWS_S3_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_BUCKET_NAME=
AWS_FILE_KEY=
```

4. Generate SSL certificates for HTTPS:

Place your `private.key` and `certificate.crt` files in the root directory of your project. You can obtain these certificates from ZeroSSL.

5. Create a MongoDB database:

Make sure your MongoDB server is running and create a database for the project.

### Running the Server

#### Development (HTTP)

To run the server in development mode using HTTP:

1. Open `index.js` and comment out the HTTPS server creation code:

```javascript
// const httpsServer = https.createServer(httpsOptions, app);
// httpsServer.listen(8000, () => {
//   console.log(`Server is running on port 8000`);
// });
```

2. Uncomment the HTTP server code:

```javascript
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
```

3. Start the server:

```sh
nodemon index.js
```

#### Production (HTTPS)

To run the server in production mode using HTTPS:

1. Open `index.js` and uncomment the HTTPS server creation code:

```javascript
const httpsServer = https.createServer(httpsOptions, app);
httpsServer.listen(8000, () => {
  console.log(`Server is running on port 8000`);
});
```

2. Comment out the HTTP server code:

```javascript
// app.listen(process.env.PORT, () => {
//   console.log(`Server is running on port ${process.env.PORT}`);
// });
```

3. Start the server:

```sh
pm2 start index.js
```

### File Structure

```
/project-root
  ├── controller/
  │   ├── auth.controller.js
  │   ├── book.controller.js
  │   ├── author.controller.js
  │   ├── category.controller.js
  │   └── user.controller.js
  ├── lib/
  │   └── db.js
  ├── middleware/
  │   ├── auth.middleware.js
  │   ├── role.middleware.js
  ├── model/
  │   └── token.model.js
  |   └── user.model.js
  |   └── book.model.js
  |   └── author.model.js
  |   └── category.model.js
  ├── router/
  │   ├── auth.router.js
  │   ├── book.router.js
  │   ├── author.router.js
  │   ├── category.router.js
  │   └── user.router.js
  ├── util
  │   ├── schema/
  │       ├── user.schema.js
  │       ├── book.schema.js
  │       ├── author.schema.js
  │       ├── category.schema.js
  ├── .env
  ├── certificate.crt
  ├── private.key
  ├── 3CE78B620E7B3C6A4C4C814502D974F8.txt
  └── index.js
```

### API Endpoints

- `GET /` - Check server status
- `GET /.well-known/pki-validation/3CE78B620E7B3C6A4C4C814502D974F8.txt` - Serve SSL verification file
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `GET /api/v1/user` - Get user info (requires JWT and role middleware)
- `POST /api/v1/book` - Add a new book (requires JWT and role middleware)
- `GET /api/v1/book` - Get books (requires JWT and role middleware)
- `POST /api/v1/author` - Add a new author (requires JWT and role middleware)
- `GET /api/v1/author` - Get authors (requires JWT and role middleware)
- `POST /api/v1/category` - Add a new category (requires JWT and role middleware)
- `GET /api/v1/category` - Get categories (requires JWT and role middleware)
- `GET /api/v1/download` - Download a book (requires JWT and role middleware)

## Middleware

- `auth.middleware.js` - Middleware for verifying JWT
- `role.middleware.js` - Middleware for verifying user roles

## Controllers

- `auth.controller.js` - Handles authentication
- `book.controller.js` - Handles book operations
- `author.controller.js` - Handles author operations
- `category.controller.js` - Handles category operations
- `user.controller.js` - Handles user operations

## Models

- `token.model.js` - Model for storing tokens
- `user.model.js` - Model for user data
- `book.model.js` - Model for book data
- `author.model.js` - Model for author data
- `category.model.js` - Model for category data


## Schema

- `user.schema.js` - Zod schema for user validation
- `book.schema.js` - Zod schema for book validation
- `author.schema.js` - Zod schema for author validation
- `category.schema.js` - Zod schema for category validation

## Notes

- Make sure to update the `.env` file with your actual configuration.
- For HTTPS, ensure your SSL certificates (`private.key` and `certificate.crt`) are correctly placed in the root directory.