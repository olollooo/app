# development environment
FROM rust:1.70.0 as develop-stage
WORKDIR /app
EXPOSE 3000
RUN rustup component add rls rust-analysis rust-src rustfmt clippy llvm-tools-preview && \
    cargo install cargo-watch cargo-edit cargo-llvm-cov sqlx-cli
RUN apt install -y libpq-dev


# build environment
FROM develop-stage as build-stage
EXPOSE 3000
RUN update-ca-certificates
RUN cargo build --release

# production environment
FROM rust:1.70.0-slim-buster as production-stage
EXPOSE 3000
RUN apt-get update
COPY --from=build-stage /app/target/release/template .
CMD ["./template"]