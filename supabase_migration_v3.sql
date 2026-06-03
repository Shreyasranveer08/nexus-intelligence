CREATE TABLE IF NOT EXISTS pending_llm_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    competitor_id UUID REFERENCES competitors(id) ON DELETE CASCADE,
    tracked_url_id UUID REFERENCES tracked_urls(id) ON DELETE CASCADE,
    prompt_type TEXT NOT NULL, -- 'monitor' or 'report'
    payload JSONB NOT NULL,    -- Store all contextual info needed for retry
    retry_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Update scrape_jobs to track pending AI status
ALTER TABLE scrape_jobs ADD COLUMN IF NOT EXISTS pending_llm BOOLEAN DEFAULT false;

-- Add RLS policy for pending_llm_jobs
ALTER TABLE pending_llm_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own pending_llm_jobs"
ON pending_llm_jobs FOR ALL
USING (user_id = auth.uid());
