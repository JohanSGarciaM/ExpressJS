const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

async function main(){
    await prisma.user.deleteMany();

    /// hacer las funciones para agregar usuarios
}
main()
    .catch(e =>{
        console.error(e)
    })
    .finally(async () => {
        await prisma.$disconnect();
    })
