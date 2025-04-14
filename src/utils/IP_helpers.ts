export async function fetchIpGeolocation(ip: string | undefined) {
    try {
        const apiKey = process.env.IP_GEOLOCATOR_KEY!
        const params = new URLSearchParams({ apiKey, ip: ip || '' })
        const res = await fetch(`https://api.ipgeolocation.io/ipgeo?${params}`)
        if (!res.ok) {
            return 
        }
        const json = await res.json()
        return json
    } catch (error) {
        console.log(error)
    }
}