-- UniMart Database Schema

CREATE TABLE Users (
    email VARCHAR(255) PRIMARY KEY CHECK (email LIKE '%.edu'),
    username VARCHAR(50) UNIQUE NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    university_id INT,
    trusted_device_token VARCHAR(255),
    is_banned BOOLEAN DEFAULT FALSE,
    banned_by VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (university_id) REFERENCES Universities(university_id) ON DELETE SET NULL,
    FOREIGN KEY (banned_by) REFERENCES AdminUsers(email) ON DELETE SET NULL
);


CREATE INDEX idx_users_university_id ON Users(university_id);
CREATE INDEX idx_users_username ON Users(username);

CREATE TABLE IF NOT EXISTS Universities (
    university_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    domain VARCHAR(100) UNIQUE NOT NULL  -- Example: "northeastern.edu"
);

CREATE TABLE UserProfiles (
    user_email VARCHAR(255) PRIMARY KEY,
    profile_image_url VARCHAR(500) NULL,
    bio TEXT NULL,
    phone_number VARCHAR(20) NULL,
    FOREIGN KEY (user_email) REFERENCES Users(email) ON DELETE CASCADE
);


CREATE TABLE VerificationCodes (
    code_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    verification_code VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (email) REFERENCES Users(email) ON DELETE CASCADE
);

CREATE TABLE Products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    seller_email VARCHAR(255) NOT NULL,
    university_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) CHECK (price >= 0) NOT NULL,
    category VARCHAR(100) NOT NULL,
    item_condition ENUM('New', 'Like New', 'Good', 'Fair', 'Poor') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Available', 'Pending', 'Sold') DEFAULT 'Available',
    FOREIGN KEY (seller_email) REFERENCES Users(email) ON DELETE CASCADE,
    FOREIGN KEY (university_id) REFERENCES Universities(university_id) ON DELETE CASCADE
);

CREATE INDEX idx_products_seller_email ON Products(seller_email);
CREATE INDEX idx_products_category ON Products(category);
CREATE INDEX idx_products_status ON Products(status);

CREATE TABLE ProductImages (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE
);

CREATE TABLE Orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    buyer_email VARCHAR(255) NOT NULL,
    seller_email VARCHAR(255) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    order_status ENUM('Pending', 'Completed', 'Canceled', 'Expired', 'Rejected') DEFAULT 'Pending',
    order_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    pickup_deadline DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL 7 DAY),
    seller_rejection_reason VARCHAR(255) NULL,
    buyer_cancellation_reason VARCHAR(255) NULL,
    pickup_confirmed BOOLEAN DEFAULT FALSE,
    CHECK (pickup_deadline > order_date),
    FOREIGN KEY (buyer_email) REFERENCES Users(email) ON DELETE CASCADE,
    FOREIGN KEY (seller_email) REFERENCES Users(email) ON DELETE CASCADE
);

CREATE INDEX idx_orders_buyer_email ON Orders(buyer_email);
CREATE INDEX idx_orders_seller_email ON Orders(seller_email);
CREATE INDEX idx_orders_status ON Orders(order_status);

CREATE TABLE Order_Products (
    order_product_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT CHECK (quantity > 0) DEFAULT 1,
    price_at_purchase DECIMAL(10,2) NOT NULL,  -- Store price at the time of purchase
    FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE
);

CREATE INDEX idx_order_products_order_id ON Order_Products(order_id);
CREATE INDEX idx_order_products_product_id ON Order_Products(product_id);


CREATE TABLE Payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    buyer_email VARCHAR(255) NOT NULL,
    seller_email VARCHAR(255) NOT NULL,
    amount_paid DECIMAL(10,2) CHECK (amount_paid >= 0) NOT NULL,
    payment_status ENUM('Pending', 'Completed', 'Failed', 'Refunded', 'Seller Rejected') DEFAULT 'Pending',
    payment_method ENUM('Cash', 'Venmo', 'Zelle', 'Apple Pay') NOT NULL,
    payment_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    seller_rejection_reason VARCHAR(255) NULL,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (buyer_email) REFERENCES Users(email) ON DELETE CASCADE,
    FOREIGN KEY (seller_email) REFERENCES Users(email) ON DELETE CASCADE
);

