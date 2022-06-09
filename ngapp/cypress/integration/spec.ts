declare var describe: any;
declare var it: any;

function randomString(length:number=16,digits=true) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    let mod = characters.length;
    if(!digits) mod -= 10;
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(
        (Math.floor(Math.random() * 
 charactersLength)) % mod);
   }
   return result;
}

function fudgeVerification(username: string) {
  return cy
    .request(`localhost:4000/user/fudgeVerification/${username}`)
    .should(response=>{
      console.log(response);
      cy.request(response.body);
    });
;
}

function randomEmail() {
  return `${randomString(10)}@${randomString(10)}.${randomString(5,false)}`;
}

type Creds = {
  username: string;
  password: string;
  email:    string;
  token?:   string;
}

function bearer(token: string): string {
  token = token ?? 'fake';
  return 'Bearer ' + token;
}

function randomCreds(): Creds {
    const username = randomString();
    const password = randomString();
    const email    = randomEmail();
    return {username,password,email};
}

function register(body: Creds) {
  const opts = {
    url: 'localhost:4000/user/register',
    method: 'POST',
    body: body,
  };
  return cy.request(opts as any);
}

function login(body: Creds) {
  const opts = {
    url: 'localhost:4000/user/login',
    method: 'POST',
    body,
  };
  return cy.request(opts as any);
}

function whoami(token: string,failOnStatusCode=true) {
  const opts = {
    failOnStatusCode,
    url: 'localhost:4000/user/whoami',
    method: 'GET',
    auth: {bearer: token}
  }
  return cy.request(opts as any);
}


describe('/whoami authorization', () => {
  it('is unauthorized without jwt', ()=>{
    whoami('fake token',false).should(respond=>{
      expect(respond.status).to.equal(401);
    });
    const creds = randomCreds();
    register(creds);
    fudgeVerification(creds.username);
    login(creds).should(loginRes=>{
      const jwt = loginRes.body.token;
      whoami(jwt).should(respond=>{
        cy.log('hello');
        cy.log(respond.body.username);
        expect(respond.body.username);//.to.equal(creds.username);
      });
    });
  });
});

describe('Register Teacher', () => {
  it('Visits the initial project page', () => {
    cy.visit('/')
    cy.url().should('match', /\/landing$/);
    cy.get('img[class="landingImg"]').should('be.visible');;
    cy.get('div[class="nav"]').should('be.visible');;
    cy.get('label').click();
    cy.get('button[class="btn navbarBtn"]').contains('English').click();
    cy.get('button[class="btn teacherRegisterBtn"]').contains('I am a teacher').click();
    const username = randomString();
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="email"]').type(`${randomString(10)}@${randomString(10)}.${randomString(5,false)}`);
    cy.get('input[name="password"]').then(pword=>{
      const password = randomString();
      [...pword].forEach(p=>{
        cy.wrap(p).type(password);
      })
    })
    cy.get('button').contains('Register').click();
    fudgeVerification(username);
    cy.get('[data-cy="sign-in"]').click();
    cy.get('button i.fa-user').click();
  })
})
