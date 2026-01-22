-- Seed Knowledge Nodes
INSERT INTO public.knowledge_nodes (id, title, description, subject, grade_level, icon_type, position) VALUES
-- Primary Match
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Làm quen với số', 'Nhận biết các số từ 1 đến 10', 'math', 'primary-1', 'star', '{"x": 100, "y": 100}'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Phép cộng cơ bản', 'Cộng trong phạm vi 10', 'math', 'primary-1', 'calculator', '{"x": 300, "y": 100}'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Phép trừ cơ bản', 'Trừ trong phạm vi 10', 'math', 'primary-1', 'calculator', '{"x": 300, "y": 300}'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Hình học phẳng', 'Nhận biết hình vuông, hình tròn', 'math', 'primary-1', 'function', '{"x": 500, "y": 200}')
ON CONFLICT (id) DO NOTHING;

-- Edges
INSERT INTO public.knowledge_edges (from_node_id, to_node_id, type) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'prerequisite'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'prerequisite'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'related')
ON CONFLICT (from_node_id, to_node_id) DO NOTHING;
