import bcrypt
import mysql.connector
from random import randint
import smtplib
import base64
import boto3
import os

from pdf2image import convert_from_bytes
import requests
from io import BytesIO


class DB:
    def __init__(self, conn):
        self.db = conn
        self.cur = conn.cursor()
        self.user = {'username':None, 'email':None,'profilePic':None, 'mobile':None}
        self.userid = '' # change to ''
        self.salt = bcrypt.gensalt(rounds=12)

        self.data = None
        self.res = None
        
        self.s3_client = boto3.client('s3')
        self.bucket_mapping = {
                            "ct": "neuro-swasth-imaging-ct",
                            "mri": "neuro-swasth-imaging-mri",
                            "xray": "neuro-swasth-imaging-xray",
                            "ultrasound": "neuro-swasth-imaging-ultrasound",
                            "kft": "neuro-swasth-lab-kft",
                            "lft": "neuro-swasth-lab-lft",
                            "cbp": "neuro-swasth-lab-cbp",
                            "bloodglucose": "neuro-swasth-lab-blood-glucose",
                            "lipidprofile": "neuro-swasth-lab-lipid-profile",
                            "ecg": "neuro-swasth-cardiology-ecg",
                            "eeg": "neuro-swasth-cardiology-eeg",
                            "echo": "neuro-swasth-cardiology-echo",
                            "histopathologyreport": "neuro-swasth-histopathology-reports"
                        }
        try:
            self.server = smtplib.SMTP("smtp.gmail.com",587)
            self.server.starttls()
            self.server.login('neuroswasth@gmail.com','zbtknqbishkbajms')
            self.db.start_transaction()
        except:
            pass

    def send_otp(self,email,mode,user):
        otp = randint(100000, 999999)
        print(otp)
        if mode == 'signup':
            message = f'''Subject: OTP Verification\n\nGreetings {user},\n\nThank you for signing up to our services. Here is your 6-digit OTP for verification to complete the registration: {otp}'''
        else:
            message = f'''Subject: OTP Verification\n\nGreetings {user},\n\nHere is your 6-digit OTP for verification to login to your account: {otp}'''
        
        try:
            self.server.sendmail('neuroswasth@gmail.com', email, message)
            print(f"OTP sent to {email}")
        except Exception as e:
            print(f"Failed to send OTP to {email}: {e}")
            return None
        
        hashed_otp = bcrypt.hashpw(str(otp).encode('utf-8'), self.salt)
        return hashed_otp
    
    def login(self,email,password):
        
        self.cur.execute(f"select username,password from authentication where email='{email}'")
        data = self.cur.fetchone()
        if data is not None:
            username, paswrd = data
            if bcrypt.checkpw(password, paswrd.encode('utf-8')):
                otp = self.send_otp(email,'login',username)
                return ({'status':'success','username' : username,'otp':otp.decode('utf-8')}, 200)
            else:
                return ({'status':'error','message':'Invalid password'}, 401)
        return ({'status':'error','message':'User doesnot exist !!!'}, 401)
    
    def signup(self, username, email, password,mobile):
        self.db.rollback()
        
        self.cur.execute(f"select * from authentication where email='{email}'")
        if self.cur.fetchone() is None:
            hashed_password = bcrypt.hashpw(password, self.salt)
            with open('src\\comps\\props\\image.png', 'rb') as file:
                img = file.read()
            query = """INSERT INTO authentication (username, email, mobile, password, profilepic) 
             VALUES (%s, %s, %s, %s, %s)"""
    
            values = (username, email, mobile, hashed_password.decode('utf-8'), img)

            # Execute query safely
            self.cur.execute(query, values)
            otp = self.send_otp(user=username, mode='signup',email=email)
            
            return ({'status':'success','otp':otp.decode('utf-8')}, 200)
        else:
            return ({'status':'error','message':'User already exists'}, 409)
        

    def otp(self,mode,otp,enteredotp,username,email):

        if bcrypt.checkpw(enteredotp.encode('utf-8'),otp.encode('utf-8')):
            if mode == 'login':
                self.user['username'] = username
                self.user['email'] = email
                self.cur.execute("SELECT profilepic FROM authentication WHERE email = %s", (email,))
                img = self.cur.fetchone()[0]
                img = base64.b64encode(img).decode("utf-8")
                self.cur.execute("SELECT mobile FROM authentication WHERE email = %s", (email,))
                mobile = self.cur.fetchone()[0]
                self.user['profilePic'] = f"data:image/jpeg;base64,{img}"
                self.cur.execute("SELECT userid FROM authentication WHERE email = %s", (email,))
                self.userid = self.cur.fetchone()[0]
                return ({'status':'success', 'mobile':mobile,'profilepic':f"data:image/jpeg;base64,{img}",'message':'OTP verified successfully'}, 200)
            if mode == 'signup':
                self.db.commit()
                return ({'status':'success','message':'OTP verified successfully'}, 200)
            else:
                self.db.rollback()

        return ({'status':'fail','message':'Incorrect OTP'}, 401)
    
    def profilepicupdate(self,img,email):
        try:
            query = "UPDATE authentication SET profilepic=%s WHERE email=%s"
            values = (img, email)

            self.cur.execute(query, values)
            self.db.commit()
            return ({'status':'success','message':'Profile picture updated successfully'}, 200)
    
        except Exception as e:
            self.db.rollback()
            return ({'status':'error','message':f'Failed to update profile picture: {str(e)}'}, 500)
        
    def update_profile(self,img,name,email,mobile):
        if img is not None:
            query = "UPDATE authentication SET profilepic=%s, username=%s, mobile=%s WHERE email=%s"
            values = (img, name, mobile, email)
            self.cur.execute(query, values)
            img = base64.b64encode(img).decode("utf-8")
            self.user['profilePic'] = f"data:image/jpeg;base64,{img}"
        else:
            query = "UPDATE authentication SET username=%s, mobile=%s WHERE email=%s"
            values = (name, mobile, email)
            
        self.cur.execute(query, values)
        self.db.commit()
        self.user['username'] = name
        self.user['email'] = email
        self.user['mobile'] = mobile
        return ({'status':'success','message':'Profile updated successfully'}, 200)
    
    def upload_file(self, file , file_name, pdf_type):
        pdf_type = pdf_type.replace(' ','').lower()
        
        bucket_name = self.bucket_mapping[pdf_type]
        bucket_id = list(self.bucket_mapping.keys()).index(pdf_type) + 1

        try:
            self.s3_client.upload_fileobj(file, bucket_name, file_name)
            file_url = f"https://{bucket_name}.s3.amazonaws.com/{file_name}"
            query = "insert into records (userid, bucketid, url, filename) values(%s, %s, %s, %s)"
            self.cur.execute(query, (self.userid, bucket_id, file_url, file_name)) #change to self.userid
            self.db.commit()
            return ({'status':'success'}, 200)
        except Exception as e:
            print(e)
            return ({'status':'error'},401)
        
    def files_extract(self):
        self.cur.execute('SELECT * FROM records WHERE userid = %s ORDER BY fileid ASC', ([self.userid]))
        data = self.cur.fetchall()
        if self.data is None:
            self.data = data
        elif self.data == data:
            return ({'data': self.res}, 200)

        self.res = []
        for i in self.data:
            bucket = list(self.bucket_mapping.keys())[i[1]-1]
            img = self.extract_photo(i[-2])
            self.res.append({'bucket': bucket, 'image': img, 'url': i[-2], 'fname': i[-1], 'hovered': False})

        return ({'data': self.res},200)
        
    def extract_photo(self,url):
        response = requests.get(url)
        if response.status_code != 200:
            return ("Failed to download PDF", 400)

        images = convert_from_bytes(response.content, first_page=1, last_page=1)
        img_io = BytesIO()
        images[0].save(img_io, format="PNG")
        img_base64 = base64.b64encode(img_io.getvalue()).decode("utf-8")
        return f"data:image/png;base64,{img_base64}"
    
    def chatbot(self,cid):
        query = "SELECT user,reply FROM history WHERE userid = %s and chatbotID = %s ORDER BY messageID ASC"
        self.cur.execute(query, (self.userid, cid))
        d = self.cur.fetchall()
        if d == []:
            return {'user': [],'reply': [],'status': 'empty'}
        user = []
        reply = []
        for i in d:
            user.append(i[0])
            reply.append(i[1])

        return {'user': user, 'reply': reply, 'status': 'ok'}
    
    def history_update(self,id , user, reply):
        self.userid = 1
        q = 'INSERT INTO history (userID, chatbotID, user, reply) VALUES(%s, %s, %s, %s)'
        self.cur.execute(q, (self.userid, id, user, reply))
        self.db.commit()
        return {'status':'success'}
        


if __name__ == "__main__":
    db = DB(mysql.connector.connect(host='localhost',user='root',password='HinokamiKagura@13',database='NeuroSwasth'))
    print(db.history_update(0,'hi','hlo how are you'))

    