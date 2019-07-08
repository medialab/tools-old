from flask import Flask
from FlaskTools.config import TEMPLATE_FOLDER, DEBUG, HOST, PORT

application = Flask('tools', template_folder=TEMPLATE_FOLDER)
import FlaskTools.controllers

if __name__ == "__main__":
    print HOST
    application.run(host=HOST, port=PORT, debug=DEBUG)
