import { PrismaClient} from '@prisma/client'
const prisma = new PrismaClient();

async function main() {
    await prisma.c
}

main()
    .then(async () => {
        await prisma.$disconnect();
        process.exit(0);
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });