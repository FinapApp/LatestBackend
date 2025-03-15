import fs from 'fs'
export function deleteOldFiles(directory = 'uploads', maxAgeInMinutes = 5) {
    try {
        const currentTime = new Date()
        const maxAge = maxAgeInMinutes * 60 * 1000

        const files = fs.readdirSync(directory)
        for (const file of files) {
            const filePath = directory + '/' + file
            const stats = fs.statSync(filePath)
            const fileAge = currentTime.getTime() - stats.birthtime.getTime()

            if (fileAge > maxAge) {
                fs.unlinkSync(filePath)
                console.log(`Deleted: ${filePath}`)
            }
        }
    } catch (err) {
        console.error(err)
    }
}