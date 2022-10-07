const express = require('express');
const app = express();
const dictionaryRoutes = express.Router();

dictionaryRoutes.route('/getHTML/:searchTerm').get(async (req, res) => {
    const searchURL = "https://www.teanglann.ie/en/eid/" + req.params.searchTerm;
    const response = await fetch(searchURL);
    const html = await response.text();
    console.log('DOC', html);
    res.status(200).json({"htmlContent" : html});
});

module.exports = dictionaryRoutes;