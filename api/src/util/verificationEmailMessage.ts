module.exports =  function verificationEmailMessage(language: 'ga'|'en', username: string, link: string) {
  switch(language) {
    case 'en': 
      return `Dear ${username},\n\
      Please use this link to verify your email address for An Scéalaí:\n\n\
      <a href="${link}">verify</a>\n\n\
      Once you have verified your email you will be able to log in again.\n\
      \n\
      Kindly,\n\
      \n\
      The An Scéalaí team`;
    case 'ga':
    default:
      return `A ${username}, a chara,\n\
      Úsáid an nasc seo a leanas chun do sheoladh rphoist a dheimhniú, le do thoil:\n\n\
      <a href="${link}">deimhniú</a>\n\n\
      A luaithe is a dheimhníonn tú do sheoladh rphoist beidh tú in ann logáil isteach arís.\n\
      \n\
      Le gach dea-ghuí,\n\
      \n\
      Foireann An Scéalaí`
  }
}
