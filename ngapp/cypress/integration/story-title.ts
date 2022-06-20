declare var cy;

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

function newUser(): {username:string;email:string;password:string} {
  const username = randomString();
  const email = `${randomString()}@${randomString()}.${randomString()}`;
  const password = randomString();
  const creds = {username,email,password};
  cy.request('POST',`localhost:4000/user/register/`,creds);
  fudgeVerification(username);
  cy.request('POST',`localhost:4000/user/login/`,creds)
    .then(res=>{
      localStorage.setItem('an-scealai',res.body.token);
    });
  return creds;
}

describe('story title', () => {
  it('Visits the initial project page', () => {
    const creds = newUser();
    cy.visit('/landing');
    cy.get('[data-cy="sign-in"]').click();
    cy.get('[name="username"]').type(creds.username);
    cy.get('[name="password"]').type(creds.password);
    cy.get('[data-cy=sign-in]').click();
    cy.get('[data-cy=create-story]').click();
    const title1 = randomString();
    cy.get('input[data-cy=title]').type(title1);
    cy.get('button[data-cy=create-story]').click();
  })
})
