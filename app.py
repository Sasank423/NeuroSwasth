from flask import Flask,jsonify,request
from flask_cors import CORS

import bcrypt
import mysql.connector
from random import randint
import smtplib
from io import BytesIO
from datetime import date

from authenticate import DB
from chatbot import Chatbot

db = DB(mysql.connector.connect(host='localhost',user='root',password='HinokamiKagura@13',database='NeuroSwasth'))
cb = Chatbot()

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
    name, email, mobile, change = request.form["name"], request.form["email"], request.form["mobile"], request.form['change']
    if 'image' not in request.files or change == 'no':
        res = db.update_profile(None,name,email,mobile)
    else:
        img = request.files["image"]
        res = db.update_profile(img.stream.read(),name,email,mobile)
    return jsonify(res[0]), res[1]

@app.route('/upload/file', methods=['POST'])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file, name, type = BytesIO(request.files["file"].read()), request.form["name"], request.form["type"]
    res = db.upload_file(file, name, type)
    return jsonify(res[0]), res[1]

@app.route('/get/pdf', methods=['POST'])
def get_pdf():
    res = db.files_extract()
    return jsonify(res[0]), res[1]

@app.route('/get/hist',methods=['POST'])
def get_hist():
    data = request.json
    dt = db.chatbot(data['id'])
    return jsonify(dt),200

@app.route('/set/hist', methods=['POST'])
def set_hist():
    data = request.json
    db.userid = 1
    print(data)
    res = db.history_update(data['id'], data['user'], data['reply'])
    return jsonify(res), 200
    
@app.route('/get/consumption', methods=['POST'])
def get_consumption():
    data = request.json
    res = db.get_consumption()
    return jsonify(res[0]),res[1]

@app.route('/get/hosps', methods=['POST'])
def get_hosps():
    data = request.json
    res = db.get_hosps(data['prompt'])
    return jsonify(res[0]), res[1]

@app.route('/get/medicine', methods=['POST'])
def get_medicine():
    data = request.json
    res = db.get_medicene_data(data['ip'])
    return jsonify(res[0]),res[1]

@app.route('/analyse/calorie', methods=['POST'])
def get_calories():
    image = request.files['image']
    qty = request.form['qty']
    res = db.get_calories(image,qty)
    return jsonify(res[0]), res[1]

@app.route('/add/consumption', methods=['POST'])
def add_cons():
    data = request.json
    print(data)
    dat = date.today()
    nutrient_dict = { item['name']: item['value'] for item in data['data'] }
    try:
        query = """
                    INSERT INTO consumption (userid, day, carbs, protein, fats, calc, calories)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                    ON DUPLICATE KEY UPDATE
                        carbs = carbs + VALUES(carbs),
                        protein = protein + VALUES(protein),
                        fats = fats + VALUES(fats),
                        calc = calc + VALUES(calc),
                        calories = calories + VALUES(calories)
                """
        values = (
                    db.user_id, 
                    dat, 
                    nutrient_dict.get('Carbohydrates', 0),
                    nutrient_dict.get('Protein', 0),
                    nutrient_dict.get('Fat', 0),
                    nutrient_dict.get('Calcium', 0),
                    nutrient_dict.get('Calories', 0)
                )
        db.cur.execute(query, values)
        db.db.commit()
        return jsonify({'status':'ok'}), 200
    except:
        return jsonify({}),400
    
@app.route('/cal/score', methods=['POST'])
def cal_score():
    data = request.json
    res = db.get_score(data['data'])
    return jsonify(res[0]), res[1]
    
@app.route('/summarise', methods=['POST'])
def summarise():
    file = request.files['file']
    file = BytesIO(file.read())
    res = db.get_summary(file)
    return jsonify(res[0]), res[1]

@app.route('/get/supp', methods=['POST'])
def get_supp():
    data = request.json
    res = db.get_recomm(data['d'])
    return jsonify(res[0]), res[1]

@app.route('/set/bot', methods=['POST'])
def check():
    data = request.json
    if data['id'] >=0 and data['id'] <=6:
        cb.set_bot(data['id'])
        return {'status':'ok'}, 200
    return jsonify({'error':'invalid id'}), 400

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    res = cb.chatbot(data['msg'])
    print(res)
    return jsonify({'reply':res}), 200

@app.route('/logout', methods=['POST'])
def logout():
    db.user['username'] = None
    db.user['email'] = None
    db.user['profilePic'] = None
    db.user['mobile'] = None
    db.userid = ''
    return jsonify({'status':'success','message':'User logged out successfully'}), 200

    
if __name__ == '__main__':
    app.run()