CREATE INDEX idx_payments_order_id ON Payments(order_id);
CREATE INDEX idx_payments_status ON Payments(payment_status);

CREATE TABLE Messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    sender_email VARCHAR(255) NOT NULL,
    receiver_email VARCHAR(255) NOT NULL,
    message_text TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (sender_email) REFERENCES Users(email) ON DELETE CASCADE,
    FOREIGN KEY (receiver_email) REFERENCES Users(email) ON DELETE CASCADE
);
CREATE INDEX idx_messages_sender ON Messages(sender_email);
CREATE INDEX idx_messages_receiver ON Messages(receiver_email);

CREATE TABLE ReportedUsers (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    reporter_email VARCHAR(255) NOT NULL,
    reported_email VARCHAR(255) NOT NULL,
    reason TEXT NOT NULL,
    report_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    reviewed_status BOOLEAN DEFAULT FALSE,
    action_taken ENUM('Warning', 'Banned') NULL,
    ban_expiration_date DATETIME NULL,
    FOREIGN KEY (reporter_email) REFERENCES Users(email) ON DELETE CASCADE,
    FOREIGN KEY (reported_email) REFERENCES Users(email) ON DELETE CASCADE
);

CREATE TABLE EmailsSent (
    email_id INT AUTO_INCREMENT PRIMARY KEY,
    recipient_email VARCHAR(255) NOT NULL,
    type ENUM('OrderUpdate', 'Message', 'ReportUpdate', 'Reminder') NOT NULL,
    subject VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recipient_email) REFERENCES Users(email) ON DELETE CASCADE
);

CREATE TABLE Reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    seller_email VARCHAR(255) NOT NULL,
    buyer_email VARCHAR(255) NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5) NOT NULL,
    comment TEXT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_email) REFERENCES Users(email) ON DELETE CASCADE,
    FOREIGN KEY (buyer_email) REFERENCES Users(email) ON DELETE CASCADE
);

CREATE INDEX idx_reviews_seller ON Reviews(seller_email);

CREATE TABLE UserFavorites (
    favorite_id INT AUTO_INCREMENT PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_email) REFERENCES Users(email) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE
);

CREATE INDEX idx_favorites_user ON UserFavorites(user_email);

CREATE TABLE ReviewReports (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    review_id INT NOT NULL,
    reporter_email VARCHAR(255) NOT NULL,
    reason TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Pending', 'Reviewed', 'Dismissed') DEFAULT 'Pending',
    FOREIGN KEY (review_id) REFERENCES Reviews(review_id) ON DELETE CASCADE,
    FOREIGN KEY (reporter_email) REFERENCES Users(email) ON DELETE CASCADE
);

CREATE TABLE ReviewResponses (
    response_id INT AUTO_INCREMENT PRIMARY KEY,
    review_id INT NOT NULL,
    seller_email VARCHAR(255) NOT NULL,
    response_text TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (review_id) REFERENCES Reviews(review_id) ON DELETE CASCADE,
    FOREIGN KEY (seller_email) REFERENCES Users(email) ON DELETE CASCADE
);

CREATE TABLE AdminUsers (
    email VARCHAR(255) PRIMARY KEY,
    role ENUM('SuperAdmin', 'Moderator') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (email) REFERENCES Users(email) ON DELETE CASCADE
);

CREATE TABLE ReportedListings (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    reporter_email VARCHAR(255) NOT NULL,
    reason TEXT NOT NULL,
    status ENUM('Pending', 'Reviewed', 'Resolved') DEFAULT 'Pending',
    handled_by VARCHAR(255) NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (reporter_email) REFERENCES Users(email) ON DELETE CASCADE,
    FOREIGN KEY (handled_by) REFERENCES AdminUsers(email) ON DELETE SET NULL
);