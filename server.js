// server.js
require('dotenv').config(); // Loads environment variables from .env (for local testing)
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const app = express();
const port = process.env.PORT || 3000;

// Initialize Supabase client using environment variables
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

app.get('/widget-settings', async (req, res) => {
  try {
    const storeId = req.query.storeId;
    if (!storeId) {
      return res.status(400).json({ error: 'Missing storeId parameter' });
    }

    // Fetch settings from Supabase table "store_settings"
    const { data, error } = await supabase
      .from('store_settings')
      .select('*')
      .eq('store_id', storeId)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Settings not found for this storeId' });
    }

    // Return the relevant settings
    res.json({
      botName: data.bot_name || 'Bot',
      chatColor: data.chat_color || '#007bff'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
