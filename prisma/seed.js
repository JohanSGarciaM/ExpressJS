require('dotenv').config();
//const { PrismaClient } = require('@prisma/client');
const { PrismaClient } = require('../generated/prisma');
console.log(process.env.DATABASE_URL);
const prisma = new PrismaClient({});

async function main(){
    //Creación Usuarios
    //Usuario
    const user1 = await prisma.user.create({
        data: {
            email: 'user1@example.com',
            password: 'password123',
            name: 'User One',
            role: 'USER'
        }
    });
    //Admin
    const user2 = await prisma.user.create({
        data: {
            email: 'admin1@example.com',
            password: 'admin123',
            name: 'Admin One',
            role: 'ADMIN'
        }
    });
    // Crear bloques de tiempo
    const timeBlock1 = await prisma.timeBlock.create({
        data: {
            startTime: new Date('2026-04-10T10:00:00Z'),
            endTime: new Date('2026-04-10T11:00:00Z'),
        }
    });
    const timeBlock2 = await prisma.timeBlock.create({
        data: {
            startTime: new Date('2026-04-10T11:00:00Z'),
            endTime: new Date('2026-04-10T12:00:00Z'),
        }
    });

    // Crear citas
    await prisma.appointment.create({
        data: {
            date: new Date('2026-04-10T10:00:00Z'),
            user: { connect: { id: user1.id}},
            timeBlock: { connect: { id: timeBlock1.id}}
        }
    });
    await prisma.appointment.create({
        data: {
            date: new Date('2026-04-10T11:00:00Z'),
            user: { connect: { id: user2.id}},
            timeBlock: { connect: { id: timeBlock2.id}}
        }
    });
}
main()
    .catch(e =>{
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    })
