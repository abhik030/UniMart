# Test Data that is inserted into the DB

-- Insert Universities
INSERT INTO Universities (name, domain) VALUES
('Northeastern University', 'northeastern.edu'),
('Boston University', 'bu.edu'),
('Harvard University', 'harvard.edu'),
('MIT', 'mit.edu'),
('Stanford University', 'stanford.edu');

-- Insert Users
INSERT INTO Users (email, username, is_verified, university_id, trusted_device_token, is_banned) VALUES
('john.doe@northeastern.edu', 'jdoe123', TRUE, 1, 'token123ne', FALSE),
('jane.smith@bu.edu', 'jsmith456', TRUE, 2, 'token456bu', FALSE),
('mike.wilson@harvard.edu', 'mwilson789', TRUE, 3, 'token789harvard', FALSE),
('sarah.johnson@mit.edu', 'sjohnson101', FALSE, 4, 'token101mit', FALSE),
('alex.thompson@stanford.edu', 'athompson202', TRUE, 5, 'token202stanford', FALSE);

-- Insert AdminUsers
INSERT INTO AdminUsers (email, role) VALUES
('john.doe@northeastern.edu', 'SuperAdmin'),
('jane.smith@bu.edu', 'Moderator'),
('mike.wilson@harvard.edu', 'Moderator'),
('sarah.johnson@mit.edu', 'Moderator'),
('alex.thompson@stanford.edu', 'SuperAdmin');

-- Insert UserProfiles
INSERT INTO UserProfiles (user_email, profile_image_url, bio, phone_number) VALUES
('john.doe@northeastern.edu', 'https://example.com/profiles/john.jpg', 'Computer Science student at Northeastern', '617-555-1234'),
('jane.smith@bu.edu', 'https://example.com/profiles/jane.jpg', 'Biology major at BU', '617-555-2345'),
('mike.wilson@harvard.edu', 'https://example.com/profiles/mike.jpg', 'Economics student at Harvard', '617-555-3456'),
('sarah.johnson@mit.edu', 'https://example.com/profiles/sarah.jpg', 'Engineering student at MIT', '617-555-4567'),
('alex.thompson@stanford.edu', 'https://example.com/profiles/alex.jpg', 'Computer Science major at Stanford', '650-555-5678');

-- Insert VerificationCodes
INSERT INTO VerificationCodes (email, verification_code, expires_at, is_used) VALUES
('john.doe@northeastern.edu', '123456', DATE_ADD(NOW(), INTERVAL 1 DAY), TRUE),
('jane.smith@bu.edu', '234567', DATE_ADD(NOW(), INTERVAL 1 DAY), TRUE),
('mike.wilson@harvard.edu', '345678', DATE_ADD(NOW(), INTERVAL 1 DAY), TRUE),
('sarah.johnson@mit.edu', '456789', DATE_ADD(NOW(), INTERVAL 1 DAY), FALSE),
('alex.thompson@stanford.edu', '567890', DATE_ADD(NOW(), INTERVAL 1 DAY), TRUE);

-- Insert Products
INSERT INTO Products (seller_email, university_id, title, description, price, category, item_condition, status) VALUES
('john.doe@northeastern.edu', 1, 'Calculus Textbook', 'Calculus: Early Transcendentals, 8th Edition', 45.99, 'Books', 'Like New', 'Available'),
('jane.smith@bu.edu', 2, 'Desk Lamp', 'Adjustable LED desk lamp, barely used', 15.00, 'Furniture', 'Good', 'Available'),
('mike.wilson@harvard.edu', 3, 'Scientific Calculator', 'TI-84 Plus, perfect for statistics classes', 35.50, 'Electronics', 'Good', 'Pending'),
('sarah.johnson@mit.edu', 4, 'Engineering Drawing Set', 'Complete engineering drawing kit', 25.00, 'School Supplies', 'Like New', 'Available'),
('alex.thompson@stanford.edu', 5, 'Computer Monitor', '24" Full HD monitor, 2 years old', 80.00, 'Electronics', 'Good', 'Sold');

