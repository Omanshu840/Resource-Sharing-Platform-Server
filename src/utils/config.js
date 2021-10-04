require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI
const JWT_SECRET = process.env.JWT_SECRET;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY
const AWS_STORAGE_BUCKET_NAME = process.env.AWS_STORAGE_BUCKET_NAME
const AWS_FILE_URL = process.env.AWS_FILE_URL

module.exports = {
	MONGODB_URI,
	PORT,
	JWT_SECRET,
	AWS_ACCESS_KEY_ID,
	AWS_SECRET_ACCESS_KEY,
	AWS_STORAGE_BUCKET_NAME,
	AWS_FILE_URL
}