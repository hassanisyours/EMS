import 'dotenv/config'
import connectDB from './src/config/db.js'
import userModel from './src/models/UserModel.js'
import bcrypt from 'bcryptjs'

const temporaryPassword = 'admin123'

async function registerAdmin() {
    try {
        const ADMIN_EMAIL = process.env.ADMIN_EMAIL

        if (!ADMIN_EMAIL) {
            console.error('Missing ADMIN_EMAIL env variable')
            process.exit(1)
        }

        await connectDB()

        const existingAdmin = await userModel.findOne({ email: ADMIN_EMAIL })

        if (existingAdmin) {
            console.log('User already exists as role:', existingAdmin.role)
            process.exit(0)
        }

        const hashPass = await bcrypt.hash(temporaryPassword, 10)

        const admin = await userModel.create({
            email: ADMIN_EMAIL,
            password: hashPass,
            role: 'ADMIN'
        })

        console.log('Admin user created')
        console.log('\nEmail:', admin.email)
        console.log('Temporary password:', temporaryPassword)
        console.log('\nChange the password after login.')

        process.exit(0)

    } catch (error) {
        console.error(error)
        console.error('Seed failed')
        process.exit(1)
    }
}

registerAdmin()