from os import path, environ

HOST = environ.get("TOOLS_HOST", "0.0.0.0")
PORT = int(environ.get("TOOLS_PORT", 80))
DATA_FOLDER = environ.get("TOOLS_DATA_FOLDER", "static")
SOURCE_FOLDER = path.join(DATA_FOLDER, "source")
TEMPLATE_FOLDER = path.join(SOURCE_FOLDER, "templates")
DEBUG = bool(environ.get("TOOLS_DEBUG", True))
