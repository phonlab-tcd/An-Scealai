
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
  cy.request(`localhost:4000/user/fudgeVerification/${username}`);
}


describe('Virtual Registration (api only)', () => {
  it('Register a student', () => {
    const username = randomString();
    const password = randomString();
    const email = `${randomString(10)}@${randomString(10)}.${randomString(5,false)}`;
    const role = 'STUDENT';
    cy.request(
      'POST',
      `localhost:4000/user/register`,
      { username, password, email });
  });
});

describe('Register Teacher', () => {
  it('Register as a teacher, sign in, log out, sign in', () => {
    const username = randomString();
    const password = randomString();
    const email = `${randomString(10)}@${randomString(10)}.${randomString(5,false)}`;
    cy.visit('/')
    cy.url().should('match', /\/landing$/);
    cy.get('img[class="landingImg"]').should('be.visible');;
    cy.get('div[class="nav"]').should('be.visible');;
    cy.get('label').click();
    cy.get('button[class="btn navbarBtn"]').contains('English').click();
    cy.get('button[class="btn teacherRegisterBtn"]').contains('I am a teacher').click();
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').then(pword=>{
      [...pword].forEach(p=>{
        cy.wrap(p).type(password);
      })
    })
    cy.get('button').contains('Register').click();
    fudgeVerification(username);
    cy.get('button').contains('Sign in').click();
    cy.get('button i.fa-user').click();
    cy.get('button').contains('Sign out').click();
    cy.get('.loginTextContainer a')
      .contains('Sign in').click();
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('button.loginBtn').click();
  })
})
