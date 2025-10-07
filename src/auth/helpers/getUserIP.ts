import axios from 'axios';
type Geo = { ip?: string; country?: string; cc?: string }
export async function getUserIP(timeoutMs = 3000): Promise<string> {
    try {
        const res = await axios.get('https://api.myip.com');
        const data = res.data as Geo;
        if (!data || !data.ip) throw new Error('No ip in response');
        return data.ip;
    } catch (err) {
        throw new Error(`Failed to get IP: ${(err as Error).message}`);
    }
}
