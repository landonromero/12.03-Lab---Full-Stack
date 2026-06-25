# CS208 Full Stack Final Project

## Overview

This is a simple Express + Pug TODO app backed by a MySQL database. It supports creating, editing, completing, and deleting tasks.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create the MySQL database and table:
   ```bash
   mysql -u root -p < setup_scripts/create_demo_table.sql
   ```

   - Default database name: `cs208demo`
   - Default table name: `todos`

3. Update database credentials in `bin/db.js` if needed.

## Run

Start the application:

```bash
npm start
```

Then open the browser at:

```text
http://localhost:3000
```

## Notes

- The app uses `nodemon` for development startup via `npm start`.
- Task input validation prevents blank tasks.
- The UI supports editing a task and toggling completion status.
