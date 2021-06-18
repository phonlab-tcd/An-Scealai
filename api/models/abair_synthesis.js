

// With choice of dialect and generation type
function synthesiseStory(story) {
  let dialectCode;
  if(story.dialect === 'connemara') dialectCode = 'ga_CM';
  if(story.dialect === 'donegal') dialectCode = 'ga_GD';
  if(story.dialect === 'kerry') dialectCode = 'ga_MU';

  // create a form with the story text, dialect choice, html, and speed
  let form = {
    Input: story.text,
    Locale: dialectCode,
    Format: 'html',
    Speed: '1',
  };

  // turn form into a url query string
  let formData = querystring.stringify(form);
  let contentLength = formData.length;

  return new Promise((resolve, reject) => {
    // make a request to abair passing in the form data
    request({
      headers: {
        'Host' : 'www.abair.tcd.ie',
        'Content-Length': contentLength,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      uri: 'https://www.abair.tcd.ie/webreader/synthesis',
      body: formData,
      method: 'POST'
    }, function (err, resp, body) {
      if(err) res.send(err);
      if(body) {
        // audioContainer is chunk of text made up of paragraphs
        let audioContainer = parse(body).querySelectorAll('.audio_paragraph');
        let paragraphs = [];
        let urls = [];
        // loop through every paragraph and fill array of sentences
        for(let p of audioContainer) {
          let sentences = [];
          for(let s of p.childNodes) {
            // push the sentences
            // s.rawTagName <--> s.tagName if synthesis text not appearing
            if(s.rawTagName === 'span') {
              sentences.push(s.toString());
            } 
            // push the audio ids for the sentences
            // s.rawTagName <--> s.tagName if synthesis text not appearing
            else if(s.rawTagName === 'audio') {
              urls.push(s.id);
            }
          }
          paragraphs.push(sentences);
        }
        resolve({html : paragraphs, audio : urls });
      } else {
        reject();
      }
    });
  });
}


// Legacy version
function synthesiseStory(story) {
  let dialectCode;
  if(story.dialect === 'connemara') dialectCode = 'ga_CM';
  if(story.dialect === 'donegal') dialectCode = 'ga_GD';
  if(story.dialect === 'kerry') dialectCode = 'ga_MU';

  // create a form with the story text, dialect choice, html, and speed
  let form = {
    Input: story.text,
    Locale: dialectCode,
    Format: 'html',
    Speed: '1',
  };

  // turn form into a url query string
  let formData = querystring.stringify(form);
  let contentLength = formData.length;

  return new Promise((resolve, reject) => {
    // make a request to abair passing in the form data
    request({
      headers: {
        'Host' : 'www.abair.tcd.ie',
        'Content-Length': contentLength,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      uri: 'https://www.abair.tcd.ie/webreader/synthesis',
      body: formData,
      method: 'POST'
    }, function (err, resp, body) {
      if(err) res.send(err);
      if(body) {
        // audioContainer is chunk of text made up of paragraphs
        let audioContainer = parse(body).querySelectorAll('.audio_paragraph');
        let paragraphs = [];
        let urls = [];
        // loop through every paragraph and fill array of sentences
        for(let p of audioContainer) {
          let sentences = [];
          for(let s of p.childNodes) {
            // push the sentences
            // s.rawTagName <--> s.tagName if synthesis text not appearing
            if(s.rawTagName === 'span') {
              sentences.push(s.toString());
            } 
            // push the audio ids for the sentences
            // s.rawTagName <--> s.tagName if synthesis text not appearing
            else if(s.rawTagName === 'audio') {
              urls.push(s.id);
            }
          }
          paragraphs.push(sentences);
        }
        resolve({html : paragraphs, audio : urls });
      } else {
        reject();
      }
    });
  });
}
