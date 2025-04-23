const axios = require('axios');

let counter = 1000;
let currentTime = new Date().getTime();

for(let i=0; i<counter; i++) {
    axios.post('http://localhost:3000/users/sign-up', { username: `user-${currentTime}-${i}`, password: `password-${currentTime}-${i}` }).then();
}
