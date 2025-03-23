import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Header from "./header";
import "./styles/sof.css";

const myths_facts = [
  {
    "myth": "Antibiotics Cure the Common Cold",
    "fact": "The common cold is caused by viruses, not bacteria. Antibiotics only work against bacterial infections, making them ineffective against colds, flu, and other viral illnesses. Misusing antibiotics can contribute to antibiotic resistance, making bacterial infections harder to treat. Focus on rest, hydration, and over-the-counter remedies to relieve symptoms.",
    "source": [
      "Centers for Disease Control and Prevention (CDC) – Antibiotic Use",
      "World Health Organization (WHO) – Antimicrobial Resistance"
    ]
  },
  {
    "myth": "Being in Cold Weather Makes You Sick",
    "fact": "Colds are caused by viruses, not cold weather. While colder temperatures may weaken your immune system slightly, the primary reason people get sick in winter is increased indoor crowding, which facilitates virus transmission. Staying warm is important for comfort, but it won’t prevent or cause illness.",
    "source": [
      "Harvard Medical School – Does Cold Weather Make You Sick?",
      "National Institutes of Health (NIH) – Common Cold Overview"
    ]
  },
  {
    "myth": "Eggs Are Bad for Your Heart",
    "fact": "While eggs contain cholesterol, they have minimal impact on blood cholesterol levels for most people. Eggs are nutritious, packed with protein, vitamins, and healthy fats. Moderate egg consumption (one per day) does not increase heart disease risk and may have health benefits. The real concern is excessive consumption of processed and unhealthy fats, not eggs themselves.",
    "source": [
      "American Heart Association – Eggs and Heart Health",
      "Harvard T.H. Chan School of Public Health – Are Eggs Healthy?"
    ]
  },
  {
    "myth": "You Must Drink Exactly 8 Glasses of Water a Day",
    "fact": "Hydration needs vary based on factors like body size, activity level, and climate. While drinking water is essential, your body also gets fluids from food, tea, coffee, and other beverages. Instead of counting glasses, listen to your body's thirst signals and check that your urine is a light yellow color, which generally indicates proper hydration.",
    "source": [
      "Mayo Clinic – How Much Water Do You Need?",
      "National Academies of Sciences, Engineering, and Medicine – Dietary Reference Intakes for Water"
    ]
  }
];

const fields = ['Handwashing', 'HIV', 'CPR First Aid', 'Electric Shock First Aid', 'First Aid in Seizure', 'Snakebite']

export default function Sof() {

  const [cur, setCur] = useState(null);

  const mthds = [<HandWash />, <HIV />, <CPR />, <ElectricShock />, <SeizureFirstAid />, <Snakebite />]

  return (
    <>
      <Header comp={"School of Fundamentals"} />
      <div className="sofmain">
        <div className="sofbox">
            {cur !== null ? <><button className="sofbackbtn" onClick={() => setCur(null)}><ChevronLeft /></button>{mthds[fields.indexOf(cur)]} </> :<>
                  <>
                          <div className="dropdownopen">
                              <Myth />
                          </div>
                  </>
              {fields.map((field,i) => <>
                      <div onClick={() => setCur(field)} key={i} style={{ marginTop: "1%" }} className="sofitem">
                        <label>{field}</label>
                      </div>
                  </>)
              }
              <div className="dummy"></div>
              </>
            }
        </div>
      </div>
    </>
  );
}


function Myth() {

  const [mi, setMI] = useState(0);
  const [mode, setMode] = useState(true);

  const toggleMode = () => setMode((prev) => !prev);

  const prevMyth = (e) => {
    e.stopPropagation(); // Prevent unwanted parent clicks
    setMI((prev) => (prev > 0 ? prev - 1 : myths_facts.length - 1));
    setMode(true);
  };

  const nextMyth = (e) => {
    e.stopPropagation(); // Prevent unwanted parent clicks
    setMI((prev) => (prev < myths_facts.length - 1 ? prev + 1 : 0));
    setMode(true);
  };

  return (
    <div className="mythdat" onClick={toggleMode}>
      <button onClick={prevMyth}>
        <ChevronLeft />
      </button>
      <div>
        {mode ? (
          <>
            <h2>Myth</h2>
            <label>{myths_facts[mi].myth}</label>
          </>
        ) : (
          <>
            <h2>Fact</h2>
            <label>{myths_facts[mi].fact}</label>
          </>
        )}
      </div>
      <button onClick={nextMyth}>
        <ChevronRight />
      </button>
    </div>
  );
}

