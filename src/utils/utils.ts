import crypto from 'crypto'

export function getHash(password: string) {
    const salt = process.env.PASSWORD_SALT!
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    return hash.toString('hex')
}
