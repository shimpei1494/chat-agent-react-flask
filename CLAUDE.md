# CLAUDE.md

このプロジェクトは OpenAI API を活用した React + TypeScript フロントエンドと Flask + Python バックエンドを持つ AI チャットアプリケーションです。

## 技術スタック

### フロントエンド

- React 18.3.1 + TypeScript 5.5.3
- Vite v7（ビルドツール）
- Mantine v7（UI）
- Biome v2（lint/format）

### バックエンド

- Flask 3.0.3 + Python 3.11
- uv（パッケージ管理）
- OpenAI API + Pydantic
- Ruff（lint/format）

## 開発コマンド

```bash
# 開発サーバー起動
make dev              # 両方同時
make dev-frontend     # フロントエンド（ポート5173）
make dev-backend      # バックエンド（ポート5000）

# コード品質
make lint             # 全体 lint
make format           # 全体 format
npm run build         # TypeScript 型チェック + ビルド
```

## セットアップ

1. `backend/.env.example` を `backend/.env` にコピーして `OPENAI_API_KEY` を設定
2. `cd frontend && npm install`
3. `cd backend && uv sync`

## プロジェクト構造

```
frontend/src/
├── components/    # Answer, QuestionInput, ClearChatButton, SettingsButton
├── pages/        # chat/, layout/
└── api/          # API通信

backend/app/
├── controller/   # chat_controller.py
├── service/      # chat_service.py
├── models/       # openai_client.py
├── core/         # message_builder.py
└── types/        # chat_types.py
```

## コーディング規約

### Python型アノテーション

- 関数の引数と戻り値には必ず型アノテーションを記載してください
- 変数宣言時にも必要に応じて型を明示してください
- 複雑な型定義には `from __future__ import annotations` を使用してください
- Pydanticモデルやデータクラスを積極的に活用してください

```python
from __future__ import annotations

def process_message(message: str, temperature: float = 1.0) -> dict[str, Any]:
    """メッセージを処理して結果を返す"""
    result: dict[str, Any] = {"content": message}
    return result
```
