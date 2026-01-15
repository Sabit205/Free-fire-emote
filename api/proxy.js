export default async function handler(req, res) {
    const { target } = req.query;

    if (!target) {
        return res.status(400).json({ error: 'Missing target URL' });
    }

    try {
        // Perform the request to the insecure (HTTP) server from the backend
        const response = await fetch(target);

        // We don't strictly need the body for the emote functionality (fire and forget),
        // but returning the status is good practice.
        res.status(response.status).send(response.statusText);
    } catch (error) {
        console.error('Proxy Error:', error);
        res.status(500).json({ error: 'Failed to fetch target URL' });
    }
}