function HandWash() {
  return <>
    <div className="handwashdt">
      <div className="sofhw-container">
        <div className="sofhw-content">
          <h1>🧼 Handwashing: A Simple Habit for a Healthier Life</h1>
          <p>
            Handwashing is one of the most effective ways to prevent the spread of infections and maintain overall hygiene.
            Proper hand hygiene reduces the risk of illnesses such as colds, flu, foodborne diseases, and serious infections like COVID-19.
          </p>

          <h2>🦠 Why is Handwashing Important?</h2>
          <ul>
            <li>✔ <strong>Prevents the Spread of Germs</strong> – Reduces transmission of bacteria and viruses.</li>
            <li>✔ <strong>Protects Against Foodborne Illnesses</strong> – Keeps harmful microbes from contaminating food.</li>
            <li>✔ <strong>Lowers the Risk of Respiratory Infections</strong> – Reduces the spread of flu and colds.</li>
            <li>✔ <strong>Promotes Overall Hygiene</strong> – Helps maintain cleanliness and personal health.</li>
          </ul>

          <h2>🧼 When Should You Wash Your Hands?</h2>
          <ul>
            <li>✅ Before eating or preparing food</li>
            <li>✅ After using the restroom</li>
            <li>✅ After coughing, sneezing, or blowing your nose</li>
            <li>✅ Before and after caring for a sick person</li>
            <li>✅ After touching garbage or dirty surfaces</li>
            <li>✅ After handling animals or pet waste</li>
            <li>✅ After changing diapers or helping a child use the toilet</li>
          </ul>

          <h2>🖐 Steps for Proper Handwashing</h2>
          <ol>
            <li>1️⃣ <strong>Wet Hands</strong> – Use clean, running water (warm or cold) and apply soap.</li>
            <li>2️⃣ <strong>Rub Palms Together</strong> – Ensure the soap lathers well.</li>
            <li>3️⃣ <strong>Interlace Fingers and Scrub</strong> – Clean between the fingers thoroughly.</li>
            <li>4️⃣ <strong>Scrub the Back of Hands</strong> – Wash the back of each hand properly.</li>
            <li>5️⃣ <strong>Clean Thumbs and Wrists</strong> – Pay special attention to often-missed areas.</li>
            <li>6️⃣ <strong>Rub Fingertips on Palms</strong> – Helps remove dirt under nails.</li>
            <li>7️⃣ <strong>Rinse Hands Well</strong> – Use running water to wash away all soap and germs.</li>
            <li>8️⃣ <strong>Dry Hands Properly</strong> – Use a clean towel or air dry your hands.</li>
          </ol>

          <h2>🧴 Handwashing vs. Hand Sanitizer</h2>
          <ul>
            <li>✔ <strong>Soap & Water</strong>: Best for removing all types of germs, dirt, and grease.</li>
            <li>✔ <strong>Alcohol-Based Sanitizer</strong> (at least 60% alcohol): Effective against most viruses and bacteria but does not remove dirt and harmful chemicals.</li>
          </ul>
          <p>Use hand sanitizer when soap and water are not accessible, but always prefer washing hands when possible.</p>

          <h2>📊 Additional Resources</h2>
          <ul>
            <li><a href="https://www.who.int/gpsc/5may/hand-hygiene" className="sofhw-link" target="_blank" rel="noopener noreferrer">WHO - Hand Hygiene Guidelines</a></li>
            <li><a href="https://www.cdc.gov/handwashing/index.html" className="sofhw-link" target="_blank" rel="noopener noreferrer">CDC - Handwashing</a></li>
            <li><a href="https://globalhandwashing.org/" className="sofhw-link" target="_blank" rel="noopener noreferrer">Global Handwashing Partnership</a></li>
            <li><a href="https://www.unicef.org/wash/hand-hygiene" className="sofhw-link" target="_blank" rel="noopener noreferrer">UNICEF - Hand Hygiene for All</a></li>
          </ul>

          <div className="sofhw-video-container">
            <h2>🎥 Video Guide</h2>
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/3PmVJQUCm4E?si=jdZQvXsBsqqn4TFt"
              title="Handwashing Guide"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>

          <h2>💡 Final Thoughts</h2>
          <p>
            Handwashing is a simple yet powerful habit that protects you and those around you from illnesses.
            By following proper hand hygiene practices, you contribute to a healthier and cleaner world. Make it a routine, educate others, and always keep your hands clean!
          </p>
        </div>
      </div>
    </div>
  </>
}

