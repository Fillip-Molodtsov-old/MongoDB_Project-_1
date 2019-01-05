let env = process.env.NODE_ENV || 'dev';
console.log(env);

if(env=="dev"||env=="test"){
    let config = require('./config-env.json');
    let configEnv = config[env];
    Object.keys(configEnv).forEach((key)=>{
        process.env[key] = configEnv[key];
    })
}