-- Insert ProductImages
INSERT INTO ProductImages (product_id, image_url) VALUES
(1, 'https://example.com/products/calculus_book1.jpg'),
(1, 'https://example.com/products/calculus_book2.jpg'),
(2, 'https://example.com/products/desk_lamp1.jpg'),
(3, 'https://example.com/products/calculator1.jpg'),
(4, 'https://example.com/products/drawing_set1.jpg');

-- Insert Orders
INSERT INTO Orders (buyer_email, seller_email, total_price, order_status, pickup_deadline, pickup_confirmed) VALUES
('jane.smith@bu.edu', 'john.doe@northeastern.edu', 45.99, 'Pending', DATE_ADD(NOW(), INTERVAL 6 DAY), FALSE),
('mike.wilson@harvard.edu', 'jane.smith@bu.edu', 15.00, 'Completed', DATE_ADD(NOW(), INTERVAL 5 DAY), TRUE),
('sarah.johnson@mit.edu', 'mike.wilson@harvard.edu', 35.50, 'Pending', DATE_ADD(NOW(), INTERVAL 7 DAY), FALSE),
('alex.thompson@stanford.edu', 'sarah.johnson@mit.edu', 25.00, 'Canceled', DATE_ADD(NOW(), INTERVAL 4 DAY), FALSE),
('john.doe@northeastern.edu', 'alex.thompson@stanford.edu', 80.00, 'Completed', DATE_ADD(NOW(), INTERVAL 3 DAY), TRUE);

-- Insert Order_Products
INSERT INTO Order_Products (order_id, product_id, quantity, price_at_purchase) VALUES
(1, 1, 1, 45.99),
(2, 2, 1, 15.00),
(3, 3, 1, 35.50),
(4, 4, 1, 25.00),
(5, 5, 1, 80.00);

-- Insert Payments
INSERT INTO Payments (order_id, buyer_email, seller_email, amount_paid, payment_status, payment_method) VALUES
(1, 'jane.smith@bu.edu', 'john.doe@northeastern.edu', 45.99, 'Pending', 'Venmo'),
(2, 'mike.wilson@harvard.edu', 'jane.smith@bu.edu', 15.00, 'Completed', 'Cash'),
(3, 'sarah.johnson@mit.edu', 'mike.wilson@harvard.edu', 35.50, 'Pending', 'Zelle'),
(4, 'alex.thompson@stanford.edu', 'sarah.johnson@mit.edu', 25.00, 'Failed', 'Apple Pay'),
(5, 'john.doe@northeastern.edu', 'alex.thompson@stanford.edu', 80.00, 'Completed', 'Venmo');

-- Insert Messages
INSERT INTO Messages (sender_email, receiver_email, message_text) VALUES
('jane.smith@bu.edu', 'john.doe@northeastern.edu', 'Is the calculus textbook still available?'),
('john.doe@northeastern.edu', 'jane.smith@bu.edu', 'Yes, it is! When would you like to meet?'),
('mike.wilson@harvard.edu', 'jane.smith@bu.edu', 'Can I pick up the desk lamp tomorrow?'),
('sarah.johnson@mit.edu', 'mike.wilson@harvard.edu', 'Does the calculator come with batteries?'),
('alex.thompson@stanford.edu', 'sarah.johnson@mit.edu', 'I\'m interested in the drawing set. Can you send more pictures?');

-- Insert ReportedUsers
INSERT INTO ReportedUsers (reporter_email, reported_email, reason, reviewed_status, action_taken) VALUES
('jane.smith@bu.edu', 'mike.wilson@harvard.edu', 'User never showed up for the exchange', FALSE, NULL),
('mike.wilson@harvard.edu', 'sarah.johnson@mit.edu', 'Sent inappropriate messages', TRUE, 'Warning'),
('john.doe@northeastern.edu', 'alex.thompson@stanford.edu', 'Listed counterfeit items', FALSE, NULL),
('alex.thompson@stanford.edu', 'jane.smith@bu.edu', 'Harassment', TRUE, 'Warning'),
('sarah.johnson@mit.edu', 'john.doe@northeastern.edu', 'Item description was misleading', FALSE, NULL);