function HIV(){
  return (
    <div className="sofhiv-container">
      <div className="sofhiv-content">
        <h1>🔴 HIV/AIDS: Understanding Transmission and Myths</h1>
        <p>
          HIV (Human Immunodeficiency Virus) is a virus that attacks the immune system, potentially leading to AIDS (Acquired Immunodeficiency Syndrome) if left untreated. Understanding how HIV is transmitted and how it is not can help reduce stigma and promote awareness.
        </p>

        <h2>🔴 How is HIV Transmitted?</h2>
        <ul>
          <li>✔ <strong>Unprotected Sex</strong>: Engaging in sexual activities without a condom or preventive medication increases the risk.</li>
          <li>✔ <strong>Pregnancy, Childbirth, and Breastfeeding</strong>: An HIV-positive mother can pass the virus to her child if not properly treated.</li>
          <li>✔ <strong>Sharing Needles or Syringes</strong>: Drug users who share injection equipment risk direct transmission of infected blood.</li>
          <li>✔ <strong>Blood Transfusion</strong>: Receiving contaminated blood or blood products can lead to infection. However, this risk is extremely low in places with strict screening procedures.</li>
        </ul>

        <h2>🔵 HIV is NOT Transmitted Through:</h2>
        <ul>
          <li>❌ <strong>Touching, Hugging, or Shaking Hands</strong> – Physical contact like handshakes or casual touch does not spread HIV.</li>
          <li>❌ <strong>Sharing Food or Drinks</strong> – Eating from the same plate, drinking from the same glass, or sharing utensils does not transmit HIV.</li>
          <li>❌ <strong>Kissing</strong> – Closed-mouth kissing does not spread HIV. Deep kissing is only risky if both partners have open wounds or bleeding gums.</li>
          <li>❌ <strong>Insect Bites</strong> – Mosquitoes or other insects do not carry or transmit HIV.</li>
        </ul>

        <h2>✨ Prevention and Awareness</h2>
        <ul>
          <li>✔ <strong>Practice Safe Sex</strong>: Use condoms and consider pre-exposure prophylaxis (PrEP) for prevention.</li>
          <li>✔ <strong>Get Tested Regularly</strong>: Knowing your HIV status helps in early detection and treatment.</li>
          <li>✔ <strong>Avoid Sharing Needles</strong>: Always use clean, sterile needles.</li>
          <li>✔ <strong>Proper Medical Care During Pregnancy</strong>: HIV-positive mothers can take medications to prevent transmission to their babies.</li>
        </ul>

        <h2>📊 Additional Resources</h2>
        <ul>
          <li><a href="https://www.who.int/health-topics/hiv-aids" className="sofhiv-link" target="_blank" rel="noopener noreferrer">WHO - HIV/AIDS</a></li>
          <li><a href="https://www.cdc.gov/hiv/basics/index.html" className="sofhiv-link" target="_blank" rel="noopener noreferrer">CDC - HIV Basics</a></li>
          <li><a href="https://www.unaids.org/en/resources/fact-sheet" className="sofhiv-link" target="_blank" rel="noopener noreferrer">UNAIDS - Global HIV & AIDS Statistics</a></li>
          <li><a href="https://www.hiv.gov" className="sofhiv-link" target="_blank" rel="noopener noreferrer">HIV.gov - Comprehensive HIV/AIDS Information</a></li>
        </ul>

        <div className="sofhiv-video-container">
          <h2>🎥 Video Guide</h2>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/BADDj82oces?si=AgzPCSusZCKg791j"
            title="HIV/AIDS Awareness"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>

        <h2>💡 Final Thoughts</h2>
        <p>
          HIV is preventable and manageable with the right precautions and treatment. Misinformation and stigma should be replaced with facts and support for those living with HIV. Stay informed, practice safety, and spread awareness!
        </p>
      </div>
    </div>
  );
};

