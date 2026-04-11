use actix_web::{error::ResponseError, http::StatusCode, HttpResponse};
use serde_json::json;
use std::fmt;

#[derive(Debug)]
pub enum ApiError {
    NotFound,
    BadRequest(String),
    Unauthorized,
    InternalServer,
}

impl fmt::Display for ApiError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{:?}", self)
    }
}

impl ResponseError for ApiError {
    fn status_code(&self) -> StatusCode {
        match self {
            ApiError::NotFound => StatusCode::NOT_FOUND,
            ApiError::BadRequest(_) => StatusCode::BAD_REQUEST,
            ApiError::Unauthorized => StatusCode::UNAUTHORIZED,
            ApiError::InternalServer => StatusCode::INTERNAL_SERVER_ERROR,
        }
    }

    fn error_response(&self) -> HttpResponse {
        let (code, message) = match self {
            ApiError::NotFound => ("NOT_FOUND", "Resource not found"),
            ApiError::BadRequest(msg) => ("BAD_REQUEST", msg.as_str()),
            ApiError::Unauthorized => ("UNAUTHORIZED", "Unauthorized"),
            ApiError::InternalServer => ("INTERNAL_SERVER", "Internal server error"),
        };

        HttpResponse::build(self.status_code())
            .json(json!({
                "error": message,
                "code": code,
            }))
    }
}
