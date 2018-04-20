var express = require('express')
var app = express();
var mongoose = require('mongoose');
const bodyParser = require('body-parser');
var path = require('path');
app.use(express.static(__dirname + '/public/dist'));
// configure body-parser to read JSON
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
var dbURI = 'mongodb://localhost/authors'
mongoose.connect(dbURI);

var AuthorSchema = new mongoose.Schema({
    name: {type: String, minlength: 3}
})


mongoose.model('Author', AuthorSchema);
var Author = mongoose.model('Author')

app.post('/authors', (req, res)=>{
    var newAuthor = new Author({name: req.body.name});
    newAuthor.save((err)=>{
        if(err){
            res.json(err)
        }else{
            res.json(newAuthor)
        }
    })
})

app.get('/authors', (req, res)=>{
    Author.find({}, (err, foundAuthors)=>{
        if(err){
            res.json(err)
        }else{
            res.json(foundAuthors);
        }
    })
})
app.get('/authors/:id', (req, res)=>{
    Author.findOne({_id: req.params.id}, (err, foundAuthor)=>{
        if(err){
            res.json(err)
        }else{
            res.json(foundAuthor);
        }
    })
})

app.put('/authors/:id', (req,res)=>{
    Author.findOne({_id: req.params.id}, (err, foundAuthor)=>{
        if(err){
            res.json(err)
        }else {
            foundAuthor.name = req.body.name;
            foundAuthor.save((err)=>{
                if(err){
                    res.json(err);
                }else {
                    res.json(foundAuthor);
                }
            })
        }
    })
})

app.delete('/authors/:id', (req, res)=>{
    Author.remove({_id: req.params.id}, (err)=>{
        res.json({message: 'Author Deleted'})
    })
})
// app.get('/transactions/:')
app.all("*", (req, res, next) => {
    res.sendFile(path.resolve("./public/dist/index.html"))
});


app.listen(8000, () => {
    console.log("listening on port 8000");
});
