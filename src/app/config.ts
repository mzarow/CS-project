import * as config from 'nconf'

export default () => {
    const env = process.env.NODE_ENV || 'dev'
    const file =  `${__dirname}/../../config/${env}.json`;
    
    config.file(env, { 'file': file });
}