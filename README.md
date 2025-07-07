# simple-auth

This project is small web called "Monitoring". The only purpose of this project is to create simple authentication
secured by `httpOnly` cookies for SPA with separated backend and frontend.

Project is implemented in MEVN stack:

- MongoDB
- Express.js
- Vue.js
- Node.js

For authentication are used JSON Web Tokens (JWT). Those are saved in httpOnly cookies. In frontend are httpOnly cookies
unreachable so for protecting routes and other stuff in frontend is used state of Vue application. Easy state management is
done by `Vuex`.

## commands

- `npm run backend` - starts the express server
- `npm run frontend` - starts vue production server
- `npm run dev` - starts both => backend and frontend
- `npm run build` - installs dependencies and builds the frontend# MonitoringPLTSGenerator

#Hardware
- `Pzem004-T`
- `LCD TFT` 
- `ESP32` 
- `RS485 to TTL` 
- `Temperature Sensor RS485` 
