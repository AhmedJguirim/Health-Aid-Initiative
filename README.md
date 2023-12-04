# HAI : Health Aid Initiative
This project is IEEE ESSTHS student branch's work on the TSYP 11 EMBS challenge. 

## Introduction
This work consists of two parts:
The first part is a mobile application that is meant to help a patient track vital signs like heart rate and blood pressure.It also gets his daily medicine list and his medical records. The app also provides alerts and reminders for medicine and health abnormalities.
The second part is a WEB application that allows the doctor to monitor the health state of their patient. The doctor can also add prescriptions to his patients , add to their medical record and see their medical record.
These two applications are meant to work alongside a health monitoring device like a smart watch , smart band , smart ring ,etc…

## Getting Started
The ready to use code is the backend of the application which consists of 3 servers:
- Secure server : a server containing sensitive data about patients and doctors. It should only respond to requests from the web server. encrypts data with the client’s public key (that is saved in his latest valid medical identity card that we create for him) and sends it through the webserver to the client. 
- Web server : a server that contains most of the application’s data , stored with a patient id that his data can only be fetched from the secure server encrypted. Which means the identity of the patient is well hidden.
- A web socket : this takes care of the real time transmission of notification data and the patient’s vital signs.
### Prerequisites
- Git and git bash : https://git-scm.com/downloads
- Openssl if you don't have it : https://slproweb.com/products/Win32OpenSSL.html
- NodeJS (preferably version 18) : https://nodejs.org/en
- Mongodb: https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-6.0.12-signed.msi
- Visual studio code or your preferred code editor : https://code.visualstudio.com/
### Installation
1- clone the project to your preferred location via these commands on the command line:
```bash
cd c:/path/to/your/prefered/location
git clone https://github.com/sorrow112/embs_tsyp11_essths.git
```
2- still in the command line , you install the dependencies in the web_server, secure_server and the websocket by :
```bash
cd web_server
npm install
cd ../secure_server
npm install
cd ../socket
npm install
```
3- now you need to generate 2 key pairs , 1 for the web_server and 1 for the secure server, this can be done on the git bash command line using these commands :  
```bash
openssl genpkey -algorithm RSA -out private_key.pem
openssl rsa -pubout -in private_key.pem -out public_key.pem
```
once you create the first pair your copy/cut them, then you go to the secure_server folder and create a new folder called keys then paste the keys inside.
you generate a new key pair with the same commands and put it in a folder called keys inside the web_server folder. To finish the job , you need to make a copy of the web_server's public key and put it in the secure_server's keys folder under the name "public_key_webServer.pem", then finally copy the public key of the web_server and put it in the secure_server's keys folder under the name "public_key_secure.pem"
4- for the last step you need to create 2 different databases in mongoDBcompass then put the connection strings in a .env file in the web_server and another .env file inside the secure_server , it'll look something like this : 
```env
MONGO = "mongodb://127.0.0.1:27017/[your database name]"
```

if you followed the details correctly the project should work for you without any issues , feel free to contact me on my email address ahmedsouleimenjguirim@ieee.org
## How to make use of the project
This project contains a multitude of API endpoints that serve serve the purposes already mentioned in the introduction , these endpoints can be found in the routes folder inside the web_server. most of them are very straight forward or have comments on them to explain what they serve for. You can use these APIs in a client application by sending requests to them and receiving responses via a tool like AXIOS or fetch api.

## Main API endpoints of the project
i'll assume that you're gonna run the project on your local machine using port 3002
- doctor's authentication : localhost:3002/api/doctors/auth
- get a doctor's highlighted patients and data relevent to them : localhost:3002/api/HighlightedCards
- add an appointment's report to a patient's medical record : localhost:3002/api/diagnosis
- add a prescription to a patient : localhost:3002/api/prescriptions/:patient_id
- get a patient's medical record : localhost:3002/api/diagnosis/doctor?patient=[patient_id]
- patient's authentication : localhost:3002/api/patients/auth
- get patient's daily medecines : localhost:3002/api/dailyMedicines

to see the complete list of APIs of the project please checkout the routes folders in the web_server.

## Main dependencies used
Many libraries have been used in this project , the most important ones are:
1- ExpressJS : used to easily create routes for the APIs
2- jsonwebtoken : this library was needed to implements a jwt based authentication
3- mongoose : used to send queries to our database servers
4- node-forge : used in the end-to-end encryption as it provides an easy way to encrypt and decrypt data using RSA keys
5- bcrypt : used for password hashing before putting it in the database
6- axios : used for communication between different servers and sending API requests
7- qrcode : used for qr code generation for the patients authentication

## Contact
If you have any questions conserning certain functionalities or the installation process , feel free to contact me on my email: jguirimahmed111@gmail.com


