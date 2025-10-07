// ?ip=196.137.100.237&accessKey=99571de1-7bf3-42a1-956a-48844ad1082d

import axios from "axios";

export async function extractUserInfoFromIP(ip: string) {
    try {
        const res = await axios.get(`https://apiip.net/api/check?ip=${ip}&accessKey=${process.env.GEO_SERVICE_API_KEY || "99571de1-7bf3-42a1-956a-48844ad1082d"}`)
        return res.data
    } catch (error) {
        console.log(error);
    }
}