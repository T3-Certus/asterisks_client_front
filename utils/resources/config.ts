// import * as dotenv from 'dotenv'

// dotenv.config()

const config = {
  ACCESS_TOKEN_KEY: process.env.ACCESS_TOKEN_PRIVATE_KEY!,
  REFRESH_TOKEN_KEY: process.env.REFRESH_TOKEN_PRIVATE_KEY!,
}

export {config}