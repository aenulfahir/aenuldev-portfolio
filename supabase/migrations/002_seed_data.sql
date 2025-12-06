-- =============================================
-- SEED DATA FOR PORTFOLIO WEBSITE
-- =============================================

-- 1. Insert Profile (Hero Data)
INSERT INTO profiles (id, greeting, name, titles, description, github_url, linkedin_url, instagram_url)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Hello, World!',
    'Muhammad Aenul Fahir',
    ARRAY['Full Stack Developer', 'Mobile Developer', 'UI/UX Enthusiast'],
    'Building futuristic, high-performance web and mobile applications with modern technologies. Let''s turn your vision into reality.',
    'https://github.com',
    'https://linkedin.com',
    'https://instagram.com'
);

-- 2. Insert About Data
INSERT INTO about (id, profile_id, summary, location, phone, email)
VALUES (
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'A game enthusiast with a passion for programming, especially in web development and mobile applications. With an educational background of Bachelor''s Degree in Informatics Engineering Dipa University Makassar (GPA 3.76) and a strong interest in mobile technology.',
    'Makassar, Indonesia',
    '+62 887 4498 5916',
    'aenulfahir03@gmail.com'
);

-- 3. Insert Skills
INSERT INTO skills (about_id, name, order_index) VALUES
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'JavaScript', 1),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Java', 2),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Kotlin', 3),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'React JS', 4),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Redux', 5),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'React Native', 6),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'HTML & CSS', 7),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Node JS', 8),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'MongoDB', 9),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Firebase', 10),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Rest API', 11),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'TypeScript', 12),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'PostgreSQL', 13),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Supabase', 14);

-- 4. Insert Experiences
INSERT INTO experiences (about_id, role, company, period, description, order_index) VALUES
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Mobile Apps Developer Intern', 'Bank Mandiri x Rakamin Academy', 'Nov 2023 – Dec 2023', 'Studied Android Environment, Lifecycle, UI/UX, and Security. Built an Android-based news application.', 1),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Staff IT Internship', 'South Sulawesi High Prosecutor''s Office', 'Sep 2022 – Nov 2022', 'Managed hardware/software tasks, organized case files, and developed an employee attendance application.', 2);

-- 5. Insert Education
INSERT INTO education (about_id, degree, school, period, description, order_index) VALUES
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'FGA Bootcamp Web Development', 'Hacktiv8', 'Aug 2024 – Oct 2024', 'React & Web Development Program.', 1),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Bachelor of Informatics Engineering', 'Universitas Dipa Makassar', '2019 – 2023', 'GPA: 3.76/4.00', 2);

-- 6. Insert Certifications
INSERT INTO certifications (about_id, name, issuer, date, order_index) VALUES
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Mobile Developer Course (React Native)', 'Progate', 'July 2024', 1),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Junior Network Administrator', 'BNSP', 'Oct 2023 - Oct 2026', 2),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Junior Mobile Programmer', 'BNSP', 'Oct 2023 - Oct 2026', 3),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Getting Started with Programming in Kotlin', 'Dicoding Indonesia', 'July 2023 - July 2026', 4);

