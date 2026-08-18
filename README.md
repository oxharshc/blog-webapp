# Bloggerify — Modern Markdown Blog Web Application

![Node.js](https://img.shields.io/badge/Node.js-v18%2B-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-v5-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%20v9-47A248?logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

A full-stack, responsive blogging platform built from scratch with **Node.js, Express, MongoDB, and EJS** — featuring an interactive Markdown editor with live preview, secure JWT authentication, and XSS-safe rendering.

---

## 📑 Table of Contents

- [Key Features](#-key-features)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Routes Overview](#️-routes-overview)
- [Security Practices](#-security-practices)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Key Features

- **Built from Scratch + Template Integration** — Complete backend architecture designed from the ground up, paired with customized EJS frontend templates.
- **Markdown with Live Preview** — Write rich blog posts in Markdown using the integrated [EasyMDE](https://github.com/Ionaru/easy-markdown-editor) editor.
- **XSS-Safe Rendering** — All Markdown is converted with [marked](https://github.com/markedjs/marked) and sanitized with [DOMPurify](https://github.com/cure53/DOMPurify) before being served.
- **Secure Authentication**
  - JWT-based sessions stored in HTTP-only cookies.
  - Passwords salted with a unique random 16-byte value and hashed via HMAC SHA-256 (Node.js `crypto`).
  - Protected routes enforced by the `requireAuth` middleware.
- **Comment System** — Authenticated users can comment on any post, with comments attributed to their account.
- **Image Uploads** — Multipart form handling via [Multer](https://github.com/expressjs/multer) with custom disk storage for blog cover images.
- **Responsive UI** — Mobile-friendly theme with dynamic navbar state, post previews, and full article pages.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Runtime & Server** | [Node.js](https://nodejs.org/), [Express.js v5](https://expressjs.com/) |
| **Database & ODM** | [MongoDB](https://www.mongodb.com/), [Mongoose v9](https://mongoosejs.com/) |
| **Templating** | [EJS](https://ejs.co/) |
| **Authentication** | [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken), `cookie-parser` |
| **Markdown & Sanitization** | `marked`, `dompurify`, `jsdom` |
| **File Uploads** | `multer` |
| **Frontend** | Bootstrap 4, EasyMDE, custom theme assets |

---

## 📁 Project Structure

```text
blog-webapp/
├── models/
│   ├── blog.js             # Mongoose Blog schema & model
│   ├── comment.js          # Mongoose Comment schema & model
│   └── user.js             # Mongoose User schema with hashing & auth statics
├── routes/
│   ├── blog.js             # Blog routes (create, read, comment, allblogs)
│   └── user.js             # User auth routes (signup, signin, logout)
├── middleware/
│   └── authentication.js   # JWT cookie verification & route protection
├── services/
│   └── authentication.js   # JWT token generation and validation
├── views/
│   ├── partials/           # Reusable EJS components (nav, head, scripts, footer)
│   ├── addBlog.ejs         # Blog creation page with EasyMDE
│   ├── allblogs.ejs        # All posts grid view
│   ├── blog.ejs            # Single blog view with Markdown and comments
│   ├── home.ejs            # Home feed view
│   ├── index.ejs           # Landing page
│   ├── signin.ejs          # User sign-in page
│   └── signup.ejs          # User sign-up page
├── public/
│   ├── assets/             # CSS, JS, fonts, and template styles
│   ├── images/             # Default avatars and static images
│   └── uploads/            # Uploaded blog cover images
├── app.js                  # Application entry point and server configuration
├── package.json            # Project dependencies and npm scripts
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB](https://www.mongodb.com/) running locally, or a [MongoDB Atlas](https://www.mongodb.com/atlas) connection URI

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/blog-webapp.git
   cd blog-webapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory (see [Environment Variables](#-environment-variables)):
   ```env
   PORT=8000
   MONGO_URL=mongodb://localhost:27017/bloggerify
   JWT_SECRET=your_super_secret_jwt_key
   ```

4. **Start the application**
   ```bash
   # Development (with auto-reload)
   npm run dev

   # Production
   npm start
   ```

5. **Open in your browser** — visit [http://localhost:8000](http://localhost:8000)

---

## ⚙️ Environment Variables

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port the server listens on | `8000` |
| `MONGO_URL` | MongoDB connection string | `mongodb://localhost:27017/bloggerify` |
| `JWT_SECRET` | Secret key used to sign JWTs | `your_super_secret_jwt_key` |

---

## 🛣️ Routes Overview

| Method | Route | Description | Auth Required |
|---|---|---|---|
| `GET` | `/` | Home feed | ❌ |
| `GET` / `POST` | `/user/signup` | Sign-up page / create account | ❌ |
| `GET` / `POST` | `/user/signin` | Sign-in page / issue JWT cookie | ❌ |
| `GET` | `/user/logout` | Clear session and log out | ✅ |
| `GET` / `POST` | `/blog/addBlog` | New post page / publish post (with cover image) | ✅ |
| `GET` | `/blog/allblogs` | Browse all posts | ❌ |
| `GET` | `/blog/:id` | View a single post and its comments | ❌ |
| `POST` | `/blog/comment/:blogId` | Add a comment to a post | ✅ |

---

## 🔒 Security Practices

- **Password hashing** — Passwords are salted with a unique random 16-byte value and hashed using HMAC-SHA256 via Node.js `crypto`. Plain-text passwords are never stored.
- **XSS protection** — All user-submitted Markdown is parsed with `marked` and sanitized with DOMPurify before rendering, preventing stored XSS attacks.
- **HTTP-only cookies** — JWTs are stored in HTTP-only cookies, keeping them inaccessible to client-side JavaScript.
- **Route protection** — Sensitive routes are guarded by the `requireAuth` middleware, which verifies the JWT on every request.
- **Environment-based secrets** — Secrets and connection strings are loaded from environment variables and never committed to version control.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m "Add amazing feature"`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
