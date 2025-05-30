# Full Stack Blog Application

This is a full-stack blog platform featuring a Django backend (REST API) and a modern React (Vite + TypeScript + Tailwind CSS) frontend. Users can create, edit, like, and comment on blog posts.

---

## Features

- User authentication (login/register)
- Create, edit, and delete blog posts
- Like/unlike blogs
- Comment and reply to comments
- Responsive, modern UI with Tailwind CSS
- RESTful API backend

---

## Tech Stack

- **Backend:** Django, Django REST Framework
- **Frontend:** React, Vite, TypeScript, Tailwind CSS
- **Database:** SQLite (default, can be changed)

---

## Project Structure

```
backend/    # Django backend (API, models, migrations, etc.)
frontend/   # React frontend (Vite, src, components, pages, etc.)
```

---

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js 18+
- npm or yarn

### Backend Setup (Django)

1. **Install dependencies:**

   ```bash
   cd backend
   pip install -r requirements.txt  # (installs Django, djangorestframework, django-cors-headers)
   ```

   _(If you use a virtual environment, activate it first)_

2. **Apply migrations:**

   ```bash
   python manage.py migrate
   ```

3. **Create a superuser (optional, for admin):**

   ```bash
   python manage.py createsuperuser
   ```

4. **Run the backend server:**
   ```bash
   python manage.py runserver
   ```
   The API will be available at `http://127.0.0.1:8000/`

### Frontend Setup (React)

1. **Install dependencies:**

   ```bash
   cd frontend
   npm install
   # or
   yarn install
   ```

2. **Run the frontend dev server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The app will be available at `http://localhost:5173/` (default Vite port)

---

## Usage

- Register or log in to create and interact with blogs.
- Like, comment, and reply to posts.
- Admin users can manage content via the Django admin panel at `/admin/`.

---

## Customization

- **Database:** To use PostgreSQL or another DB, update `backend/settings.py`.
- **API URLs:** The frontend expects the backend at `/api/` or `http://localhost:8000/` (adjust API base URL in frontend if needed).

---

## Development Notes

- See `todo.txt` for pending features and active bugs
- Frontend uses Vite aliases (e.g., `@/` for `src/`).
- Tailwind CSS and ShadCN for styling and components.