-- 7. Insert Projects
INSERT INTO projects (id, title, date, description, tech, type, link, order_index) VALUES
('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'County and News App', 'Oct 2024', 'A mobile application providing country information and news updates.', ARRAY['React Native', 'API Integration'], 'mobile', NULL, 1),
('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'Movie App', 'Oct 2024', 'An application for browsing movies and viewing details.', ARRAY['React Native', 'TMDB API'], 'mobile', NULL, 2),
('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'Hilmi App', 'Nov 2023', 'An Android-based news application.', ARRAY['Android', 'Kotlin', 'News API'], 'mobile', NULL, 3),
('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'Employee Attendance App', 'Nov 2022', 'Attendance management system for government office.', ARRAY['Web', 'PHP', 'MySQL'], 'web', NULL, 4),
('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', 'Portfolio Website', 'Dec 2024', 'Personal portfolio website built with React and Supabase.', ARRAY['React', 'TypeScript', 'Supabase', 'Vite'], 'web', NULL, 5);

-- 8. Insert Pricing Plans
INSERT INTO pricing_plans (id, title, price, features, popular, color, icon_type, order_index) VALUES
('d1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'AI Chatbot (n8n)', '200 Ribu', ARRAY['Custom Knowledge Base', 'Automated Responses', 'Multi-platform Integration', '24/7 Availability', 'Basic Setup'], FALSE, '#ffbd2e', 'bot', 1),
('d1eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'Web Development', '1.3 Juta', ARRAY['Responsive Design', 'Modern Tech Stack (React/Vite)', 'SEO Optimization', 'Fast Performance', '1 Month Support'], TRUE, '#00b8ff', 'globe', 2),
('d1eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'Android Apps', '1.5 Juta', ARRAY['Native Performance', 'User-Friendly UI/UX', 'Play Store Submission', 'API Integration', '2 Months Support'], FALSE, '#00ff9d', 'zap', 3);

-- 9. Insert Blog Posts
INSERT INTO blog_posts (id, title, excerpt, content, date, author, category) VALUES
('e1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 
'The Future of Web Development with AI', 
'How Artificial Intelligence is reshaping the way we build and interact with web applications.',
'Artificial Intelligence is revolutionizing web development at an unprecedented pace. From code generation to intelligent user interfaces, AI is becoming an integral part of the developer''s toolkit.

### The Rise of AI-Powered Coding Assistants
Tools like GitHub Copilot and Cursor are changing how we write code. They suggest snippets, refactor functions, and even write entire modules based on natural language prompts. This shift allows developers to focus more on architecture and logic rather than syntax.

### Personalized User Experiences
AI algorithms can analyze user behavior in real-time to deliver highly personalized content and layouts. Imagine a website that adapts its interface based on the user''s preferences and browsing history.

### Conclusion
The future is bright for developers who embrace these tools. AI won''t replace developers; it will empower them to build faster, smarter, and better applications.',
'Dec 12, 2024', 'Aenul Fahir', 'Technology'),

('e1eebc99-9c0b-4ef8-bb6d-6bb9bd380a02',
'Mastering React Native Animation',
'A comprehensive guide to creating smooth and engaging animations in mobile apps.',
'Animations are crucial for a great mobile user experience. In React Native, we have powerful tools like Reanimated and the built-in Animated API.

### Why Animation Matters
Smooth transitions and micro-interactions make an app feel polished and responsive. They guide the user''s attention and provide feedback for actions.

### Using Reanimated 3
Reanimated 3 brings shared values and worklets, making it easier than ever to run animations on the UI thread for 60fps performance.

```javascript
const offset = useSharedValue(0);

const animatedStyles = useAnimatedStyle(() => {
  return {
    transform: [{ translateX: offset.value }],
  };
});
```

Start small, experiment with timing, and always prioritize performance.',
'Nov 28, 2024', 'Aenul Fahir', 'Mobile Dev'),

('e1eebc99-9c0b-4ef8-bb6d-6bb9bd380a03',
'Why TypeScript is Essential in 2025',
'Exploring the benefits of static typing and how it improves code quality and maintainability.',
'JavaScript is flexible, but that flexibility comes at a cost. TypeScript adds a layer of safety that is indispensable for large-scale applications.

### Catching Errors Early
The biggest advantage of TypeScript is catching errors at compile-time rather than runtime. This saves countless hours of debugging.

### Better Developer Experience
IntelliSense, auto-completion, and refactoring tools work significantly better with TypeScript. It serves as self-documenting code, making it easier for teams to collaborate.

If you haven''t switched yet, 2025 is the year to do it.',
'Nov 15, 2024', 'Aenul Fahir', 'Coding');

-- 10. Insert Blog Comments
INSERT INTO blog_comments (blog_post_id, user_name, text, date) VALUES
('e1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'DevGuy99', 'Great article! AI is definitely the future.', 'Dec 12, 2024'),
('e1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'SarahTech', 'I use Copilot daily, it saves so much time.', 'Dec 13, 2024'),
('e1eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'JS_Lover', 'I still prefer vanilla JS for small projects.', 'Nov 16, 2024');

-- 11. Insert Sample Contact Messages
INSERT INTO contact_messages (name, email, message, is_read) VALUES
('John Doe', 'john@example.com', 'Hi, I''m interested in your web development services. Can we discuss a project?', FALSE),
('Sarah Smith', 'sarah@company.com', 'Great portfolio! Would love to collaborate on a mobile app project.', TRUE),
('Tech Startup', 'hello@startup.io', 'We need an AI chatbot for our customer service. What''s your availability?', FALSE);
