const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'Missing tournament id' });

    if (req.method === 'GET') {
        const { data, error } = await supabase
            .from('tournaments')
            .select('id, state, updated_at')
            .eq('id', id)
            .single();

        if (error || !data) return res.status(404).json({ error: 'Tournament not found' });
        res.json({ id: data.id, state: data.state, updatedAt: data.updated_at });

    } else if (req.method === 'PUT') {
        const { state } = req.body || {};
        if (!state) return res.status(400).json({ error: 'Missing state' });

        const { error } = await supabase
            .from('tournaments')
            .update({ state, updated_at: new Date().toISOString() })
            .eq('id', id);

        if (error) {
            console.error('Supabase update error:', error);
            return res.status(500).json({ error: error.message });
        }
        res.json({ success: true });

    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};