const CPR = () => {
  return (
    <div className="sofcpr-container">
      <div className="sofcpr-content">
        <h1>🚑 CPR First Aid | How to Perform CPR in an Emergency?</h1>
        <p>
          Cardiopulmonary Resuscitation (CPR) is a life-saving technique used in emergencies when someone's breathing or heartbeat has stopped. Quick and effective CPR can double or even triple the chances of survival.
        </p>

        <h2>🔍 When to Perform CPR?</h2>
        <ul>
          <li>✔ <strong>Unresponsive and not breathing</strong></li>
          <li>✔ <strong>No pulse</strong></li>
          <li>✔ <strong>Drowning, suffocation, or cardiac arrest</strong></li>
          <li>✔ <strong>Electrocution or severe injury causing heart stoppage</strong></li>
        </ul>

        <h2>✅ How to Perform CPR (Step-by-Step Guide)</h2>
        <h3>Step 1: Check Responsiveness</h3>
        <ul>
          <li>✔ Tap the person on the shoulder and loudly ask, "Are you okay?"</li>
          <li>✔ If there is no response, immediately call for emergency medical help.</li>
        </ul>

        <h3>Step 2: Open the Airway</h3>
        <ul>
          <li>✔ Place the person on their back on a firm surface.</li>
          <li>✔ Tilt their head back slightly and lift the chin to open the airway.</li>
        </ul>

        <h3>Step 3: Check for Breathing</h3>
        <ul>
          <li>✔ Look, listen, and feel for breathing for no more than 10 seconds.</li>
          <li>✔ If the person is not breathing or is gasping, begin CPR immediately.</li>
        </ul>

        <h3>Step 4: Start Chest Compressions</h3>
        <ul>
          <li>✔ Place the heel of one hand in the center of the chest (just below the nipple line).</li>
          <li>✔ Put your other hand on top, interlocking the fingers.</li>
          <li>✔ Keep your arms straight and use your upper body weight to push down hard and fast.</li>
          <li>✔ <strong>Compression Depth:</strong> At least 2 inches (5 cm) deep.</li>
          <li>✔ <strong>Compression Rate:</strong> 100-120 compressions per minute.</li>
          <li>✔ Allow the chest to rise fully between compressions.</li>
        </ul>

        <h3>Step 5: Give Rescue Breaths (If Trained)</h3>
        <ul>
          <li>✔ After 30 compressions, give 2 rescue breaths.</li>
          <li>✔ Pinch the person's nose shut and seal your mouth over theirs.</li>
          <li>✔ Breathe in gently and watch for chest rise.</li>
          <li>✔ If the chest does not rise, reposition the airway and try again.</li>
          <li>✔ Continue cycles of 30 compressions and 2 breaths.</li>
        </ul>

        <h3>Step 6: Continue Until Help Arrives</h3>
        <ul>
          <li>✔ Do not stop CPR unless:</li>
          <ul>
            <li>The person starts breathing normally.</li>
            <li>Medical professionals take over.</li>
            <li>An Automated External Defibrillator (AED) is available and ready to use.</li>
            <li>You are too exhausted to continue.</li>
          </ul>
        </ul>

        <h2>❌ What NOT To Do (Common Mistakes to Avoid)</h2>
        <ul>
          <li>❌ Do Not Delay CPR – Immediate action is crucial for survival.</li>
          <li>❌ Do Not Give Shallow Compressions – Compressions must be deep enough to be effective.</li>
          <li>❌ Do Not Stop Too Soon – Keep going until professional help arrives or the person recovers.</li>
          <li>❌ Do Not Blow Too Hard During Rescue Breaths – Gentle breaths are enough to make the chest rise.</li>
        </ul>

        <h2>📊 Additional Resources</h2>
        <ul>
          <li><a href="https://www.heart.org" className="sofcpr-link" target="_blank" rel="noopener noreferrer">American Heart Association - CPR Guidelines</a></li>
          <li><a href="https://www.redcross.org" className="sofcpr-link" target="_blank" rel="noopener noreferrer">Red Cross - CPR Training</a></li>
          <li><a href="https://www.who.int" className="sofcpr-link" target="_blank" rel="noopener noreferrer">WHO - First Aid Basics</a></li>
        </ul>

        <div className="sofcpr-video-container">
          <h2>🎥 Video Guide</h2>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/hizBdM1Ob68?si=Z5hSsuRsXYje5Zi0"
            title="CPR Training"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>

        <h2>💡 Final Thoughts</h2>
        <p>
          Knowing CPR can save lives. Whether at home, work, or in public, your quick response can make all the difference. Consider taking a certified CPR training course to be fully prepared for emergencies!
        </p>
      </div>
    </div>
  );
};

