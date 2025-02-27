

# Testing Scripts:

-- =============================================
-- Test Script 1: Basic Table Counts
-- Purpose: Verify all tables have the expected number of records
-- =============================================

SELECT 'Universities' AS table_name, COUNT(*) AS record_count FROM Universities
UNION ALL
SELECT 'Users', COUNT(*) FROM Users
UNION ALL
SELECT 'AdminUsers', COUNT(*) FROM AdminUsers
UNION ALL
SELECT 'UserProfiles', COUNT(*) FROM UserProfiles
UNION ALL
SELECT 'VerificationCodes', COUNT(*) FROM VerificationCodes
UNION ALL
SELECT 'Products', COUNT(*) FROM Products
UNION ALL
SELECT 'ProductImages', COUNT(*) FROM ProductImages
UNION ALL
SELECT 'Orders', COUNT(*) FROM Orders
UNION ALL
SELECT 'Order_Products', COUNT(*) FROM Order_Products
UNION ALL
SELECT 'Payments', COUNT(*) FROM Payments
UNION ALL
SELECT 'Messages', COUNT(*) FROM Messages
UNION ALL
SELECT 'ReportedUsers', COUNT(*) FROM ReportedUsers
UNION ALL
SELECT 'EmailsSent', COUNT(*) FROM EmailsSent
UNION ALL
SELECT 'Reviews', COUNT(*) FROM Reviews
UNION ALL
SELECT 'UserFavorites', COUNT(*) FROM UserFavorites
UNION ALL
SELECT 'ReviewReports', COUNT(*) FROM ReviewReports
UNION ALL
SELECT 'ReviewResponses', COUNT(*) FROM ReviewResponses
UNION ALL
SELECT 'ReportedListings', COUNT(*) FROM ReportedListings;

-- =============================================
-- Test Script 2: Test Users and Universities Relationship
-- Purpose: Verify that users are associated with valid universities
-- =============================================

SELECT u.email, u.username, uni.name AS university_name, uni.domain
FROM Users u
JOIN Universities uni ON u.university_id = uni.university_id
ORDER BY uni.name, u.username;

-- Verify that emails match university domains
SELECT u.email, u.username, uni.domain
FROM Users u
JOIN Universities uni ON u.university_id = uni.university_id
WHERE u.email NOT LIKE CONCAT('%@', uni.domain)
ORDER BY u.email;


-- =============================================
-- Test Script 3: Product Listings with Seller Information
-- Purpose: Test multi-table joins and show complete product information
-- =============================================

SELECT
    p.product_id,
    p.title,
    p.price,
    p.category,
    p.item_condition,
    p.status,
    u.username AS seller_username,
    u.email AS seller_email,
    uni.name AS university,
    COUNT(pi.image_id) AS image_count
FROM Products p
JOIN Users u ON p.seller_email = u.email
JOIN Universities uni ON p.university_id = uni.university_id
LEFT JOIN ProductImages pi ON p.product_id = pi.product_id
GROUP BY p.product_id, p.title, p.price, p.category, p.item_condition, p.status, u.username, u.email, uni.name;

-- =============================================
-- Test Script 4: Order and Payment Status Integrity
-- Purpose: Verify that order and payment statuses are consistent
-- =============================================

SELECT
    o.order_id,
    o.buyer_email,
    o.seller_email,
    o.total_price,
    o.order_status,
    p.payment_status,
    p.payment_method,
    o.pickup_confirmed,
    p.amount_paid
FROM Orders o
JOIN Payments p ON o.order_id = p.order_id
WHERE (o.order_status = 'Completed' AND p.payment_status != 'Completed')
   OR (o.order_status = 'Canceled' AND p.payment_status != 'Failed' AND p.payment_status != 'Refunded')
ORDER BY o.order_date;

-- =============================================
-- Test Script 5: Product Order Detail Report
-- Purpose: Join multiple tables to show complete order information
-- =============================================

