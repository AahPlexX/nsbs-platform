-- Seed course metadata (content stored in filesystem)

INSERT INTO courses (slug, title, description, price_cents, question_pool_size, exam_duration_minutes, passing_score, max_attempts, cooldown_days)
VALUES 
  (
    'change-management-specialist',
    'Change Management Specialist (CMS)',
    'Master the art and science of organizational change management with proven frameworks, stakeholder engagement strategies, and implementation best practices.',
    29900,
    180,
    120,
    80,
    3,
    7
  ),
  (
    'kaizen-theory-practitioner',
    'Kaizen Theory & Practice Practitioner (KTP)',
    'Learn continuous improvement methodologies, lean principles, and kaizen implementation strategies for operational excellence and sustainable growth.',
    27900,
    180,
    120,
    80,
    3,
    7
  ),
  (
    'corporate-finance-specialist',
    'Corporate Finance Specialist (CFS)',
    'Develop expertise in financial analysis, capital budgeting, valuation techniques, and strategic financial decision-making for modern corporations.',
    34900,
    180,
    120,
    80,
    3,
    7
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  price_cents = EXCLUDED.price_cents,
  question_pool_size = EXCLUDED.question_pool_size,
  exam_duration_minutes = EXCLUDED.exam_duration_minutes,
  passing_score = EXCLUDED.passing_score,
  max_attempts = EXCLUDED.max_attempts,
  cooldown_days = EXCLUDED.cooldown_days,
  updated_at = NOW();