const ElectricShock = () => {
  return (
    <div className="sofes-container">
      <div className="sofes-content">
        <h1>⚡ Electric Shock First Aid | What to Do in Case of an Electric Shock?</h1>
        <p>
          Electric shocks can range from minor to life-threatening, depending on the voltage and duration of contact. Immediate and appropriate first aid can save a life. Here’s what you need to know.
        </p>

        <h2>⚡ What is an Electric Shock?</h2>
        <p>
          An electric shock occurs when the body comes into direct contact with an electrical source, causing an electric current to pass through the tissues. This can lead to burns, nerve damage, cardiac arrest, or even death in severe cases.
        </p>

        <h2>🔍 How to Identify an Electric Shock?</h2>
        <ul>
          <li>✔ Sudden collapse or unconsciousness</li>
          <li>✔ Burns at the entry and exit points of the current</li>
          <li>✔ Muscle spasms or paralysis</li>
          <li>✔ Breathing difficulty or irregular heartbeat</li>
          <li>✔ Loss of responsiveness or confusion</li>
          <li>✔ Tingling sensation or numbness in limbs</li>
        </ul>

        <h2>✅ What To Do (Essential First Aid Steps)</h2>
        <ul>
          <li>✔ <strong>Ensure Your Own Safety</strong> – Do not touch the person if they are still in contact with the electrical source. Turn off the power supply immediately before approaching them.</li>
          <li>✔ <strong>Call Emergency Services</strong> – Dial the emergency number immediately for professional medical help.</li>
          <li>✔ <strong>Use a Non-Conductive Object</strong> – If turning off the power is not an option, use a dry wooden stick, rubber object, or plastic material to push the person away from the electrical source.</li>
          <li>✔ <strong>Check for Breathing and Pulse</strong> – If the person is unresponsive, check their breathing and pulse. If they are not breathing, begin CPR immediately.</li>
          <li>✔ <strong>Treat Burns</strong> – Run cool (not ice-cold) water over burns for at least 10 minutes. Do not apply ice, ointments, or break blisters.</li>
          <li>✔ <strong>Keep the Person Calm and Still</strong> – Encourage them to remain still to prevent further injury.</li>
          <li>✔ <strong>Monitor for Delayed Symptoms</strong> – Even if the person appears fine, they should seek medical attention.</li>
        </ul>

        <h2>❌ What NOT To Do (Common Mistakes to Avoid)</h2>
        <ul>
          <li>❌ Do Not Touch the Person Without Ensuring the Power is Off – This could result in a second victim.</li>
          <li>❌ Do Not Use Water if the Electrical Source is Still Active – Water conducts electricity and may cause further harm.</li>
          <li>❌ Do Not Move the Person Unless Necessary – They may have suffered internal injuries or fractures.</li>
          <li>❌ Do Not Ignore Minor Shocks – Even a mild electric shock can have delayed effects.</li>
        </ul>

        <h2>📊 Additional Resources</h2>
        <ul>
          <li><a href="https://www.redcross.org" className="sofes-link" target="_blank" rel="noopener noreferrer">American Red Cross - Electrical Injuries</a></li>
          <li><a href="https://www.who.int" className="sofes-link" target="_blank" rel="noopener noreferrer">WHO - Electrical Safety Guidelines</a></li>
          <li><a href="https://pubmed.ncbi.nlm.nih.gov/" className="sofes-link" target="_blank" rel="noopener noreferrer">National Library of Medicine - Electrical Injury Management</a></li>
        </ul>

        <div className="sofes-video-container">
          <h2>🎥 Video Guide</h2>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/WV5x2PQ71xE?si=wZ7X_y8U_DqY4lAy"
            title="Electric Shock First Aid"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>

        <h2>💡 Final Thoughts</h2>
        <p>
          Electric shocks can be dangerous, but quick and proper first aid can save lives. Always ensure your safety first, turn off the power, and seek medical attention for the affected person. Share this knowledge—it could make a life-saving difference!
        </p>
      </div>
    </div>
  );
};

