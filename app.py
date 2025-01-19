from flask import Flask,jsonify,request
from flask_cors import CORS

import bcrypt
import mysql.connector
from random import randint
import smtplib


user = {'username':None, 'email':None}
db = mysql.connector.connect(host='localhost',user='root',password='HinokamiKagura@13',database='NeuroSwasth')
cur = db.cursor()

db.start_transaction()

salt = bcrypt.gensalt(rounds=12)

server = smtplib.SMTP("smtp.gmail.com",587)
server.starttls()
server.login('neuroswasth@gmail.com','zbtknqbishkbajms')

def send_otp(email,mode,user):
    otp = randint(100000,999999)
    if mode == 'signup':
        message = f'''Greetings {user}, \n\nThank you for signing up to our services. Here is your 6-digit OTP for verification to complete the registration- {otp}'''
    else:
        message = f'''Greetings {user}, \n\nHere is your 6-digit OTP for verification to login to your account  - {otp}'''
    server.sendmail('neuroswasth@gmail.com',email,str(otp))
    return bcrypt.hashpw(str(otp).encode('utf-8'),salt)


app = Flask(__name__)
CORS(app)

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data['email']
    password = data['password'].encode('utf-8')
    cur.execute(f"select username,password from authentication where email='{email}'")
    data = cur.fetchone()
    if data is not None:
        username, paswrd = data
        if bcrypt.checkpw(password, paswrd.encode('utf-8')):
            otp = send_otp(email,'login',username)
            return jsonify({'status':'success','username' : username,'otp':otp.decode('utf-8')}), 200
        else:
            return jsonify({'status':'error','message':'Invalid password'}), 401
    return jsonify({'status':'error','message':'User doesnot exist !!!'})

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    email = data['email']
    password = data['password'].encode('utf-8')
    username = data['username']
    mobile = data['mobile']
    db.rollback()
        
    cur.execute(f"select * from authentication where email='{email}'")
    if cur.fetchone() is None:
        hashed_password = bcrypt.hashpw(password, salt)
        cur.execute(f"INSERT INTO authentication (username, email, mobile, password) VALUES ('{username}', '{email}', {mobile},'{hashed_password.decode('utf-8')}')")
        otp = send_otp(user=username, mode='signup',email=email)
        print(otp)
        return jsonify({'status':'success','otp':otp.decode('utf-8')}), 200
    else:
        return jsonify({'status':'error','message':'User already exists'}), 409
    
@app.route('/otp', methods=['POST'])
def otp():
    data = request.json
    otp = data['otp']
    enteredotp = str(data['enteredotp'])
    mode = data['mode']
    print(otp)
    print(enteredotp)
    if bcrypt.checkpw(enteredotp.encode('utf-8'),otp.encode('utf-8')):
        if mode == 'login':
            user['username'] = data['username']
            user['email'] = data['email']
            return jsonify({'status':'success','message':'OTP verified successfully'}), 200
        if mode == 'signup':
            db.commit()
            return jsonify({'status':'success','message':'OTP verified successfully'}), 200
        else:
            db.rollback()

    return jsonify({'status':'fail','message':'Incorrect OTP'}), 401


@app.route('/status', methods=['GET'])
def status():
    if user['username'] != None:
        return jsonify(user),200
    else:
        return jsonify({'status':'fail','message':'User not logged in'}), 401
    
@app.route('/logout', methods=['POST'])
def logout():
    user['username'] = None
    user['email'] = None
    return jsonify({'status':'success','message':'User logged out successfully'}), 200

    
if __name__ == '__main__':
    app.run(debug=True)