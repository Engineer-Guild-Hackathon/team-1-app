// src/App.tsx
import { useState } from 'react';

// バックエンドのAPIが返すデータの「型」をフロントエンドでも定義します
type ApiResponse = {
    message: string;
    timestamp: string;
};

function App() {
    // stateがApiResponse型かnullであることをTypeScriptに教えます
    const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleButtonClick = async () => {
        setIsLoading(true);
        setApiResponse(null);
        /*
        try {
            const response = await fetch('/api/generate-roadmap');
            //受け取ったデータをApiResponse型として扱います
            const data: ApiResponse = await response.json();
            setApiResponse(data);
        } catch (error) {
            console.error("APIの呼び出しに失敗しました。", error);
        } finally {
            setIsLoading(false);
        }
        */
        // 代わりに、ダミーデータを直接セットする（モック）
        const dummyData: ApiResponse = {
            message: "【モックデータ】フロントエンドから直接応答！ 🎨",
            timestamp: new Date().toISOString(),
        };

        // 1秒待ったかのように見せかける
        setTimeout(() => {
            setApiResponse(dummyData);
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div>
            <h1>ハッカソン開発：疎通確認 (TypeScript版)</h1>
            <button onClick={handleButtonClick} disabled={isLoading}>
                {isLoading ? '通信中...' : 'バックエンドAPIを呼び出す'}
            </button>

            {apiResponse && (
                <div style={{ marginTop: '20px', background: '#333', padding: '10px', borderRadius: '5px' }}>
                    <h2>APIからの応答:</h2>
                    <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}

export default App;