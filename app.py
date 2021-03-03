from flask import Flask, request, abort
from datetime import timedelta
from model.user import User
import controller.secure as secure
import json

app = Flask(__name__)

@app.route("/login/",methods=["GET","POST"])
def login():
    if request.method=="POST":
        user = User()
        params = json.loads(secure.dec_e2e(request.form["data"]))
        username = params["username"]
        password = params["password"]
        c = user.authenticate(username,password)
        del user
        return c
    else:
        return "Please use POST method"

@app.route("/register/",methods=["GET","POST"])
def register():
    if request.method=="POST":
        user = User()
        params = json.loads(secure.dec_e2e(request.form["data"]))
        username = params["username"]
        password = params["password"]
        email = params["email"]
        c = user.store(username,email,password)
        del user
        return c
    else:
        abort(404)

@app.route("/reset/",methods=["GET","POST"])
def reset():
    if request.method=="POST":
        user = User()
        params = json.loads(secure.dec_e2e(request.form["data"]))
        username = params["username"]
        otp = params["otp"]
        new_pass = params["new_pass"]
        c = user.reset_pass(username,otp,new_pass)
        del user
        return c

@app.route("/forgot/",methods=["GET","POST"])
def forgot():
    if request.method=="POST":
        user = User()
        params = json.loads(secure.dec_e2e(request.form["data"]))
        username = params["username"]
        c = user.forgot(username)
        del user
        return c

@app.after_request
def cors(response):
    # !Important
    # Without this no browser will allow frontend to communicate with the backend
    # [A Security Thing]
    header = response.headers
    header["Access-Control-Allow-Headers"] = "*"
    header["Access-Control-Allow-Origin"] = "*"
    header["Access-Control-Allow-Methods"] = "*"
    return response

if __name__ == "__main__":
    app.run()