SELECT
    o.order_id,
    o.order_date,
    o.order_status,
    buyer.username AS buyer_username,
    seller.username AS seller_username,
    p.product_id,
    p.title AS product_title,
    op.quantity,
    op.price_at_purchase,
    pay.payment_method,
    pay.payment_status
FROM Orders o
JOIN Users buyer ON o.buyer_email = buyer.email
JOIN Users seller ON o.seller_email = seller.email
JOIN Order_Products op ON o.order_id = op.order_id
JOIN Products p ON op.product_id = p.product_id
LEFT JOIN Payments pay ON o.order_id = pay.order_id
ORDER BY o.order_date DESC;

-- =============================================
-- Test Script 6: Test Email Domain Check Constraint
-- Purpose: Verify that CHECK constraint is working properly
-- =============================================

-- This should fail with error because domain is not .edu
INSERT INTO Users (email, username, is_verified, university_id)
VALUES ('test.user@gmail.com', 'testuser', FALSE, 1);


-- This should work
INSERT INTO Users (email, username, is_verified, university_id)
VALUES ('test.user@stanford.edu', 'testuser', FALSE, 5);

-- =============================================
-- Test Script 7: Seller Performance Report
-- Purpose: Aggregate data to show seller performance metrics
-- =============================================

SELECT
    u.username,
    u.email,
    uni.name AS university,
    COUNT(DISTINCT p.product_id) AS products_listed,
    COUNT(DISTINCT CASE WHEN p.status = 'Sold' THEN p.product_id END) AS products_sold,
    COUNT(DISTINCT o.order_id) AS orders_received,
    ROUND(AVG(r.rating), 1) AS avg_rating,
    COUNT(r.review_id) AS review_count
FROM Users u
JOIN Universities uni ON u.university_id = uni.university_id
LEFT JOIN Products p ON u.email = p.seller_email
LEFT JOIN Orders o ON u.email = o.seller_email
LEFT JOIN Reviews r ON u.email = r.seller_email
GROUP BY u.username, u.email, uni.name
ORDER BY avg_rating DESC, products_sold DESC;

-- =============================================
-- Test Script 8: Message History Between Users
-- Purpose: Test self-join to display conversation thread
-- =============================================

SELECT
    m.message_id,
    m.sent_at,
    sender.username AS sender,
    receiver.username AS receiver,
    m.message_text
FROM Messages m
JOIN Users sender ON m.sender_email = sender.email
JOIN Users receiver ON m.receiver_email = receiver.email
WHERE (m.sender_email = 'jane.smith@bu.edu' AND m.receiver_email = 'john.doe@northeastern.edu')
   OR (m.sender_email = 'john.doe@northeastern.edu' AND m.receiver_email = 'jane.smith@bu.edu')
ORDER BY m.sent_at;

-- =============================================
-- Test Script 9: Testing Foreign Key Constraints
-- Purpose: Verify cascading delete functionality
-- =============================================

-- Test setup: Create test data
-- Uncomment to test

INSERT INTO Universities (name, domain) VALUES ('Test University', 'test.edu');
INSERT INTO Users (email, username, is_verified, university_id)
VALUES ('delete.test@test.edu', 'deletetest', FALSE, (SELECT university_id FROM Universities WHERE name = 'Test University'));
INSERT INTO Products (seller_email, university_id, title, description, price, category, item_condition)
VALUES ('delete.test@test.edu', (SELECT university_id FROM Universities WHERE name = 'Test University'), 'Test Product', 'Test Description', 10.00, 'Test Category', 'New');

-- Verify data exists
SELECT 'Before delete' AS status, COUNT(*) AS product_count
FROM Products WHERE seller_email = 'delete.test@test.edu';

-- Delete the user (should cascade delete the product)
DELETE FROM Users WHERE email = 'delete.test@test.edu';

-- Verify product is gone
SELECT 'After delete' AS status, COUNT(*) AS product_count
FROM Products WHERE seller_email = 'delete.test@test.edu';


-- =============================================
-- Test Script 10: Verify Price Constraint
-- Purpose: Test CHECK constraint on price
-- =============================================

