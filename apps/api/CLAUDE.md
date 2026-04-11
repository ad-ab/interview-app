# Backend API — CLAUDE.md

## Package Purpose
Rust Actix-web REST API server.
Implements all types from @myapp/shared.

## Tech Stack
- Rust 1.70+
- Actix-web 4.x
- Tokio async runtime
- sqlx for database
- Serde for JSON
- Env vars with dotenv

## Project Structure

```
src/
handlers/        # HTTP request handlers
models/          # Data models (DB schemas)
db/              # Database layer (connection, queries)
middleware/      # Auth, logging, CORS
error.rs         # Error types and handling
main.rs          # Server setup, routes
```

## Routes Organization
All routes defined in main.rs:
- GET /api/users
- POST /api/users
- GET /api/users/:id
- etc.

## Error Handling
Custom error type in error.rs:
```rust
#[derive(Debug)]
pub enum ApiError {
    NotFound,
    BadRequest(String),
    Unauthorized,
    InternalServer,
}
```

All errors return JSON: `{ error: string, code: string }`

## Database
- PostgreSQL with sqlx
- Migrations in migrations/
- Connection pool initialized in db.rs

## Handler Pattern
```rust
pub async fn get_user(
    db: web::Data<PgPool>,
    path: web::Path<i32>,
) -> Result<HttpResponse, ApiError> {
    let user_id = path.into_inner();
    let user = db::get_user(user_id).await?;
    Ok(HttpResponse::Ok().json(user))
}
```

## CORS Setup
Configured in main.rs to allow frontend at localhost:5173 (dev)

## Testing
Unit tests inline in same file as code:
```rust
#[cfg(test)]
mod tests {
    // Tests here
}
```

## Common Commands
- `cargo run` — Start development server
- `cargo build --release` — Build for production
- `cargo test` — Run all tests
- `cargo fmt` — Format code
- `cargo clippy` — Lint code
- `cargo watch -q -c -w src -x run` — Watch and restart

## Env Variables
Create .env:

```
DATABASE_URL=postgres://user:pass@localhost/dbname
RUST_LOG=debug
PORT=8000
FRONTEND_URL=http://localhost:5173
```