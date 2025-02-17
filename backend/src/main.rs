use axum::{
    extract::ws::{Message, WebSocketUpgrade, WebSocket},
    response::IntoResponse,
    routing::get,
    Router,
};
use tokio::sync::broadcast;
use std::net::SocketAddr;
use tracing::{info, error, instrument};
use tracing_subscriber;
use futures::{SinkExt, StreamExt};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing_subscriber::fmt::init();
    let (tx, _) = broadcast::channel::<String>(100);
    let app = Router::new()
        .route("/", get(root))
        .route("/ws", get(move |ws| handle_ws(ws, tx.clone())));
    let addr = SocketAddr::from(([0, 0, 0, 0], 19870));
    info!("Starting WebSocket server on ws://{}", addr);
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .map_err(|e| {
            error!("Server error: {}", e);
            e
        })?;

    Ok(())
}

async fn root() -> &'static str {
    "WebSocket Server is Running!"
}

#[instrument]
async fn handle_ws(
    ws: WebSocketUpgrade, 
    tx: broadcast::Sender<String>
) -> impl IntoResponse {
    ws.on_upgrade(move |socket| handle_socket(socket, tx))
}

async fn handle_socket(socket: WebSocket, tx: broadcast::Sender<String>) {
    let (mut ws_sender, mut ws_receiver) = socket.split();
    let mut rx = tx.subscribe();
    let tx_clone = tx.clone();
    let send_task = tokio::spawn(async move {
        while let Some(Ok(msg)) = ws_receiver.next().await {
            if let Message::Text(text) = msg {
                if let Err(e) = tx_clone.send(text) {
                    error!("Failed to broadcast message: {}", e);
                    break;
                }
            }
        }
    });
    let recv_task = tokio::spawn(async move {
        while let Ok(msg) = rx.recv().await {
            if ws_sender.send(Message::Text(msg)).await.is_err() {
                break;
            }
        }
    });
    tokio::select! {
        _ = send_task => {},
        _ = recv_task => {},
    }
}