from flask_socketio import SocketIO

socketio = SocketIO(ping_interval=5, ping_timeout=120, cors_allowed_origins="*")


def init_app(app):
    socketio.init_app(app)
