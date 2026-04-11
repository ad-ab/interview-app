use actix_web::{web, App, HttpServer, HttpResponse, middleware};
use log::info;

mod handlers;
mod models;
mod error;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("debug"));

    let port = std::env::var("PORT")
        .unwrap_or_else(|_| "8000".to_string())
        .parse::<u16>()
        .expect("PORT must be a number");

    info!("Starting API server on port {}", port);

    HttpServer::new(|| {
        App::new()
            .wrap(middleware::Logger::default())
            .wrap(
                actix_web::middleware::DefaultHeaders::new()
                    .add(("Access-Control-Allow-Origin", "*"))
                    .add(("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE"))
                    .add(("Access-Control-Allow-Headers", "Content-Type"))
            )
            .route("/health", web::get().to(health_check))
            .service(
                web::scope("/api")
                    .route("/users", web::get().to(|| async { 
                        HttpResponse::Ok().json(serde_json::json!({"users": []}))
                    }))
            )
    })
    .bind(("127.0.0.1", port))?
    .run()
    .await
}

async fn health_check() -> HttpResponse {
    HttpResponse::Ok().json(serde_json::json!({"status": "ok"}))
}
