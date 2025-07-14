.PHONY: dev dev-frontend dev-backend build build-frontend build-backend install install-frontend install-backend lint format clean help

# デフォルトターゲット
help:
	@echo "使用可能なコマンド:"
	@echo "  make dev           - フロントエンドとバックエンドを同時起動"
	@echo "  make dev-frontend  - フロントエンドのみ起動"
	@echo "  make dev-backend   - バックエンドのみ起動"
	@echo "  make build         - フロントエンドとバックエンドをビルド"
	@echo "  make install       - フロントエンドとバックエンドの依存関係をインストール"
	@echo "  make lint          - フロントエンドとバックエンドのリンター実行"
	@echo "  make format        - フロントエンドとバックエンドのフォーマット実行"
	@echo "  make clean         - ビルド成果物を削除"

# 開発サーバー起動（並列実行）
dev:
	@echo "フロントエンドとバックエンドを起動中..."
	@(cd frontend && npm run dev) & \
	(cd backend && uv run python app.py) & \
	wait

# フロントエンドのみ起動
dev-frontend:
	@echo "フロントエンドを起動中..."
	cd frontend && npm run dev

# バックエンドのみ起動
dev-backend:
	@echo "バックエンドを起動中..."
	cd backend && uv run python app.py

# ビルド
build: build-frontend

build-frontend:
	@echo "フロントエンドをビルド中..."
	cd frontend && npm run build

# 依存関係インストール
install: install-frontend install-backend

install-frontend:
	@echo "フロントエンドの依存関係をインストール中..."
	cd frontend && npm install

install-backend:
	@echo "バックエンドの依存関係をインストール中..."
	cd backend && uv sync

# リンター実行
lint: lint-frontend lint-backend

lint-frontend:
	@echo "フロントエンドのリンター実行中..."
	cd frontend && npm run lint

lint-backend:
	@echo "バックエンドのリンター実行中..."
	cd backend && uv run ruff check

# フォーマット実行
format: format-frontend format-backend

format-frontend:
	@echo "フロントエンドのフォーマット実行中..."
	cd frontend && npm run format

format-backend:
	@echo "バックエンドのフォーマット実行中..."
	cd backend && uv run ruff format


# クリーンアップ
clean:
	@echo "ビルド成果物を削除中..."
	rm -rf frontend/dist
	rm -rf frontend/node_modules/.cache
	find . -name "*.pyc" -delete
	find . -name "__pycache__" -delete