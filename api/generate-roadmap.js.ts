// /api/generate-roadmap.js

export default function handler(req, res) {
    const dummyData = {
        message: "バックエンドからの応答です！ successfully connected!",
        timestamp: new Date().toISOString(),
    };

    // ステータス200（成功）と共に、JSON形式でデータを返す
    res.status(200).json(dummyData);
}