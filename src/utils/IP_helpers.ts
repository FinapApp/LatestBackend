export async function fetchIpGeolocation(ip: string | undefined) {
    try {
        const apiKey = process.env.IP_GEOLOCATOR_KEY!;
        const url = `https://api.ipgeolocation.io/v2/ipgeo?apiKey=${apiKey}&ip=${ip}`;
        const res = await fetch(url)
        const text = await res.text();
        if (!res.ok) {
            throw new Error(`Fetch failed with status: ${res.status} - ${res.statusText}`);
        }
        const json = JSON.parse(text);
        return json.location;
    } catch (error) {
        console.error("Error fetching geolocation:", error);
    }
}

