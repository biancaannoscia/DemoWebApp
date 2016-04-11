var express = require('express');
var bodyParser = require('body-parser')
var mongoose = require('mongoose');

var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.use(bodyParser());

mongoose.connect(process.env.MONGOLAB_URI);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

var kittySchema = mongoose.Schema({
    name: String
});

// NOTE: methods must be added to the schema before compiling it with mongoose.model()
kittySchema.methods.speak = function () {
  var greeting = this.name
    ? "Meow name is " + this.name
    : "I don't have a name";
  console.log(greeting);
}

var Kitten = mongoose.model('Kitten', kittySchema);

/* var silence = new Kitten({ name: 'Silence' });
console.log(silence.name); // 'Silence' 


 var fluffy = new Kitten({ name: 'fluffy' });
fluffy.speak(); // "Meow name is fluffy"

fluffy.save(function (err, fluffy) {
  if (err) return console.error(err);
  fluffy.speak();
});*/


/* Kitten.find(function (err, kittens) {
  if (err) return console.error(err);
  console.log(kittens);
})


app.get('/', function(request, response) { 
	Kitten.find({ name: /^fluff/ }, function(err,kittens){
		response.render('pages/index', {kittens:kittens});
});
  
}); */


var getAndRenderPostedMessages = function(request, response) {
  Kitten.find(function (err, kittens) {
    if (err) return console.error(err);
    var descendingMessages = kittens.reverse();
    response.render('pages/index', {kittens: descendingMessages});
  })
}

app.get('/', function(request, response) {
  getAndRenderPostedMessages(request, response);
});

app.post('/', function (request, response) {
  var newKitten = new Kitten({ name: request.body.kitten});
  newKitten.save(function (err, newKitten) {
    if (err) return console.error(err);
    getAndRenderPostedMessages(request, response);
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

	//function is whatever comes afterwards
