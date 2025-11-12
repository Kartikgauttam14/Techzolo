-- Seed data for Tech Zolo database
-- Sample data for testing and development

-- Insert sample admin user (password: admin123)
INSERT INTO users (
    email, 
    password_hash, 
    full_name, 
    company, 
    phone, 
    bio, 
    website, 
    location, 
    is_admin,
    is_verified
) VALUES (
    'admin@techzolo.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.PJ/...',
    'Tech Zolo Admin',
    'Tech Zolo',
    '+1-555-0123',
    'Administrator of Tech Zolo platform',
    'https://techzolo.com',
    'San Francisco, CA',
    TRUE,
    TRUE
) ON CONFLICT (email) DO NOTHING;

-- Insert sample regular users
INSERT INTO users (
    email, 
    password_hash, 
    full_name, 
    company, 
    phone, 
    bio, 
    location, 
    is_verified
) VALUES 
(
    'john.doe@example.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.PJ/...',
    'John Doe',
    'Startup Inc',
    '+1-555-0124',
    'Entrepreneur looking to build the next big thing',
    'New York, NY',
    TRUE
),
(
    'jane.smith@example.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.PJ/...',
    'Jane Smith',
    'Design Studio',
    '+1-555-0125',
    'Creative designer passionate about user experience',
    'Los Angeles, CA',
    TRUE
) ON CONFLICT (email) DO NOTHING;

-- Insert sample contact submissions
INSERT INTO contact_submissions (
    name, 
    email, 
    phone, 
    subject, 
    message, 
    status, 
    priority
) VALUES 
(
    'Michael Johnson',
    'michael@example.com',
    '+1-555-0126',
    'Website Development Inquiry',
    'Hi, I need a professional website for my consulting business. Can you help?',
    'new',
    'medium'
),
(
    'Sarah Wilson',
    'sarah@example.com',
    '+1-555-0127',
    'E-commerce Platform',
    'Looking to build an online store for my fashion brand. What are your rates?',
    'in_progress',
    'high'
) ON CONFLICT (id) DO NOTHING;

-- Insert sample user preferences
INSERT INTO user_preferences (
    user_id, 
    theme, 
    language, 
    notifications_email, 
    marketing_emails
) VALUES 
(1, 'dark', 'en', TRUE, TRUE),
(2, 'light', 'en', TRUE, FALSE),
(3, 'auto', 'en', TRUE, TRUE)
ON CONFLICT (user_id) DO NOTHING;

-- Insert sample projects
INSERT INTO user_projects (
    user_id, 
    title, 
    description, 
    project_type, 
    status, 
    budget_range, 
    timeline, 
    requirements
) VALUES 
(
    2,
    'Company Website Redesign',
    'Complete redesign of our company website with modern UI/UX',
    'website',
    'in_progress',
    '$5,000 - $10,000',
    '6-8 weeks',
    'Responsive design, SEO optimization, CMS integration'
),
(
    3,
    'Mobile App Development',
    'iOS and Android app for our design portfolio',
    'app',
    'planning',
    '$15,000 - $25,000',
    '12-16 weeks',
    'Native apps, portfolio showcase, client management'
)
ON CONFLICT (id) DO NOTHING;
