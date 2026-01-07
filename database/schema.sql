-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Course metadata ONLY (content stored in filesystem)
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL,
  stripe_price_id TEXT,
  question_pool_size INTEGER DEFAULT 150,
  exam_duration_minutes INTEGER DEFAULT 120,
  passing_score INTEGER DEFAULT 80,
  max_attempts INTEGER DEFAULT 3,
  cooldown_days INTEGER DEFAULT 7,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Course purchases
CREATE TABLE course_purchases (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_checkout_session_id TEXT,
  PRIMARY KEY (user_id, course_id)
);

-- Lesson completion tracking (references filesystem chapters by slug)
CREATE TABLE lesson_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  chapter_slug TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, course_id, chapter_slug)
);

-- Exam attempts
CREATE TABLE exam_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  attempt_number INTEGER NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  submitted_at TIMESTAMP WITH TIME ZONE,
  score INTEGER CHECK (score >= 0 AND score <= 100),
  passed BOOLEAN GENERATED ALWAYS AS (score >= 80) STORED,
  answers JSONB NOT NULL DEFAULT '{}',
  questions_shown JSONB NOT NULL,
  time_remaining_seconds INTEGER,
  UNIQUE (user_id, course_id, attempt_number),
  CHECK (submitted_at IS NULL OR submitted_at >= started_at)
);

-- Certificates
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  exam_attempt_id UUID REFERENCES exam_attempts(id) ON DELETE CASCADE,
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verification_code TEXT UNIQUE NOT NULL,
  UNIQUE (user_id, course_id)
);

-- User bookmarks (references filesystem chapters by slug)
CREATE TABLE user_bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  chapter_slug TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, course_id, chapter_slug)
);

-- Indexes
CREATE INDEX idx_exam_attempts_user_course ON exam_attempts(user_id, course_id);
CREATE INDEX idx_certificates_verification ON certificates(verification_code);
CREATE INDEX idx_purchases_user ON course_purchases(user_id);
CREATE INDEX idx_lesson_completions_user_course ON lesson_completions(user_id, course_id);
CREATE INDEX idx_bookmarks_user_course ON user_bookmarks(user_id, course_id);

-- Row Level Security
ALTER TABLE course_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_bookmarks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Purchases
CREATE POLICY "Users can view own purchases" ON course_purchases
  FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for Lesson Completions
CREATE POLICY "Users can view own completions" ON lesson_completions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own completions" ON lesson_completions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own completions" ON lesson_completions
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Exam Attempts
CREATE POLICY "Users can view own attempts" ON exam_attempts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own attempts" ON exam_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own attempts" ON exam_attempts
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for Certificates
CREATE POLICY "Users can view own certificates" ON certificates
  FOR SELECT USING (auth.uid() = user_id);

-- Public certificate verification
CREATE POLICY "Public can verify certificates" ON certificates
  FOR SELECT USING (true);

-- RLS Policies for Bookmarks
CREATE POLICY "Users can manage own bookmarks" ON user_bookmarks
  FOR ALL USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
