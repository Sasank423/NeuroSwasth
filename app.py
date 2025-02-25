from flask import Flask,jsonify,request
from flask_cors import CORS

import bcrypt
import mysql.connector
from random import randint
import smtplib

from authenticate import DB

db = DB(mysql.connector.connect(host='localhost',user='root',password='HinokamiKagura@13',database='NeuroSwasth'))

app = Flask(__name__)
CORS(app)

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    res = db.login(email=data['email'], password=data['password'].encode('utf-8'))
    return jsonify(res[0]), res[1]

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    res = db.signup(email=data['email'], password=data['password'].encode('utf-8'),username=data['username'],mobile=data['mobile'])
    return jsonify(res[0]), res[1]
    
@app.route('/otp', methods=['POST'])
def otp():
    data = request.json
    res = db.otp(enteredotp=str(data['enteredotp']), mode=data['mode'],otp=data['otp'],username=data['username'],email=data['email'])
    return jsonify(res[0]), res[1]
    


@app.route('/status', methods=['GET'])
def status():
    if db.user['username'] != None:
        return jsonify(db.user),200
    else:
        return jsonify({'status':'fail','message':'User not logged in'}), 401

@app.route('/profilepic',methods=['POST'])
def profilepic():
    
    if "image" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["image"]
    res = db.profilepicupdate(file.read(),request.form["email"])
    return jsonify(res[0]), res[1]

@app.route('/update/profile',methods=['POST'])
def updateprofile():
    img, name, email, mobile = request.files["image"] ,request.form["name"], request.form["email"], request.form["mobile"]
    res = db.update_profile(img.stream.read(),name,email,mobile)
    return jsonify(res[0]), res[1]
    
@app.route('/logout', methods=['POST'])
def logout():
    db.user['username'] = None
    db.user['email'] = None
    db.user['profilePic'] = None
    db.user['mobile'] = None
    return jsonify({'status':'success','message':'User logged out successfully'}), 200

    
if __name__ == '__main__':
    app.run(debug=True)