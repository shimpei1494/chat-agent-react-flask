# CLAUDE.md

このファイルは、このリポジトリでコードを扱う際のClaude Code (claude.ai/code)へのガイダンスを提供します。

## プロジェクトアーキテクチャ

OpenAI APIを活用したReact TypeScriptフロントエンドとFlask Pythonバックエンドを持つチャットアプリケーションです。

### フロントエンド (React + TypeScript)
- **フレームワーク**: React 18.3.1 + TypeScript 5.5.3
- **ビルドツール**: Vite v7
- **UIライブラリ**: Mantine v7（コンポーネントとスタイリング）
- **ルーター**: React Router DOM 6.26.1
- **開発ツール**: Biome v2（リント・フォーマット）

### バックエンド (Flask + Python)
- **フレームワーク**: Flask 3.0.3
- **言語**: Python 3.11
- **パッケージマネージャー**: uv（Pythonパッケージマネージャー）
- **AI統合**: OpenAI API + Pydantic（データ検証）
- **開発ツール**: Ruff（リント・フォーマット）、MyPy（型チェック）

### 主要アーキテクチャパターン
- **フロントエンド**: ページと再利用可能コンポーネントによるコンポーネントベースアーキテクチャ
- **バックエンド**: controller → service → model分離による階層アーキテクチャ
- **API**: フロントエンド-バックエンド通信のためのRESTful API + Flask-CORS
- **状態管理**: ローカル状態管理のためのReact hooks

## 開発コマンド

### フロントエンド（`frontend/`ディレクトリから実行）
```bash
npm run dev          # 開発サーバー起動（ポート5173）
npm run build        # 本番用ビルド
npm run lint         # Biome リンター実行
npm run format       # Biome フォーマット実行
npm run preview      # 本番ビルドプレビュー
```

### バックエンド（`backend/`ディレクトリから実行）
```bash
uv run python app.py    # Flask開発サーバー起動（ポート5000）
uv run ruff check       # リンター実行
uv run ruff format      # フォーマット実行
uv run mypy app/        # 型チェック実行
uv sync                 # 依存関係インストール・更新
```

### 開発環境セットアップ
1. バックエンド: `.env.example`を`.env`にコピーしてOPENAI_API_KEYを追加
2. フロントエンド: `npm install`で依存関係インストール
3. 両方のサーバーを別々のターミナルで起動

## プロジェクト構造

### フロントエンド（`frontend/src/`）
- `components/`: 再利用可能UIコンポーネント（Answer、QuestionInput、ClearChatButton、SettingsButton）
- `pages/`: ページコンポーネント（chat/ChatPage.tsx、layout/）
- `api/`: API通信層

### バックエンド（`backend/app/`）
- `controller/`: リクエストハンドラー（chat_controller.py）
- `service/`: ビジネスロジック（chat_service.py）
- `models/`: OpenAI API統合（openai_client.py）
- `core/`: メッセージ処理（message_builder.py）
- `types/`: 型定義（chat_types.py）

## 実装済み主要機能
- 複数モデル対応AIチャットインターフェース（GPT-4o、GPT-4o-mini、Gemini、デモモード）
- 高度な設定機能：システムプロンプト、温度制御
- フロントエンド-バックエンド間リアルタイム通信
- メッセージ履歴管理
- エラーハンドリングとローディング状態
- Mantine UIによるレスポンシブデザイン

## 環境変数
バックエンドには以下の`.env`ファイルが必要：
- `OPENAI_API_KEY`: OpenAI APIキー
- `FLASK_ENV`: development
- `FLASK_DEBUG`: True

## バージョン管理
- Node.js: v22（Voltaで管理）
- Python: 3.11（uvで管理）