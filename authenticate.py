import bcrypt
import mysql.connector
from random import randint
import smtplib
import base64
import boto3
import os

from datetime import datetime
from typing import List, Dict, Optional, Union
import fitz

from pdf2image import convert_from_bytes
import requests
from io import BytesIO

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

import openai
from openai import OpenAI as OpenAIClient
import time
import json
import re


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
        options.add_argument("--ignore-certificate-errors")
        options.add_argument("--allow-insecure-localhost")
        options.add_argument("--disable-web-security")
        options.add_argument("--headless=new")
        options.add_argument("--disable-gpu")
        options.add_argument("--window-size=1920,1080")
        self.driver = webdriver.Chrome(options=options)
        self.wait = WebDriverWait(self.driver, 15)

        self.client = openai.OpenAI(api_key="")
        self.deepseek_client = OpenAIClient(
            base_url="https://api.novita.ai/v3/openai",
            api_key=""
        )
        self.CONFIG = {
            "models": {
                "deepseek": "deepseek/deepseek-v3-turbo",
                "expert": "gpt-4-turbo"
            },
            "stream": False,
            "max_retries": 3
        }
        self.healthQs = [
                            "Could you tell us about your current height and weight?",
                            "How would you describe your breathing during normal daily activities?",
                            "Have you or anyone else noticed any changes in your natural skin color, particularly looking more pale or washed out than usual?",
                            "Have you observed any yellow coloring in your skin or the whites of your eyes?",
                            "Have you seen any bluish or purplish discoloration in your lips, fingertips, or other areas?",
                            "Have you noticed any changes in the shape of your fingernails or fingertips over time?",
                            "Do you ever experience swelling in your feet, ankles, hands or face?",
                            "What would you tell us is your typical body temperature, and have you noticed any patterns of running hotter or colder than normal?",
                            "If you've ever checked your resting heart rate, what would you tell us it typically measures?",
                            "How would you describe your normal breathing pattern when you're at complete rest?",
                            "If you've had your blood pressure measured recently, what would you tell us were the numbers?",
                            "How would you describe your typical bowel and bladder habits?",
                            "What would you tell us a typical day's worth of meals and snacks looks like for you?",
                            "How much water and other fluids would you say you typically consume in a day?",
                            "What kinds of physical activity or exercise would you tell us you engage in regularly?",
                            "How would you describe your typical sleep patterns to us?",
                            "What significant health conditions would you tell us have been present in your immediate family members?",
                            "How would you describe your current work environment and daily job demands to us?",
                            "How would you characterize your typical stress levels to us?",
                            "If you've ever tried holding your breath, how long would you tell us you're typically able to hold it comfortably?"
                        ]

    def get_hosps(self,prompt):
        self.driver.get("https://www.google.com/maps")

        # Search for hospitals
        search_box = self.wait.until(EC.presence_of_element_located((By.ID, "searchboxinput")))
        search_box.send_keys(f"{prompt} hospitals near namburu")
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
        q = 'select day, carbs, protein, fats, calc, calories from consumption where userid = %s'
        self.cur.execute(q,(self.userid,))
        data = self.cur.fetchall()
        _data = {'Protien':[], 'Fats':[], 'Calcium':[],'Carbohydrates':[], 'Calories':[]}
        for row in data:
            row = list(row)
            row[0] = row[0].strftime("%Y-%m-%d")
            _data['Carbohydrates'].append({'name':row[0], 'Carbohydrates':row[1]})
            _data['Protien'].append({'name':row[0], 'Protien':row[2]})
            _data['Fats'].append({'name':row[0], 'Fats':row[3]})
            _data['Calcium'].append({'name':row[0], 'Calcium':row[4]})
            _data['Calories'].append({'name':row[0], 'Calories':row[5]})

        return (_data,200)
    
    def get_medicene_data(self, ip):

        self.driver.get("https://www.1mg.com")
        self.driver.find_element(By.ID,'srchBarShwInfo').send_keys('dolo-650'+Keys.ENTER)
        time.sleep(2)
        name = self.driver.find_element(By.XPATH,"//span[@class='style__pro-title___3zxNC']").text
        price = self.driver.find_element(By.XPATH,"//div[@class='style__price-tag___B2csA']").text
        img = self.driver.find_element(By.XPATH,"//img[@class='style__image___Ny-Sa style__loaded___22epL']").get_attribute('src')
        url = self.driver.find_element(By.XPATH,"//div[@class='style__horizontal-card___1Zwmt style__height-158___1XIvD']//a").get_attribute('href')

        self.driver.get(url)
        context = self.driver.find_element(By.XPATH,"//div[@class='DrugOverview__content___22ZBX']").get_attribute('innerHTML')
        return ({
            'name': name,
            'price': price,
            'img': img,
            'url': url,
            'desc': '<h1>Medicine Information</h1>'+context
        }, 200)

    def get_calories(self,img,qty):
        img = base64.b64encode(img.read()).decode("utf-8")
        response = self.client.chat.completions.create(
        model="gpt-4-turbo",
        messages=[
            {"role": "system", "content": "You are a food recognition expert."},
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "What food is shown in this image? Just name the food(s), no description."},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{img}"
                        }
                    }
                ]
            }
        ],
        max_tokens=100
    )
        name = response.choices[0].message.content.strip()
        prompt = (
            f"Estimate the nutritional values for {qty} of {name}.Measure everything in grams except calroies measure it in kcal "
            "Respond in this exact format without adding anything prefix or suffix(list of dictonary nothing more): "
            '''[
            { name: 'Protien', value: <value> },
            { name: 'Calcium', value: <value> },
            { name: 'Fat', value: <value> },
            { name: 'Carbohydrates', value: <value> },
            { name: 'Calories', value: <value>}
        ]'''
        )
        response = self.client.chat.completions.create(
            model="gpt-4-turbo",
            messages=[
                {"role": "system", "content": "You are a nutrition expert."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=200
        )
        res = eval(response.choices[0].message.content.strip())

        return ({'data':res,'name':name},200)
    
    def interpret_answer(self,answer_text, question):
        prompt = (
            f"Based on the following answer to the question: '{question}', "
            "please assign a health score from 1 to 5, where 1 is the least healthy answer, "
            "and 5 is the healthiest answer. "
            "The answer can be positive or negative, so evaluate it carefully. "
            "Answer: " + answer_text
        )
        
        response = self.client.chat.completions.create(
            model="gpt-4-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=150
        )
        
        # Extract and return the score from the response
        try:
            score = int(response.choices[0].message.content.strip())
            return score
        except ValueError:
            return 3
    
    def get_score(self,answers):
        scores = []
        for i, answer in enumerate(answers):
            score = self.interpret_answer(answer, self.healthQs[i])
            scores.append(score)
        
        total_score = sum(scores)
        max_score = len(self.healthQs) * 5 
        health_percentage = (total_score / max_score)

        return ({'score':health_percentage},200)

    def process_to_structured_data(self,raw_text):
        """Convert extracted text to structured medical JSON"""
        prompt = f"""
        MEDICAL DOCUMENT STRUCTURING TASK:
        1. Extract ALL clinical data from this document
        2. Organize by medical specialty
        3. Return ONLY valid JSON

        DOCUMENT CONTENT:
        {raw_text[:20000]}... [truncated if long]

        OUTPUT FORMAT:
        {{
            "Patient": {{
                "Age": "value",
                "Gender": "value"
            }},
            "Specialties": {{
                "Cardiology": {{
                    "ECG": "findings",
                    "Tests": {{"Troponin": "X ng/mL"}}
                }}
            }}
        }}
        """
        
        response = self.deepseek_client.chat.completions.create(
            model=self.CONFIG["models"]["deepseek"],
            messages=[
                {"role": "system", "content": "You're a medical data structuring specialist."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2,
            max_tokens=4000
        )
        
        try:
            return json.loads(response.choices[0].message.content)
        except json.JSONDecodeError:
            match = re.search(r'\{.*\}', response.choices[0].message.content, re.DOTALL)
            return json.loads(match.group()) if match else {}

    # --- Pipeline Phases ---
    def generate_initial_summary(self,data):
        """Phase 1: Structured data to narrative"""
        prompt = f"""
        Create clinical narrative from:
        {json.dumps(data, indent=2)}
        
        Rules:
        1. Preserve ALL data exactly
        2. No interpretations
        3. Use standard medical format
        """
        response = self.deepseek_client.chat.completions.create(
            model=self.CONFIG["models"]["deepseek"],
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content

    def generate_expert_queries(self,summary):
        """Phase 2: Identify specialist questions"""
        prompt = f"""
        Based on this summary, generate specialist consultation questions:
        {summary}
        
        Format each as:
        \"\"\"
        A [age]-year-old [gender] with [history] presents with [findings]. 
        Key results: [values]. Question: [specific query]?
        \"\"\"
        """
        response = self.deepseek_client.chat.completions.create(
            model=self.CONFIG["models"]["deepseek"],
            messages=[{"role": "user", "content": prompt}]
        )
        return [q.strip() for q in response.choices[0].message.content.split('\n\n') if q.strip()]

    def get_expert_opinions(self,queries):
        """Phase 2.1: Get specialist responses"""
        results = []
        for query in queries:
            response = self.client.chat.completions.create(
                model=self.CONFIG["models"]["expert"],
                messages=[
                    {"role": "system", "content": "You are a medical specialist."},
                    {"role": "user", "content": query}
                ],
                temperature=0.5
            )
            results.append({
                "query": query,
                "response": response.choices[0].message.content,
                "timestamp": datetime.now().isoformat()
            })
        return results

    def create_patient_summary(self,initial_summary, expert_opinions):
        """Phase 3: Patient-friendly summary"""
        prompt = f"""
        Create patient summary from:
        Initial Data: {initial_summary}
        Expert Opinions: {json.dumps(expert_opinions, indent=2)}
        
        Include:
        1. Urgent alerts (if any)
        2. Key results explained
        3. Specialist takeaways
        4. Action plan
        
        Format:
        - Plain language
        - No medical jargon
        - Prioritize urgent items
        """
        response = self.deepseek_client.chat.completions.create(
            model=self.CONFIG["models"]["deepseek"],
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content

    def generate_html_summary(self,text_summary):
        """Phase 4: Generate professional medical HTML"""
        prompt = f"""
        Convert this medical summary to clinic-ready HTML:
        
        {text_summary}

        Requirements:
        1. SEMANTIC STRUCTURE:
           - <main> for primary content
           - <section> for each report section
           - <article> for self-contained items
           - <aside> for supplementary notes

        2. MEDICAL FORMATTING:
           - Lab values: <data value="6.2" unit="%">HbA1c: 6.2%</data>
           - Critical values: <strong class="critical">[value]</strong>
           - Normal ranges: <small>(Normal: X-Y)</small>

        3. VISUAL HIERARCHY:
           - h1 > h2 > h3 for headings
           - <ul class="alerts"> for urgent items
           - <ol class="actions"> for steps

        4. ACCESSIBILITY:
           - role="alert" for critical values
           - aria-label for interactive elements
           - tabindex for keyboard nav

        Return ONLY the HTML fragment:
        - No <head> or <body>
        - No external resources
        - Clean indentation
        """
        
        response = self.deepseek_client.chat.completions.create(
            model=self.CONFIG["models"]["deepseek"],
            messages=[
                {"role": "system", "content": "You specialize in medical HTML5 markup."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3
        )
        
        html = response.choices[0].message.content
        return html.replace("```html", "").replace("```", "").strip()
    
    def extract_text_with_docling(self,file_obj):
        file_obj.seek(0)  # Make sure we're at the beginning
        doc = fitz.open(stream=file_obj.read(), filetype="pdf")
        
        text = ""
        for page in doc:
            text += page.get_text()
        
        return text

    def get_summary(self,source):
        try:
            # Phase 0: Input Processing
            structured_data = self.process_to_structured_data(self.extract_text_with_docling(source))
            
            # Phase 1: Initial Summary
            initial_summary = self.generate_initial_summary(structured_data)
            
            # Phase 2: Expert Queries
            queries = self.generate_expert_queries(initial_summary)
            
            # Phase 2.1: Expert Consultations
            expert_opinions = self.get_expert_opinions(queries)
            
            # Phase 3: Patient Summary
            patient_summary = self.create_patient_summary(initial_summary, expert_opinions)
            
            # Phase 4: HTML Output
            html_output = self.generate_html_summary(patient_summary)
            
            return ({ "html_summary": html_output, "stauts":"success" },200)
        
        except Exception as e:
            return ({
                "success": False,
                "error": str(e),
                "source": source[:100] + '...' if isinstance(source, str) else str(source)
            },400)
        
    def get_recomm(self,user_data):
        user_profile =  f"""
        User Profile:
        - Age: {user_data['age']}
        - Weight: {user_data['weight']}kg
        - Height: {user_data['height']}cm
        - Sex: {user_data['sex']}
        - Activity Level: {user_data['activity_level']}
        - Dietary Preferences: {user_data['dietary_preferences']}
        - Fitness Goals: {user_data['fitness_goals']}
        """
        prompt = (
            f"Create a detailed weekly diet plan for:\n{user_profile}\n"
            f"Focus on: {user_data['dietary_preferences']} diet for {user_data['fitness_goals']}\n"
            "Include:\n"
            "- Daily meal breakdown (breakfast, lunch, dinner, snacks)\n"
            "- Portion sizes\n"
            "- Nutritional highlights\n"
            "- Preparation tips"
        )
        response = self.client.chat.completions.create(
            model='gpt-4-turbo',
            messages=[
                {"role": "system", "content": """You are a nutritionist creating personalized diet plans. 
                Provide clear, structured meal plans with:
                - Daily meal breakdown (breakfast, lunch, dinner, snacks)
                - Portion sizes
                - Nutritional highlights
                - Preparation tips
                
                Format the output as clean text without any special characters like *, #, or markdown formatting.
                Use simple headings and bullet points for easy reading. wrap up everything in a html format like using <ul> and heading tags whenever possible"""},
                {"role": "user", "content": prompt}
            ],
            max_tokens=1500,
            temperature=0.7
        )
        return ({'res':response.choices[0].message.content},200)




if __name__ == "__main__":
    db = DB(mysql.connector.connect(host='localhost',user='root',password='HinokamiKagura@13',database='NeuroSwasth'))
    db.userid = 1
    print(db.get_summary(r"C:\Users\sasan\Downloads\Medical_Report_1_1_pdf.pdf"))
    #db.cur.execute('desc consumption')
    #print(db.cur.fetchall())

    