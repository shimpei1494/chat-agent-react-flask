from flask import Flask
from flask_cors import CORS
from app.controller.chat_controller import chat_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(chat_bp, url_prefix='/api/v1')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)