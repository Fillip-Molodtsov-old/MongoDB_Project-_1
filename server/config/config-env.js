let env = process.env.NODE_ENV || 'dev';
console.log(env);
let mongodb_uri;
switch(env){
    case "dev":
        process.env.PORT = 3000;
        mongodb_uri = 'mongodb://localhost:27017/MongooseApp';
        break;
    case "test":
        process.env.PORT = 3000;
        mongodb_uri = 'mongodb://localhost:27017/MongooseAppTest';
        break;
    default:
        mongodb_uri = 'mongodb://phil:phil123@ds145194.mlab.com:45194/fishnik';
        break;
}

module.exports={mongodb_uri};