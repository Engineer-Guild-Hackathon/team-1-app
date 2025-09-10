// src/App.js
import React, { useState } from 'react';
import './App.css'; // スタイルはお好みで

function App() {
    const [apiResponse, setApiResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleButtonClick = async () => {
        setIsLoading(true);
        setApiResponse(null); // 前回の結果をクリア
        try {
            const response = await fetch('/api/generate-roadmap');
            const data = await response.json();

            setApiResponse(data);
        } catch (error) {
            console.error("APIの呼び出しに失敗しました。", error);
            setApiResponse({ message: "エラーが発生しました。" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>ハッカソン開発：疎通確認</h1>
                <button onClick={handleButtonClick} disabled={isLoading}>
                    {isLoading ? '通信中...' : 'バックエンドAPIを呼び出す'}
                </button>
                {apiResponse && (
                    <div>
                        <h2>APIからの応答:</h2>
                        <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
                    </div>
                )}
            </header>
        </div>
    );
}

export default App;