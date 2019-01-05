let env = process.env.NODE_ENV || 'dev';
console.log(env);
//process.env.MongoDB_URI = 'mongodb://phil:phil123@ds145194.mlab.com:45194/fishnik';

if(env=="dev"||env=="test"){
    let config = require('./config-env.json');
    let configEnv = config[env];
    Object.keys(configEnv).forEach((key)=>{
        process.env[key] = configEnv[key];
    })
}