import bcrypt
import mysql.connector
from random import randint
import smtplib
import base64



class DB:
    def __init__(self, conn):
        self.db = conn
        self.cur = conn.cursor()
        self.user = {'username':None, 'email':None,'profilePic':None, 'mobile':None}
        self.salt = bcrypt.gensalt(rounds=12)

        self.server = smtplib.SMTP("smtp.gmail.com",587)
        self.server.starttls()
        self.server.login('neuroswasth@gmail.com','zbtknqbishkbajms')
        self.db.start_transaction()

    def send_otp(self,email,mode,user):
        otp = randint(100000, 999999)
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
                self.user['mobile'] = mobile
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
        query = "UPDATE authentication SET profilepic=%s, username=%s, mobile=%s WHERE email=%s"
        values = (img, name, mobile, email)
        self.cur.execute(query, values)
        self.db.commit()
        self.user['username'] = name
        self.user['email'] = email
        img = base64.b64encode(img).decode("utf-8")
        self.user['profilePic'] = f"data:image/jpeg;base64,{img}"
        self.user['mobile'] = mobile
        return ({'status':'success','message':'Profile updated successfully'}, 200)


    

    