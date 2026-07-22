# api-gateway

BFF (Backend-for-Frontend) untuk `apps/web`: autentikasi/otorisasi, rate limiting, WebSocket
fan-out untuk chat real-time, dan proxy terautentikasi ke `messaging-gateway`, `ai-rag-service`,
dan `workflow-service`. Lihat `docs/ARCHITECTURE.md` §3 untuk posisi service ini dalam sistem.

## Modul yang direncanakan (NestJS)

```
src/modules/
  auth/            AuthN/Z, sesi, RBAC (Keycloak/WorkOS sebagai identity provider)
  contacts/        CRUD Contact + ChannelIdentity, delegasi enrichment ke ai-rag-service
  threads/         CRUD Thread, WebSocket gateway untuk push real-time
  messages/        Kirim/terima pesan, proxy ke messaging-gateway, publish ke event bus
  chatbot/         Proxy ke ai-rag-service /chatbot/message dengan audit log per query
  audit/           Interceptor global — mencatat who/when/what untuk kebutuhan compliance
```

## Status

Fase 1 hanya mendefinisikan pembagian modul di atas sebagai kontrak; implementasi NestJS
nyata (dengan Prisma/TypeORM ke PostgreSQL, guard RBAC, OpenAPI) adalah cakupan Fase 2.
Sementara itu, `apps/web` berjalan dengan data mock lokal (`src/lib/mock-data.ts`) agar UI
bisa diverifikasi lebih dulu tanpa bergantung pada backend.
