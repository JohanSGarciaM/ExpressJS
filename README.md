*Para perarar el cliente y la base de datos:*

npx prisma migrate dev --name init

esto hace 4 cosas:

- crea la migración:
    Compara tu schema.prisma con la base de datos y genera un archivo SQL.

- Aplica cambios a la base de datos:
    Ejecuta ese SQL en tu base de datos:
        -crea tablas
        -crea columnas
        -aplica cambios

- Actualiza el cliente prisma
    internamente ejecuta:
        npx prisma generate

- Guarda el historial

*Run code:*
    npm run dev

*it runs:*
    node src/server.js


