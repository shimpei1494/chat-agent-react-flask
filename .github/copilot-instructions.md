# Chat Agent Instructions

## プロジェクト概要

このプロジェクトは、React（TypeScript）フロントエンドと Flask（Python）バックエンドを使用した AI チャットアプリケーションです。OpenAI API を活用して AI との対話機能を提供します。

## 🚀 クイックスタート

### 前提条件

- **Node.js v22** (Volta で管理)
- **Python 3.11**
- **uv** (Python パッケージマネージャー)
- **OpenAI API Key**

### セットアップ手順

1. **リポジトリをクローン**

   ```bash
   git clone <repository-url>
   cd chat-agent-react-flask
   ```

2. **バックエンドのセットアップ**

   ```bash
   cd backend
   cp .env.example .env  # .envファイルを作成し、OpenAI API Keyを設定
   uv sync               # 依存関係をインストール
   ```

3. **フロントエンドのセットアップ**
   ```bash
   cd ../frontend
   npm install           # 依存関係をインストール
   ```

### 起動方法

#### 方法 1: Makefile を使用（推奨）

```bash
# フロントエンドとバックエンドを同時起動
make dev

# または個別起動
make dev-frontend  # フロントエンドのみ
make dev-backend   # バックエンドのみ
```

#### 方法 2: 手動起動

**ターミナル 1 - バックエンド:**

```bash
cd backend
uv run python app.py
```

→ http://localhost:5000 で起動

**ターミナル 2 - フロントエンド:**

```bash
cd frontend
npm run dev
```

→ http://localhost:5173 で起動

## 📁 プロジェクト構造

```
chat-agent-react-flask/
├── frontend/              # React TypeScriptフロントエンド
│   ├── src/
│   │   ├── components/    # 再利用可能UIコンポーネント
│   │   │   ├── Answer/         # チャット回答表示
│   │   │   ├── ClearChatButton/ # チャットクリアボタン
│   │   │   ├── QuestionInput/   # 質問入力フォーム
│   │   │   └── SettingsButton/  # 設定ボタン
│   │   ├── pages/         # ページコンポーネント
│   │   │   ├── chat/      # チャットページ
│   │   │   └── layout/    # レイアウト
│   │   └── api/           # API通信
│   ├── package.json
│   ├── biome.json         # Linter/Formatter設定
│   ├── vite.config.ts     # Viteビルド設定
│   └── tsconfig.json      # TypeScript設定
├── backend/               # Flask Pythonバックエンド
│   ├── app/
│   │   ├── controller/    # リクエストハンドラー
│   │   │   └── chat_controller.py
│   │   ├── service/       # ビジネスロジック
│   │   │   └── chat_service.py
│   │   ├── models/        # OpenAI統合
│   │   │   └── openai_client.py
│   │   ├── core/          # メッセージ処理
│   │   │   └── message_builder.py
│   │   └── types/         # 型定義
│   │       └── chat_types.py
│   ├── app.py             # Flaskアプリケーションエントリーポイント
│   ├── pyproject.toml     # Python依存関係・設定
│   └── uv.lock           # ロックファイル
├── Makefile              # 開発用コマンド
├── README.md             # プロジェクト説明
└── architecture.md       # 技術構成詳細
```

## 🛠️ 開発ツール

### コードの品質管理

**フロントエンド:**

```bash
cd frontend
npm run lint      # Biome linting
npm run format    # Biome formatting
npm run build     # TypeScript型チェック + ビルド
```

**バックエンド:**

```bash
cd backend
uv run ruff check   # Ruff linting
uv run ruff format  # Ruff formatting
uv run mypy app/    # MyPy型チェック
```

**すべて実行:**

```bash
make lint     # 全体のlinting
make format   # 全体のformatting
```

### ビルド

```bash
make build          # フロントエンドビルド
make build-frontend # フロントエンドのみビルド
```

## ⚙️ 環境設定

### 必要な環境変数

`backend/.env`ファイルを作成し、以下を設定：

```env
OPENAI_API_KEY=your_openai_api_key_here
FLASK_ENV=development
FLASK_DEBUG=True
```

## 🎯 主要機能

- **AI チャットインターフェース**: クリーンで応答性の高いチャット UI
- **複数の AI モデル対応**: GPT-4o、GPT-4o-mini、デモモードのサポート
- **高度な設定**: カスタマイズ可能なシステムプロンプトと温度制御
- **リアルタイム通信**: フロントエンドとバックエンドのシームレスな統合
- **モダンな技術スタック**: React 18、TypeScript、Mantine UI、Flask、Pydantic

## 🔧 技術スタック

### フロントエンド

- **React 18.3.1** - UI ライブラリ
- **TypeScript 5.5.3** - 型安全性
- **Vite v7** - 高速ビルドツール
- **Mantine v7** - UI コンポーネントライブラリ
- **React Router DOM 6.26.1** - ルーティング
- **Biome v2** - Linter/Formatter

### バックエンド

- **Flask 3.0.3** - Web フレームワーク
- **Python 3.11** - プログラミング言語
- **OpenAI API** - AI 機能
- **Pydantic** - データバリデーション
- **uv** - パッケージ管理
- **Ruff** - Linter/Formatter

## 📝 開発時の注意事項

1. **環境変数**: OpenAI API Key を必ず設定してください
2. **ポート番号**:
   - バックエンド: http://localhost:5000
   - フロントエンド: http://localhost:5173
3. **型安全性**: TypeScript/Python の型注釈を必ず使用
4. **コード品質**: コミット前に lint/format を実行
5. **依存関係**: 新しいパッケージ追加時は`package.json`または`pyproject.toml`を更新

## 🆘 トラブルシューティング

### よくある問題と解決方法

1. **OpenAI API Key Error**

   - `.env`ファイルが正しく設定されているか確認
   - API Key が有効か確認

2. **ポート競合エラー**

   - 他のプロセスがポートを使用していないか確認
   - `lsof -i :5000` または `lsof -i :5173` で確認

3. **依存関係エラー**

   - `npm install` または `uv sync` を再実行
   - Node.js/Python のバージョンを確認

4. **CORS エラー**
   - バックエンドの Flask-CORS 設定を確認
   - フロントエンドの API URL が正しいか確認

## 📚 参考資料

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [OpenAI API Documentation](https://platform.openai.com/docs/)
- [Mantine UI Documentation](https://mantine.dev/)
