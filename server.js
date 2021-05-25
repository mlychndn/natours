const dotenv = require('dotenv');
const { server } = require('http');
const mongoose = require('mongoose');

process.on('uncaughtException', err =>{
    console.log('UNCAUGHT EXCEPTION! 🥤  Shutting down .....');
    console.log(err.name, err.message);
    
        process.exit(1);
    
});

dotenv.config({ path: './config.env' });
const app = require('./app');

mongoose.connect(process.env.DB.replace('<password>',process.env.DBPASSWORD),
{
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useCreateIndex: true,
    useFindAndModify: false
}
).then((conn)=>{
    // console.log(conn);
    console.log('Connected successfully to mongodb database')
}).catch( err=> {
    console.log(err);
})




// console.log(process.env);

const port = process.env.PORT || 8000;
 app.listen(port, ()=>{
     console.log(`App is running on port ${port}....`);
 });

 process.on('unhandledRejection', err => {
     console.log(err.name, err.message);
     console.log('UNHANDELED REJECTION! 🌟 Shutting down')
     server.close(()=>{
         process.exit(1);
     });
 });

 