var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const options = {
    useNewUrlParser: true,
    autoIndex: false, // Don't build indexes
    reconnectTries: 100, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0
  };
mongoose.connect('mongodb://admin:xxxx@xxx/tododb', options).then(
  ()=>{
    console.log("connected to mongoDB");
  },
  (err)=>{
    console.log("err",err);
  }
);

var todoSchema = new mongoose.Schema({
  item: String
});
var Todo = mongoose.model('Todo', todoSchema);
// var itemOne = Todo({item: 'learning'}).save(function(err){
//   if(err) {
//     console.log(err);
//     throw err;
//   }
//   console.log('item saved');
// })
// var data = [{item:'get milk'},{item:'walk dog'},{item:'learning nodejs' }];
var urlencodedParser = bodyParser.urlencoded({extended:false});

module.exports = function(app){
  app.get('/todo', function(req, res){
    //get data from mongodb and pass it to view
    Todo.find({},function(err,data){
      if(err) throw err;
      res.render('todo',{todos: data});
    });

  });
  app.post('/todo', urlencodedParser, function(req, res){
// get data from the view and add it to the mongodb
      var newTodo = Todo(req.body).save(function(err,data){
        if(err) throw err;
        res.json(data);
      });

  });
  app.delete('/todo/:item',function(req,res){
    //delete the requested item from mongodb
    //console.log("1:", req.params.item.replace(/\-/g,' ').trim());
    Todo.find({item: req.params.item.replace(/\-/g,' ').trim()}).deleteOne(function(err,data){
      if(err) throw err;
      res.json(data);
    })

  });
};
