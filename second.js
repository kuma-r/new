const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const async=require('async');
const Joi=require('joi');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger1.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());


 let movies={
         "Horror":[{ "number":1,"name":"annabelle"}],
         "Romantic":[{"number":1,"name":"The fault in our stars"}],
         "Thrillers":[{"number":1,"name":"Joker"}]
    };

async.auto({

    Horror: function(callback) {
        callback(null,movies.Horror);
    },

    Romantic : function(callback) {
        callback(null,movies.Romantic);
    },

    Thrillers : function(callback) {
        callback(null,movies.Thrillers);
    },


    post : function(callback) {
    app.post('/api/genres/:category',(req,res)=>{
    let schema={
        name:Joi.string().min(5).required()
    }
    let result=Joi.validate(req.body,schema);
    if(result.error){
        res.status(400).send(result.error.details[0].message)
        return;
    }
    let new1={number: movies[req.params.category].length +1,name: req.body.name};
    (movies[req.params.category]).push(new1);
    res.send(movies);
    });
    callback(null);
    },

    getbyId : function(callback){
        app.get('/api/genres/:category/:id',(req,res)=>{
        res.send(movies[req.params.category][req.params.id-1]);
    })
    callback(null);
    },

    getbygenres : function(callback){
        app.get('/api/genres/:category',(req,res)=>{
            res.send(movies[req.params.category])
        })
        callback(null);
    },

    put : function(callback){
    app.put('/api/genres/:category/:id',(req,res)=>{
        movies[req.params.category][req.params.id-1].name=req.body.name;
        res.send(movies);
    })
    callback(null);
    },

    delete : function(callback){
        app.delete('/api/genres/:category/:id',(req,res)=>{
            delete movies[req.params.category][req.params.id-1];
            res.send(movies);
        });
        callback(null);
    }

      
}, function(err, results) {
    if(err){
        console.log("error occured");
    }
    if(!err){
        app.get('/api/genres',(req,res)=>{
            res.send(results);
        })
    }}
)

app.listen(4000,()=>console.log('server started'));