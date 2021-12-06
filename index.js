const express = require('express');
const bodyParser = require('body-parser');

const controller = require('./controllers');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/user', controller.users);

app.post('/login', controller.login);

app.use('/categories', controller.categories);

app.use('/post', controller.posts);

app.listen(3000, () => console.log('ouvindo porta 3000!'));

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (request, response) => {
  response.send();
});
