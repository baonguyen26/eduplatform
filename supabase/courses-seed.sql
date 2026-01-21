-- =====================================================
-- SEED DATA FOR COURSES (Sample Content)
-- =====================================================

-- Insert Sample Courses
INSERT INTO public.courses (id, title, description, thumbnail_url, subject, grade_level, published) VALUES
(
    '11111111-1111-1111-1111-111111111111',
    'Toán học Lớp 3 - Cơ bản',
    'Khóa học toán cơ bản dành cho học sinh lớp 3. Bao gồm phép cộng, trừ, nhân, chia và hình học đơn giản.',
    'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=800',
    'math',
    'primary-3',
    TRUE
),
(
    '22222222-2222-2222-2222-222222222222',
    'Khoa học Tự nhiên - Khám phá Vũ trụ',
    'Hành trình khám phá vũ trụ, hệ mặt trời và các hành tinh. Dành cho học sinh tiểu học.',
    'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=800',
    'science',
    'primary-4',
    TRUE
),
(
    '33333333-3333-3333-3333-333333333333',
    'Tiếng Anh Giao tiếp Cơ bản',
    'Học tiếng Anh qua các tình huống hàng ngày. Phù hợp cho học sinh bắt đầu.',
    'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800',
    'english',
    'primary-5',
    TRUE
);

-- Insert Modules for Course 1 (Math)
INSERT INTO public.modules (id, course_id, title, description, order_index) VALUES
(
    'a1111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    'Chương 1: Phép cộng và trừ',
    'Học cách cộng và trừ các số trong phạm vi 1000',
    1
),
(
    'a2222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'Chương 2: Phép nhân và chia',
    'Bảng nhân và chia cơ bản',
    2
);

-- Insert Lessons for Math Course
INSERT INTO public.lessons (id, course_id, module_id, title, content, video_url, duration, order_index) VALUES
-- Module 1 Lessons
(
    'b1111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    'a1111111-1111-1111-1111-111111111111',
    'Bài 1: Cộng hai số có 2 chữ số',
    '# Cộng hai số có 2 chữ số\n\nTrong bài này, chúng ta sẽ học cách cộng hai số có 2 chữ số.\n\n## Ví dụ:\n- 23 + 45 = 68\n- 56 + 32 = 88',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    300,
    1
),
(
    'b2222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'a1111111-1111-1111-1111-111111111111',
    'Bài 2: Trừ hai số có 2 chữ số',
    '# Trừ hai số có 2 chữ số\n\nBài học về phép trừ cơ bản.\n\n## Ví dụ:\n- 68 - 23 = 45\n- 88 - 56 = 32',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    240,
    2
),
-- Module 2 Lessons
(
    'b3333333-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    'a2222222-2222-2222-2222-222222222222',
    'Bài 3: Bảng nhân 2',
    '# Bảng nhân 2\n\nHọc thuộc bảng nhân 2.\n\n2 x 1 = 2\n2 x 2 = 4\n2 x 3 = 6\n...',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    360,
    3
),
(
    'b4444444-4444-4444-4444-444444444444',
    '11111111-1111-1111-1111-111111111111',
    'a2222222-2222-2222-2222-222222222222',
    'Bài 4: Bảng nhân 3',
    '# Bảng nhân 3\n\nHọc thuộc bảng nhân 3.\n\n3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9\n...',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    360,
    4
);

-- Insert Lessons for Science Course (No modules)
INSERT INTO public.lessons (id, course_id, module_id, title, content, video_url, duration, order_index) VALUES
(
    'c1111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    NULL,
    'Bài 1: Hệ Mặt Trời của chúng ta',
    '# Hệ Mặt Trời\n\nHệ Mặt Trời bao gồm Mặt Trời và 8 hành tinh quay quanh nó.',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    420,
    1
),
(
    'c2222222-2222-2222-2222-222222222222',
    '22222222-2222-2222-2222-222222222222',
    NULL,
    'Bài 2: Trái Đất - Hành tinh xanh',
    '# Trái Đất\n\nTrái Đất là hành tinh duy nhất có sự sống.',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    380,
    2
),
(
    'c3333333-3333-3333-3333-333333333333',
    '22222222-2222-2222-2222-222222222222',
    NULL,
    'Bài 3: Sao Hỏa - Hành tinh đỏ',
    '# Sao Hỏa\n\nSao Hỏa có màu đỏ vì có nhiều sắt.',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    340,
    3
);

-- Insert Lessons for English Course
INSERT INTO public.lessons (id, course_id, module_id, title, content, video_url, duration, order_index) VALUES
(
    'd1111111-1111-1111-1111-111111111111',
    '33333333-3333-3333-3333-333333333333',
    NULL,
    'Lesson 1: Greetings and Introductions',
    '# Greetings\n\nLearn how to say hello and introduce yourself.\n\n- Hello!\n- My name is...\n- Nice to meet you!',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    300,
    1
),
(
    'd2222222-2222-2222-2222-222222222222',
    '33333333-3333-3333-3333-333333333333',
    NULL,
    'Lesson 2: Numbers 1-20',
    '# Numbers\n\nLearn to count from 1 to 20 in English.',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    280,
    2
);
