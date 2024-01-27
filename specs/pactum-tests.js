const { spec, request } = require('pactum');
const { books } = require('../data/books.json');

const dotenv = require('dotenv');
dotenv.config();

let token;
let bookingId;

let username = process.env.USER;
let password = process.env.PASS;

request.setBaseUrl(process.env.BASE_URL);
request.setDefaultHeaders({
  'Content-Type': 'application/json',
  Accept: 'application/json',
});

describe('Testando API restful-booker com PactumJS', () => {
  before(async () => {
    await spec()
      .post('/auth')
      .withJson({
        username: username,
        password: password,
      })
      .expectStatus(200)
      .returns((response) => {
        token = response.res.body.token;
        console.log(token);
      });
  });

  it('Should register a book', async () => {
    await spec()
      .post('/booking')
      .withJson(books.create)
      .expectStatus(200)
      .returns((response) => {
        bookingId = response.res.body.bookingid;
        console.log(bookingId);
      });
  });

  it('Shoul list a book by id', async () => {
    await spec()
      .get(`/booking/${bookingId}`)
      .expectStatus(200)
      .returns((response) => {
        let createdBook = response.res.body;
        console.log(createdBook);
      });
  });

  it('Should update a book', async () => {
    await spec()
      .put(`/booking/${bookingId}`)
      .withCookies('token', `${token}`)
      .withJson(books.update)
      .expectStatus(200)
      .returns((response) => {
        let updateBook = response.res.body;
        console.log(updateBook);
      });
  });

  it('Should remove a book', async () => {
    await spec()
      .delete(`/booking/${bookingId}`)
      .withCookies('token', `${token}`)
      .expectStatus(201);
  });
});
