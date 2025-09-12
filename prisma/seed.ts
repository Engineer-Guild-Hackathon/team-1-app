import pkg from '@prisma/client';
const { PrismaClient } = pkg;

// PrismaClientのインスタンスを作成
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding started...');

    // 1. Domainを作成 (存在しない場合のみ)
    const pythonDomain = await prisma.domain.upsert({
        where: { name: 'Pythonデータ分析' },
        update: {}, // 存在した場合の更新処理（何もしない）
        create: {
            name: 'Pythonデータ分析',
            description: 'Pythonを使ったデータ分析の基礎から応用までを学びます。',
        },
    });
    console.log(`Created domain: ${pythonDomain.name}`);

    // 2. KnowledgeNodeを複数作成
    // createManyはIDの重複チェックをしないため、upsertをループで使うのが安全です
    const nodesToCreate = [
        {
            id: 'python-vars',
            title: '変数とデータ型',
            description: 'Pythonにおける基本的な変数宣言と、数値、文字列、リストなどのデータ型について。',
        },
        {
            id: 'python-loops',
            title: 'ループ処理',
            description: 'for文やwhile文を使った反復処理の方法について学びます。',
        },
        {
            id: 'python-pandas',
            title: 'Pandas入門',
            description: 'データ分析ライブラリPandasの基本的な使い方、DataFrameの操作について。',
        },
    ];

    for (const node of nodesToCreate) {
        await prisma.knowledgeNode.upsert({
            where: { id: node.id },
            update: {},
            create: {
                ...node,
                domainId: pythonDomain.id, // 作成したDomainに紐付ける
            },
        });
        console.log(`Created node: ${node.title}`);
    }

    // 前提知識を設定 (変数→ループ、変数→Pandas)
    await prisma.knowledgeNode.update({
        where: { id: 'python-loops' },
        data: {
            prerequisites: {
                connect: { id: 'python-vars' },
            },
        },
    });
    await prisma.knowledgeNode.update({
        where: { id: 'python-pandas' },
        data: {
            prerequisites: {
                connect: { id: 'python-vars' },
            },
        },
    });
    console.log('Set prerequisites.');

    console.log('Seeding finished.');
}

// main関数を実行し、成功・失敗に応じてプロセスを終了する
main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        // データベース接続を閉じる
        await prisma.$disconnect();
    });