-- This should fail because price is negative
INSERT INTO Products (seller_email, university_id, title, description, price, category, item_condition)
VALUES ('john.doe@northeastern.edu', 1, 'Test Negative Price', 'Test Description', -10.00, 'Books', 'New');

-- =============================================
-- Test Script 11: Find Inactive Users
-- Purpose: Locate users without any activity
-- =============================================
-- Only 1 since we added this user
SELECT
    u.email,
    u.username,
    uni.name AS university,
    'No activity' AS status
FROM Users u
JOIN Universities uni ON u.university_id = uni.university_id
WHERE u.email NOT IN (SELECT DISTINCT seller_email FROM Products)
  AND u.email NOT IN (SELECT DISTINCT buyer_email FROM Orders)
  AND u.email NOT IN (SELECT DISTINCT sender_email FROM Messages)
  AND u.email NOT IN (SELECT DISTINCT receiver_email FROM Messages);

-- =============================================
-- Test Script 12: Most Popular Categories
-- Purpose: Group and aggregate data to analyze trends
-- =============================================

SELECT
    p.category,
    COUNT(*) AS product_count,
    ROUND(AVG(p.price), 2) AS avg_price,
    MIN(p.price) AS min_price,
    MAX(p.price) AS max_price,
    COUNT(CASE WHEN p.status = 'Sold' THEN 1 END) AS sold_count,
    ROUND(COUNT(CASE WHEN p.status = 'Sold' THEN 1 END) * 100.0 / COUNT(*), 1) AS sold_percentage
FROM Products p
GROUP BY p.category
ORDER BY product_count DESC;

select * from Products;


-- =============================================
-- Test Script 13: Report Handling Metrics
-- Purpose: Analyze moderation efficiency
-- =============================================

SELECT
    'User Reports'                                                     AS report_type,
    COUNT(*)                                                           AS total_reports,
    SUM(IF(reviewed_status = TRUE, 1, 0))                              AS reviewed_count,
    ROUND(SUM(IF(reviewed_status = TRUE, 1, 0)) * 100.0 / COUNT(*), 1) AS reviewed_percentage,
    COUNT(DISTINCT reporter_email)                                     AS unique_reporters
