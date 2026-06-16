# Database Schema Specification

## 🗄️ Extensions

### `uuid-ossp`

Used to generate secure, non-sequential UUIDs for primary keys.

---

# 📊 Tables & Relational Layout

## 1. `public.profiles`

Extends the secure internal Supabase authentication system for public application use.

| Column Name  | Data Type                  | Constraints                                                  | Description                                               |
| ------------ | -------------------------- | ------------------------------------------------------------ | --------------------------------------------------------- |
| `id`         | `UUID`                     | `PRIMARY KEY`, `REFERENCES auth.users(id) ON DELETE CASCADE` | Matches internal `auth.users` UUID in a 1:1 relationship. |
| `username`   | `TEXT`                     | `UNIQUE`, `NOT NULL`                                         | Public display username.                                  |
| `email`      | `TEXT`                     | `UNIQUE`, `NOT NULL`                                         | User account email.                                       |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | `DEFAULT NOW()`                                              | Account profile creation timestamp.                       |
| `updated_at` | `TIMESTAMP WITH TIME ZONE` | `DEFAULT NOW()`                                              | Last account profile modification timestamp.              |

---

## 2. `public.projects`

Stores all student mini-apps, showcase descriptions, and filtering parameters.

| Column Name         | Data Type                  | Constraints                                                    | Description                                               |
| ------------------- | -------------------------- | -------------------------------------------------------------- | --------------------------------------------------------- |
| `id`                | `UUID`                     | `PRIMARY KEY`, `DEFAULT gen_random_uuid()`                     | Unique identifier for each published app.                 |
| `title`             | `TEXT`                     | `NOT NULL`                                                     | Name of the showcase application.                         |
| `short_description` | `TEXT`                     | `NOT NULL`                                                     | Clean snippet text for marketplace feed cards.            |
| `description`       | `TEXT`                     | `NOT NULL`                                                     | Deep-dive documentation text supporting Markdown layouts. |
| `category`          | `TEXT`                     | `NOT NULL`                                                     | Platform category (e.g., `"Web App"`).                    |
| `tech_stack`        | `TEXT[]`                   | `DEFAULT '{}'`, `NOT NULL`                                     | Array of technology tags for filtering.                   |
| `project_url`       | `TEXT`                     | `NOT NULL`                                                     | External live production URL for the running application. |
| `thumbnail_url`     | `TEXT`                     | Nullable                                                       | Primary preview card image URL.                           |
| `developer_id`      | `UUID`                     | `REFERENCES public.profiles(id) ON DELETE CASCADE`, `NOT NULL` | Links the project to its student creator.                 |
| `visits_count`      | `INT`                      | `DEFAULT 0`, `NOT NULL`                                        | Engagement counter used for analytics.                    |
| `created_at`        | `TIMESTAMP WITH TIME ZONE` | `DEFAULT NOW()`                                                | Application publishing timestamp.                         |
| `updated_at`        | `TIMESTAMP WITH TIME ZONE` | `DEFAULT NOW()`                                                | Application update timestamp.                             |

---

## 3. `public.project_images`

Manages additional image assets for project detail view screenshot carousels.

| Column Name  | Data Type                  | Constraints                                                    | Description                                 |
| ------------ | -------------------------- | -------------------------------------------------------------- | ------------------------------------------- |
| `id`         | `UUID`                     | `PRIMARY KEY`, `DEFAULT gen_random_uuid()`                     | Unique identifier for the screenshot.       |
| `project_id` | `UUID`                     | `REFERENCES public.projects(id) ON DELETE CASCADE`, `NOT NULL` | Links the screenshot to its parent project. |
| `image_url`  | `TEXT`                     | `NOT NULL`                                                     | URL pointing to the stored image asset.     |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | `DEFAULT NOW()`                                                | Screenshot registration timestamp.          |

---

# 🔒 Row Level Security (RLS) Policies

## `public.profiles`

* **SELECT:** Allow public read access to profiles.
* **UPDATE:** Restrict updates to the authenticated profile owner.

```sql
auth.uid() = id
```

---

## `public.projects`

* **SELECT:** Allow public read access to projects.
* **INSERT:** Allow only authenticated developers to create projects they own.

```sql
auth.uid() = developer_id
```

* **UPDATE:** Allow only the project owner to modify the project.

```sql
auth.uid() = developer_id
```

* **DELETE:** Allow only the project owner to delete the project.

```sql
auth.uid() = developer_id
```

---

## `public.project_images`

* **SELECT:** Allow public read access to project images.
* **INSERT / UPDATE / DELETE:** Restrict mutations to the developer who owns the associated project.

Ownership is validated by ensuring the related project's `developer_id` matches:

```sql
auth.uid()
```

---

# ⚡ Performance Indexes

The following indexes optimize landing page queries, filtering, search performance, and dashboard loading times:

```sql
CREATE INDEX idx_projects_developer_id
ON public.projects(developer_id);

CREATE INDEX idx_projects_category
ON public.projects(category);

CREATE INDEX idx_projects_created_at_desc
ON public.projects(created_at DESC);

CREATE INDEX idx_images_project_id
ON public.project_images(project_id);
```

---

# 🔄 Automation Triggers

## `on_auth_user_created`

* **Event:** `AFTER INSERT` on `auth.users`
* **Function:** `public.handle_new_user()`

### Description

Intercepts newly created authentication records and automatically mirrors user metadata (`id`, `username`, and `email`) into the `public.profiles` table immediately after signup, keeping the public profile layer synchronized with the internal authentication system.
