export function fudgeVerification(username: string) {
  const url = `localhost:4000/user/fudgeVerification/${username}`;
  return cy.request(url);
}
