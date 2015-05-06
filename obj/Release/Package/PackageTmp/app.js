
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var _ = require('underscore');
var words = require('./api/words');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/about', routes.about);
app.get('/contact', routes.contact);
app.get('/myword/:word', function (req, res) {
    res.render('myword', { title: 'My Word', year: new Date().getFullYear(), message: "Here's your word!" });
});

app.get('/words', function (req, res) {
    var wordList = _.pluck(words, 'name');
    res.send(JSON.stringify(wordList));
});

app.get('/search/:word?', function (req, res) {
    var searchWord = req.params.word;
    console.log(searchWord);

    var results = _.find(words, function (word) {
        return word.name == searchWord;
    });
    
    var resObj = {};
    resObj.title = 'My Word';
    resObj.year = new Date().getFullYear();
    
    // if no word was passed back in search, then grab a random word and return a special message
    if (searchWord == null || searchWord == "") {
        var randomWord = _.sample(words);
        resObj.word = randomWord.name
        resObj.img = randomWord.img;
        resObj.letter = randomWord.letter;
        resObj.msg = "We couldn't find a word that matches your search, but here's a cool word we like!";
    } else if (results) {
        // just bring back a random matching result if there's more than one
        if (_.isArray(results)) {
            results = _.sample(results);
        }
        resObj.word = results.name;
        resObj.img = results.img;
        resObj.letter = results.letter;
        resObj.msg = "";
    } else {
        // if no matching words, grab a word that starts with that letter
        var sameFirstLetter = _.find(words, function (word) {
            return word.name.charAt(0) == searchWord.charAt(0);
        });
        
        if (sameFirstLetter && !_.isArray(sameFirstLetter)) {
            resObj.word = sameFirstLetter.name;
            resObj.msg = "We couldn't find a word that matches your search, but here's a word that starts with the same letter!";
        } else if (_.isArray(sameFirstLetter)) {
            // if there's more than one word returned, grab a random word from that list
            sameFirstLetter = _.sample(sameFirstLetter);
            resObj.word = sameFirstLetter.name;
            resObj.msg = "We couldn't find a word that matches your search, but here's a word that starts with the same letter!";
        } else {
            // if no match then grab a random word and return a special message
            var randomWord = _.sample(words);
            resObj.word = randomWord.name
            resObj.msg = "We couldn't find a word that matches your search, but here's a cool word we like!";
        }
    }
    
    //res.send(JSON.stringify(resObj));
    res.render('myword', resObj);
});

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