const SeizureFirstAid = () => {
  return (
    <div className="sofseiz-container">
      <div className="sofseiz-content">
        <h1>🧠 First Aid in Seizure | What to Do in Case of a Seizure?</h1>
        <p>
          Seizures can happen suddenly and may be frightening to witness, but knowing what to do can make a significant difference in ensuring the safety of the person experiencing one. Here’s a guide on how to provide first aid during a seizure.
        </p>

        <h2>🧠 What is a Seizure?</h2>
        <p>
          A seizure is a sudden, uncontrolled electrical disturbance in the brain that can cause changes in behavior, movements, feelings, and levels of consciousness.
        </p>

        <h2>🔍 How to Identify a Seizure?</h2>
        <h3>Convulsive Seizures (Generalized Tonic-Clonic Seizures):</h3>
        <ul>
          <li>✔ Sudden loss of consciousness</li>
          <li>✔ Stiffening of the body (tonic phase)</li>
          <li>✔ Rhythmic jerking movements (clonic phase)</li>
          <li>✔ Drooling or foaming at the mouth</li>
          <li>✔ Loss of bladder or bowel control</li>
          <li>✔ Temporary confusion or disorientation after the seizure</li>
        </ul>

        <h3>Non-Convulsive Seizures (Absence or Focal Seizures):</h3>
        <ul>
          <li>✔ Staring spells or unresponsiveness</li>
          <li>✔ Repetitive movements like lip-smacking or hand fidgeting</li>
          <li>✔ Sudden confusion or difficulty speaking</li>
          <li>✔ Temporary loss of awareness without collapse</li>
        </ul>

        <h2>✅ What To Do (Essential First Aid Steps)</h2>
        <ul>
          <li>✔ <strong>Stay Calm</strong> – Keep yourself composed so you can help effectively.</li>
          <li>✔ <strong>Ensure Safety</strong> – Move sharp objects and furniture away. Place a soft object under their head.</li>
          <li>✔ <strong>Turn the Person on Their Side</strong> – This helps keep their airway clear and prevents choking.</li>
          <li>✔ <strong>Time the Seizure</strong> – If it lasts more than 5 minutes, call emergency services.</li>
          <li>✔ <strong>Loosen Tight Clothing</strong> – Loosen anything tight around their neck to help them breathe.</li>
          <li>✔ <strong>Stay With Them Until Fully Alert</strong> – Reassure them and help them regain awareness slowly.</li>
          <li>✔ <strong>Call Emergency Services If Needed</strong> – Seek medical help if the seizure lasts too long, is their first-ever seizure, or they have trouble breathing afterward.</li>
        </ul>

        <h2>❌ What NOT To Do (Common Mistakes to Avoid)</h2>
        <ul>
          <li>❌ Do Not Hold Them Down – Restraining can cause injuries.</li>
          <li>❌ Do Not Put Anything in Their Mouth – They will not swallow their tongue, and objects can cause choking.</li>
          <li>❌ Do Not Give Food or Water During or Immediately After the Seizure – Wait until they are fully alert.</li>
          <li>❌ Do Not Panic – Staying calm is the best way to help.</li>
        </ul>

        <h2>📊 Additional Resources</h2>
        <ul>
          <li><a href="https://www.epilepsy.com" className="sofseiz-link" target="_blank" rel="noopener noreferrer">Epilepsy Foundation - Seizure First Aid</a></li>
          <li><a href="https://www.who.int/news-room/fact-sheets/detail/epilepsy" className="sofseiz-link" target="_blank" rel="noopener noreferrer">WHO - Epilepsy Information</a></li>
          <li><a href="https://www.cdc.gov/epilepsy/basics/first-aid.htm" className="sofseiz-link" target="_blank" rel="noopener noreferrer">CDC - Seizure First Aid</a></li>
        </ul>

        <div className="sofseiz-video-container">
          <h2>🎥 Video Guide</h2>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/owXhSD7XwUk?si=VhTUnTCMdwLH_2gj"
            title="Seizure First Aid"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>

        <h2>💡 Final Thoughts</h2>
        <p>
          Knowing what to do during a seizure can help prevent injuries and save lives. Stay calm, provide a safe environment, and seek medical help when necessary. Share this knowledge so more people can be prepared in case of an emergency.
        </p>
      </div>
    </div>
  );
};