-- Insert EmailsSent
INSERT INTO EmailsSent (recipient_email, type, subject, content) VALUES
('john.doe@northeastern.edu', 'OrderUpdate', 'Your item has been purchased', 'Jane Smith has purchased your Calculus Textbook.'),
('jane.smith@bu.edu', 'Message', 'New message from John Doe', 'You have a new message from John regarding the Calculus Textbook.'),
('mike.wilson@harvard.edu', 'ReportUpdate', 'Your report has been reviewed', 'We have reviewed your report against Sarah Johnson.'),
('sarah.johnson@mit.edu', 'Reminder', 'Verify your email', 'Please verify your email address to access all features.'),
('alex.thompson@stanford.edu', 'OrderUpdate', 'Order completed', 'Your order with John Doe has been marked as completed.');

-- Insert Reviews
INSERT INTO Reviews (seller_email, buyer_email, rating, comment) VALUES
('john.doe@northeastern.edu', 'jane.smith@bu.edu', 5, 'Great seller, textbook was in perfect condition!'),
('jane.smith@bu.edu', 'mike.wilson@harvard.edu', 4, 'Nice lamp, exactly as described.'),
('mike.wilson@harvard.edu', 'sarah.johnson@mit.edu', 3, 'Calculator works but had some scratches not mentioned.'),
('sarah.johnson@mit.edu', 'alex.thompson@stanford.edu', 5, 'Perfect transaction, highly recommend!'),
('alex.thompson@stanford.edu', 'john.doe@northeastern.edu', 4, 'Monitor was in good condition as described.');

-- Insert UserFavorites
INSERT INTO UserFavorites (user_email, product_id) VALUES
('jane.smith@bu.edu', 1),
('mike.wilson@harvard.edu', 2),
('sarah.johnson@mit.edu', 3),
('alex.thompson@stanford.edu', 4),
('john.doe@northeastern.edu', 5);

-- Insert ReviewReports
INSERT INTO ReviewReports (review_id, reporter_email, reason, status) VALUES
(1, 'mike.wilson@harvard.edu', 'Fake review - they never purchased this item', 'Pending'),
(2, 'sarah.johnson@mit.edu', 'Inappropriate language in review', 'Reviewed'),
(3, 'alex.thompson@stanford.edu', 'Unfair rating - item was as described', 'Dismissed'),
(4, 'john.doe@northeastern.edu', 'Review contains false information', 'Pending'),
(5, 'jane.smith@bu.edu', 'Reviewer is harassing in comments', 'Pending');

-- Insert ReviewResponses
INSERT INTO ReviewResponses (review_id, seller_email, response_text) VALUES
(1, 'john.doe@northeastern.edu', 'Thank you for your kind review!'),
(2, 'jane.smith@bu.edu', 'Glad you liked the lamp!'),
(3, 'mike.wilson@harvard.edu', 'I apologize for the scratches, I should have mentioned them.'),
(4, 'sarah.johnson@mit.edu', 'Thanks! It was a pleasure doing business with you!'),
(5, 'alex.thompson@stanford.edu', 'Happy you\'re satisfied with the monitor!');

-- Insert ReportedListings
INSERT INTO ReportedListings (product_id, reporter_email, reason, status, handled_by) VALUES
(1, 'mike.wilson@harvard.edu', 'Price is too high for a used textbook', 'Pending', NULL),
(2, 'sarah.johnson@mit.edu', 'Item is actually broken', 'Reviewed', 'jane.smith@bu.edu'),
(3, 'alex.thompson@stanford.edu', 'Prohibited item on campus', 'Resolved', 'mike.wilson@harvard.edu'),
(4, 'john.doe@northeastern.edu', 'Misleading description', 'Pending', NULL),
(5, 'jane.smith@bu.edu', 'Counterfeit product', 'Reviewed', 'john.doe@northeastern.edu');
