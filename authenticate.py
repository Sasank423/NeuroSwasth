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

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

import time


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
                            "ct": "neuro-swasth-imaging-ct-v1",
                            "mri": "neuro-swasth-imaging-mri-v1",
                            "xray": "neuro-swasth-imaging-xray-v1",
                            "ultrasound": "neuro-swasth-imaging-ultrasound-v1",
                            "kft": "neuro-swasth-lab-kft-v1",
                            "lft": "neuro-swasth-lab-lft-v1",
                            "cbp": "neuro-swasth-lab-cbp-v1",
                            "bloodglucose": "neuro-swasth-lab-blood-glucose-v1",
                            "lipidprofile": "neuro-swasth-lab-lipid-profile-v1",
                            "ecg": "neuro-swasth-cardiology-ecg-v1",
                            "eeg": "neuro-swasth-cardiology-eeg-v1",
                            "echo": "neuro-swasth-cardiology-echo-v1",
                            "histopathologyreport": "neuro-swasth-histopathology-reports-v1"
                        }
        try:
            self.server = smtplib.SMTP("smtp.gmail.com",587)
            self.server.starttls()
            self.server.login('neuroswasth@gmail.com','zbtknqbishkbajms')
            self.db.start_transaction()
        except:
            pass

        options = Options()
        options.add_argument("--headless=new")
        options.add_argument("--disable-gpu")
        options.add_argument("--window-size=1920,1080")
        self.driver = webdriver.Chrome(options=options)
        self.wait = WebDriverWait(self.driver, 15)

    def get_hosps(self,prompt):
        self.driver.get("https://www.google.com/maps")

        # Search for hospitals
        search_box = self.wait.until(EC.presence_of_element_located((By.ID, "searchboxinput")))
        search_box.send_keys(f"{prompt} hospitals near me")
        search_box.send_keys(Keys.RETURN)

        # Wait for scrollable container to load
        while True:
            try:
                time.sleep(2)
                scrollable_div = self.driver.find_element(By.XPATH, "//div[@class='m6QErb DxyBCb kA9KIf dS8AEf XiKgde ecceSd']")
                break
            except:
                pass
        # Scroll and collect hospital URLs
        hosps = set()
        l = 0
        while len(hosps) <= 20:
            links = self.driver.find_elements(By.XPATH, "//div[@class='Nv2PK tH5CWc THOPZb ']//a[@class='hfpxzc']")
            for link in links:
                hosps.add(link.get_attribute("href"))
            self.driver.execute_script("arguments[0].scrollTop = arguments[0].scrollHeight", scrollable_div)
            time.sleep(2)
            if len(hosps) != 0 and len(hosps) == l:
                break
            l = len(hosps)
        
        data = []

        for url in list(hosps):
            self.driver.get(url)
            try:
                name = self.wait.until(EC.presence_of_element_located((By.XPATH, "//h1[@class='DUwDvf lfPIob']"))).text
                rating = self.wait.until(EC.presence_of_element_located((By.XPATH, "//div[@class='F7nice ']//span"))).text
                img = self.wait.until(EC.presence_of_element_located((By.XPATH, "//div[@class='RZ66Rb FgCUCc']//img"))).get_attribute('src')
                
                data.append({
                    "name": name,
                    "rating": rating,
                    "img": img,
                    "url": url
                })
            except Exception as e:
                pass
        try:
            data.sort(key=lambda x: float(x["rating"]), reverse=True)
        except:
            pass

        return (data,200)

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
            self.userid = 1
            query = "insert into records (userid, bucketid, url, filename) values(%s, %s, %s, %s)"
            self.cur.execute(query, (self.userid, bucket_id, file_url, file_name)) #change to self.userid
            self.db.commit()
            return ({'status':'success'}, 200)
        except Exception as e:
            print(e)
            return ({'status':'error'},401)
        
    def files_extract(self):
        self.userid = 1
        self.cur.execute('SELECT * FROM records WHERE userid = %s ORDER BY fileid ASC', ([self.userid]))
        data = self.cur.fetchall()
        if self.data is None:
            self.data = data
        elif self.data == data :
            return ({'data': self.res},200)

        self.res = []
        for i in self.data:
            bucket = list(self.bucket_mapping.keys())[i[2]-1]
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
        q = 'INSERT INTO history (userID, chatbotID, user, reply) VALUES(%s, %s, %s, %s)'
        self.cur.execute(q, (self.userid, id, user, reply))
        self.db.commit()
        return {'status':'success'}
    
    def get_consumption(self):
        self.userid = 1
        q = 'select day, carbs, protein, fats, calc from consumption where userid = %s'
        self.cur.execute(q,(self.userid,))
        data = self.cur.fetchall()
        _data = {'Protien':[], 'Fats':[], 'Calcium':[],'Carbohydrates':[]}
        for row in data:
            row = list(row)
            row[0] = row[0].strftime("%Y-%m-%d")
            _data['Carbohydrates'].append({'name':row[0], 'Carbohydrates':row[1]})
            _data['Protien'].append({'name':row[0], 'Protien':row[2]})
            _data['Fats'].append({'name':row[0], 'Fats':row[2]})
            _data['Calcium'].append({'name':row[0], 'Calcium':row[2]})

        return (_data,200)
        


if __name__ == "__main__":
    db = DB(mysql.connector.connect(host='localhost',user='root',password='HinokamiKagura@13',database='NeuroSwasth'))
    db.userid = 1
    print(db.get_hosps('Cardiology hospitals near me'))
    #db.cur.execute('desc consumption')
    #print(db.cur.fetchall())

    