const Snakebite = () => {
  return (
    <div className="sofskb-container">
      <div className="sofskb-content">
        <h1>🐍 Snakebite: What You Should and Shouldn’t Do</h1>
        <p>
          A snakebite can be a scary experience, but staying calm and acting wisely can make all the difference. While some snakebites are harmless, others may inject venom, which requires immediate medical attention. Here’s what you should do—and what you should avoid—if you or someone around you is bitten by a snake.
        </p>

        <h2>✅ What To Do (The Right Actions)</h2>
        <ul>
          <li>✔ <strong>Stay Calm</strong> – Panic increases heart rate, which can spread venom faster.</li>
          <li>✔ <strong>Inform an Adult or Emergency Services</strong> – Call an ambulance as soon as possible.</li>
          <li>✔ <strong>Leave the Snake Alone</strong> – Do not attempt to chase, capture, or kill it.</li>
          <li>✔ <strong>Limit Movement</strong> – Keep the bitten limb as still as possible to slow venom spread.</li>
          <li>✔ <strong>Go to the Hospital</strong> – Even if you feel fine, seek medical attention immediately.</li>
        </ul>

        <h2>❌ What NOT To Do (Common Myths & Mistakes)</h2>
        <ul>
          <li>❌ Do Not Cut the Wound – This can cause more tissue damage and infection.</li>
          <li>❌ Do Not Suck the Wound – It’s ineffective and can introduce bacteria into the wound.</li>
          <li>❌ Do Not Apply Heat, Cold, or Electric Shock – These methods do not neutralize venom.</li>
          <li>❌ Do Not Use a Tourniquet – Cutting off blood flow can lead to severe complications.</li>
          <li>❌ Do Not Rely on Traditional Remedies – Unproven methods can delay proper treatment.</li>
        </ul>

        <h2>📊 Additional Resources</h2>
        <ul>
          <li><a href="https://www.who.int/health-topics/snakebite" className="sofskb-link" target="_blank" rel="noopener noreferrer">WHO - Snakebite Envenoming</a></li>
          <li><a href="https://www.cdc.gov/disasters/snakebites.html" className="sofskb-link" target="_blank" rel="noopener noreferrer">CDC - Snakebite First Aid</a></li>
          <li><a href="https://pubmed.ncbi.nlm.nih.gov/" className="sofskb-link" target="_blank" rel="noopener noreferrer">National Library of Medicine - Snakebite Management</a></li>
        </ul>

        <div className="sofskb-video-container">
          <h2>🎥 Video Guide</h2>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/nH8o-bgwo_g?si=xSi5zCg28ciT8rJm"
            title="Snakebite First Aid"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>

        <h2>💡 Final Thoughts</h2>
        <p>
          If you ever encounter a snakebite situation, remember: stay calm, seek medical help, and avoid myths that could make things worse. Snakebites are treatable, but quick and correct actions are key to a safe recovery. Share this knowledge—it could save a life!
        </p>
      </div>
    </div>
  );
};

