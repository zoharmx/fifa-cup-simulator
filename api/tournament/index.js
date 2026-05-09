const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { state = {} } = req.body || {};

    const { data, error } = await supabase
        .from('tournaments')
        .insert({ state })
        .select('id, state, created_at')
        .single();

    if (error) {
        console.error('Supabase insert error:', error);
        return res.status(500).json({ error: error.message });
    }

    res.status(201).json({ id: data.id, state: data.state });
};
