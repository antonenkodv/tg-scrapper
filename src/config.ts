import {env} from 'process'

require('dotenv').config()
console.log(process.env)

export default ({
    TELEGRAM: {
        API_ID: parseInt(env.API_ID),
        API_HASH: env.API_HASH
    }
})
