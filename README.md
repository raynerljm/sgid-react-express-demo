# sgID React & Express Demo

This is a demo app that integrates [sgID](https://www.id.gov.sg/) with React as the frontend and Express as the backend.

## Registration

1. Visit the (developer portal)[https://developer.id.gov.sg/]
2. Sign in using the Singpass Mobile App
3. Click `Register new client`
4. Input your desired `Name` and `Description`
5. Select `NAME` under `Scopes`
6. Add `http://localhost:3000/api/callback` under `Callback URLs`
7. Click `Register`
8. Download the credentials and keep it in a safe place

## Installation

0. Ensure you have `Node.js` installed
1. Clone the repository
2. Setup the frontend
   - Enter the frontend folder using `cd sgid-demo-frontend`
   - Run `npm install`
   - Copy the `.env.example` file and rename it as `.env`
     - Fill in `BACKEND_URL` as `http://localhost:3000`
3. Setup the backend
   - Enter the backend folder using `cd sgid-demo-backend`
   - Run `npm install`
   - Copy the `.env.example` file and rename it as `.env`
   - Fill in your credentials (that you downloaded in `Registration`) into the `.env` file
     - Copy the value of `id` into `SGID_CLIENT_ID`
     - Copy the value of `secret` into `SGID_CLIENT_SECRET`
     - Copy the value of `privateKey` into `SGID_PRIVATE_KEY`
     - Fill in `FRONTEND_URL` as `http://localhost:5173`

## Running the app

1. `cd` into the `frontend` folder and run `npm run dev`
2. In a new terminal, `cd` into the `backend` folder and run `npm run dev`
3. Visit `http://localhost:5173` on your browser
4. Test it out using your Singpass Mobile App
