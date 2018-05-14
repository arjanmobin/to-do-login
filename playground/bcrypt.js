const bcrypt = require('bcryptjs');

const password = 'abc';
console.log('Password:', password);
bcrypt.hash(password, 10)
  .then((hash) => {
    console.log('Hashed password', hash);
  })
  .catch(e => {
    console.log(e);
  })
