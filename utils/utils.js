const { spec } = require('pactum');

async function generateToken(username, password) {
  let token;

  await spec()
    .post('/auth')
    .withJson({
      username: username,
      password: password,
    })
    .expectStatus(200)
    .returns((response) => {
      token = response.res.body.token;
    });

  return token;
}

module.exports = { generateToken };