FROM ReportedUsers
UNION ALL
SELECT
    'Listing Reports' AS report_type,
    COUNT(*) AS total_reports,
    SUM(CASE WHEN status != 'Pending' THEN 1 ELSE 0 END) AS reviewed_count,
    ROUND(SUM(CASE WHEN status != 'Pending' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1) AS reviewed_percentage,
    COUNT(DISTINCT reporter_email) AS unique_reporters
FROM ReportedListings;

-- =============================================
-- Test Script 14: Test Complex Query with Multiple Joins
-- Purpose: Test complex query with recursive joins
-- =============================================

-- Find all products that have been favorited, ordered, and reviewed
SELECT
    p.product_id,
    p.title,
    seller.username AS seller,
    COUNT(DISTINCT uf.user_email) AS favorite_count,
    COUNT(DISTINCT op.order_id) AS order_count,
    ROUND(AVG(r.rating), 1) AS avg_rating
FROM Products p
JOIN Users seller ON p.seller_email = seller.email
LEFT JOIN UserFavorites uf ON p.product_id = uf.product_id
LEFT JOIN Order_Products op ON p.product_id = op.product_id
LEFT JOIN Orders o ON op.order_id = o.order_id
LEFT JOIN Reviews r ON p.seller_email = r.seller_email AND o.buyer_email = r.buyer_email
GROUP BY p.product_id, p.title, seller.username
HAVING COUNT(DISTINCT uf.user_email) > 0
   AND COUNT(DISTINCT op.order_id) > 0
   AND AVG(r.rating) IS NOT NULL
ORDER BY favorite_count DESC, avg_rating DESC;

-- =============================================
-- Test Script 15: Test Subqueries and Complex Filters
-- Purpose: Verify complex query capability
-- =============================================

-- Find sellers who have more than 1 product and an average rating above 3
SELECT
    u.username,
    u.email,
    COUNT(p.product_id) AS product_count,
    (SELECT ROUND(AVG(rating), 1) FROM Reviews WHERE seller_email = u.email) AS avg_rating
FROM Users u
JOIN Products p ON u.email = p.seller_email
GROUP BY u.username, u.email
HAVING COUNT(p.product_id) > 1
   AND (SELECT AVG(rating) FROM Reviews WHERE seller_email = u.email) > 3
ORDER BY avg_rating DESC, product_count DESC;

-- =============================================
-- Test Script 16: University Product Distribution
-- Purpose: Check how products are distributed across universities
-- =============================================

SELECT
    uni.name AS university,
    COUNT(p.product_id) AS total_products,
    COUNT(DISTINCT p.category) AS category_count,
    ROUND(AVG(p.price), 2) AS avg_price,
    SUM(CASE WHEN p.status = 'Available' THEN 1 ELSE 0 END) AS available_count,
    SUM(CASE WHEN p.status = 'Pending' THEN 1 ELSE 0 END) AS pending_count,
    SUM(CASE WHEN p.status = 'Sold' THEN 1 ELSE 0 END) AS sold_count
FROM Universities uni
LEFT JOIN Products p ON uni.university_id = p.university_id
GROUP BY uni.name
ORDER BY total_products DESC;


-- =============================================
-- Test Script 17: Test Views for Common Queries
-- Purpose: Create and test views for frequent queries
-- =============================================

-- Create a view for product listing with all relevant information
CREATE OR REPLACE VIEW ProductListingView AS
SELECT
    p.product_id,
    p.title,
    p.description,
    p.price,
    p.category,
    p.item_condition,
    p.status,
    p.created_at,
    u.username AS seller_username,
    u.email AS seller_email,
    uni.name AS university,
    (SELECT COUNT(*) FROM ProductImages pi WHERE pi.product_id = p.product_id) AS image_count,
    (SELECT AVG(r.rating) FROM Reviews r WHERE r.seller_email = u.email) AS seller_rating
FROM Products p
JOIN Users u ON p.seller_email = u.email
JOIN Universities uni ON p.university_id = uni.university_id;

-- Test the view
SELECT * FROM ProductListingView WHERE price BETWEEN 20 AND 50 ORDER BY created_at DESC LIMIT 10;


-- =============================================
-- Test Script 28: Check Data Integrity Across All Tables
-- Purpose: Verify referential integrity across the database
-- =============================================

-- Check for orphaned records in child tables
SELECT 'Products without valid seller' AS integrity_check, COUNT(*) AS invalid_count
FROM Products p
LEFT JOIN Users u ON p.seller_email = u.email
WHERE u.email IS NULL

UNION ALL

SELECT 'Orders without valid buyer', COUNT(*)
FROM Orders o
LEFT JOIN Users u ON o.buyer_email = u.email
WHERE u.email IS NULL

UNION ALL

SELECT 'Orders without valid seller', COUNT(*)
FROM Orders o
LEFT JOIN Users u ON o.seller_email = u.email
WHERE u.email IS NULL

UNION ALL

SELECT 'Payments without valid order', COUNT(*)
FROM Payments p
LEFT JOIN Orders o ON p.order_id = o.order_id
WHERE o.order_id IS NULL

UNION ALL

SELECT 'Order_Products without valid product', COUNT(*)
FROM Order_Products op
LEFT JOIN Products p ON op.product_id = p.product_id
WHERE p.product_id IS NULL

UNION ALL

SELECT 'UserProfiles without valid user', COUNT(*)
FROM UserProfiles up
LEFT JOIN Users u ON up.user_email = u.email
WHERE u.email IS NULL

UNION ALL

SELECT 'Reviews without valid seller', COUNT(*)
FROM Reviews r
LEFT JOIN Users u ON r.seller_email = u.email
WHERE u.email IS NULL;