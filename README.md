# MongoDB User Registration 

This project contains two separate implementations for interacting with MongoDB, each in its own folder:

- `interview-question_eng`: Uses my own public MongoDB server with **Mongoose** _(I am aware that this DB server publicly accessible, no worries.)_
- `solmy-assesment_eng`: Uses the MongoDB **native driver** with a **local MongoDB server**.

## ⚙️ Prerequisites

- Node.js installed on your system.
- MongoDB server (required for running `solmy-assesment_eng` locally).
- npm (Node Package Manager) to install dependencies.

## 🛠️ Setup and Running

```bash
# 1. Clone the repository
git clone https://github.com/syukranDev/nodejs_registration_app
cd <repository-name>

# 2. Install dependencies for both folders
cd interview-question.eng
npm install

cd ../solmy-assesment.eng
npm install

# 3. Run interview-question.eng (public MongoDB + Mongoose)
cd ../interview-question_eng
npm run dev

Run this URL on your browser: http://localhost:3300/

# 4. Run solmy-assesment_eng (local MongoDB + native driver)
cd ../solmy-assesment_eng
npm run dev

Run this URL on your browser: http://localhost:3000/
```
Note: There are two sets of API logic for the register endpoint in `solmy-assesment_eng`. One uses a transaction, and the other is based on a locking mechanism. You can uncomment the relevant section in the code to try either approach.

![image](https://github.com/user-attachments/assets/b1d4cee3-e300-4d76-9071-067359ac9c67)
![image](https://github.com/user-attachments/assets/5c148b7d-e215-448b-a48d-0913477a1eff)
![image](https://github.com/user-attachments/assets/becee5e5-4220-4cb4-b375-dc5d5fdcc2d6)
![image](https://github.com/user-attachments/assets/dbb9425c-9900-4b48-8038-1c3a31c4fc40)





