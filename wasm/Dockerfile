FROM rust:1.79

RUN rustup component add clippy rustfmt

RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    build-essential \
    curl \
    binaryen \
    && rm -rf /var/lib/apt/lists/*

RUN curl -sSf https://rustwasm.github.io/wasm-pack/installer/init.sh | sh
RUN cargo install cargo-watch --locked --version 8.4.0

WORKDIR /code
