// // /api/generate-roadmap.ts
// import type { VercelRequest, VercelResponse } from '@vercel/node';
//
// // 返却するデータの「型」を定義しておきます。これにより安全性が高まります。
// type ApiResponse = {
//     message: string;
//     timestamp: string;
// };
//
// export default function handler(
//     req: VercelRequest,
//     res: VercelResponse<ApiResponse>, // レスポンスの型を指定
// ) {
//     const dummyData: ApiResponse = { // データが型に合っているかチェック
//         message: "バックエンド(TypeScript)からの応答です！ 🚀",
//         timestamp: new Date().toISOString(),
//     };
//
//     res.status(200).json(dummyData);
// }