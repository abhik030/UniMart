-- UniMart Database Schema Extensions for Category-Specific Attributes

-- Create a table for product categories with their specific attribute requirements
CREATE TABLE ProductCategories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    requires_subcategory BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert the main product categories
INSERT INTO ProductCategories (category_name, display_name, requires_subcategory) VALUES
    ('textbooks', 'Textbooks', TRUE),
    ('electronics', 'Electronics', TRUE),
    ('furniture', 'Furniture', TRUE),
    ('apparel', 'Apparel', TRUE),
    ('tickets', 'Tickets', FALSE),
    ('transportation', 'Transportation', TRUE),
    ('housing', 'Housing', TRUE),
    ('free_items', 'Free Items', FALSE);

-- Create a table for subcategories
CREATE TABLE ProductSubcategories (
    subcategory_id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    subcategory_name VARCHAR(100) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES ProductCategories(category_id) ON DELETE CASCADE,
    UNIQUE KEY (category_id, subcategory_name)
);

-- Insert subcategories for Textbooks
INSERT INTO ProductSubcategories (category_id, subcategory_name, display_name) VALUES
    (1, 'physical', 'Physical Book'),
    (1, 'ebook', 'E-Book');

-- Insert subcategories for Electronics
INSERT INTO ProductSubcategories (category_id, subcategory_name, display_name) VALUES
    (2, 'phones', 'Phones & Accessories'),
    (2, 'laptops', 'Laptops & Computers'),
    (2, 'headphones', 'Headphones & Audio'),
    (2, 'tablets', 'Tablets & E-readers'),
    (2, 'gaming', 'Gaming Equipment'),
    (2, 'cameras', 'Cameras & Photography'),
    (2, 'tvs', 'TVs & Monitors'),
    (2, 'other_electronics', 'Other Electronics');

-- Insert subcategories for Furniture
INSERT INTO ProductSubcategories (category_id, subcategory_name, display_name) VALUES
    (3, 'chairs', 'Chairs'),
    (3, 'desks', 'Desks'),
    (3, 'tables', 'Tables'),
    (3, 'sofas', 'Sofas & Couches'),
    (3, 'beds', 'Beds & Mattresses'),
    (3, 'shelves', 'Shelves & Storage'),
    (3, 'dining', 'Dining Furniture'),
    (3, 'other_furniture', 'Other Furniture');

-- Insert subcategories for Apparel
INSERT INTO ProductSubcategories (category_id, subcategory_name, display_name) VALUES
    (4, 'shirts', 'Shirts & Tops'),
    (4, 'pants', 'Pants & Bottoms'),
    (4, 'dresses', 'Dresses & Skirts'),
    (4, 'outerwear', 'Jackets & Outerwear'),
    (4, 'footwear', 'Shoes & Footwear'),
    (4, 'accessories', 'Accessories'),
    (4, 'formal', 'Formal Wear'),
    (4, 'athletic', 'Athletic Wear'),
    (4, 'other_apparel', 'Other Apparel');

-- Insert subcategories for Transportation
INSERT INTO ProductSubcategories (category_id, subcategory_name, display_name) VALUES
    (6, 'bikes', 'Bicycles'),
    (6, 'scooters', 'Scooters'),
    (6, 'skateboards', 'Skateboards'),
    (6, 'skates', 'Skates & Rollerblades'),
    (6, 'car_accessories', 'Car Accessories'),
    (6, 'other_transportation', 'Other Transportation');

-- Insert subcategories for Housing
INSERT INTO ProductSubcategories (category_id, subcategory_name, display_name) VALUES
    (7, 'apartment', 'Apartment'),
    (7, 'house', 'House'),
    (7, 'room', 'Room'),
    (7, 'studio', 'Studio');

-- Create a table for product attributes
CREATE TABLE ProductAttributes (
    attribute_id INT AUTO_INCREMENT PRIMARY KEY,
    attribute_name VARCHAR(100) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    attribute_type ENUM('TEXT', 'NUMBER', 'SELECT', 'MULTISELECT', 'BOOLEAN') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert common product attributes
INSERT INTO ProductAttributes (attribute_name, display_name, attribute_type) VALUES
    ('brand', 'Brand', 'TEXT'),
    ('model', 'Model', 'TEXT'),
    ('size', 'Size', 'TEXT'),
    ('color', 'Color', 'TEXT'),
    ('gender', 'Gender', 'SELECT'),
    ('age_group', 'Age Group', 'SELECT'),
    ('format', 'Format', 'SELECT'),
    ('isbn', 'ISBN', 'TEXT'),
    ('course_number', 'Course Number', 'TEXT'),
    ('sublet_period', 'Sublet Period', 'MULTISELECT'),
    ('num_rooms', 'Number of Rooms', 'NUMBER'),
    ('num_bathrooms', 'Number of Bathrooms', 'NUMBER'),
    ('bathroom_type', 'Bathroom Type', 'SELECT'),
    ('utilities_included', 'Utilities Included', 'BOOLEAN'),
    ('utilities_details', 'Utilities Details', 'TEXT');

-- Create a table for category-attribute relationships
CREATE TABLE CategoryAttributes (
    category_attribute_id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    subcategory_id INT NULL, -- NULL means applies to all subcategories
    attribute_id INT NOT NULL,
    is_required BOOLEAN DEFAULT FALSE,
    display_order INT NOT NULL DEFAULT 0,
    FOREIGN KEY (category_id) REFERENCES ProductCategories(category_id) ON DELETE CASCADE,
    FOREIGN KEY (subcategory_id) REFERENCES ProductSubcategories(subcategory_id) ON DELETE CASCADE,
    FOREIGN KEY (attribute_id) REFERENCES ProductAttributes(attribute_id) ON DELETE CASCADE,
    UNIQUE KEY (category_id, subcategory_id, attribute_id)
);

-- Insert category-attribute relationships for Textbooks
INSERT INTO CategoryAttributes (category_id, subcategory_id, attribute_id, is_required, display_order) VALUES
    (1, NULL, 8, TRUE, 1), -- ISBN required for all textbooks
    (1, NULL, 9, FALSE, 2), -- Course number optional for all textbooks
    (1, 1, 7, FALSE, 3); -- Format for physical books only

-- Insert category-attribute relationships for Electronics
INSERT INTO CategoryAttributes (category_id, subcategory_id, attribute_id, is_required, display_order) VALUES
    (2, NULL, 1, TRUE, 1), -- Brand required for all electronics
    (2, NULL, 2, FALSE, 2); -- Model optional for all electronics

-- Insert category-attribute relationships for Apparel
INSERT INTO CategoryAttributes (category_id, subcategory_id, attribute_id, is_required, display_order) VALUES
    (4, NULL, 5, TRUE, 1), -- Gender required for all apparel
    (4, NULL, 3, TRUE, 2), -- Size required for all apparel
    (4, NULL, 4, FALSE, 3), -- Color optional for all apparel
    (4, NULL, 1, FALSE, 4), -- Brand optional for all apparel
    (4, NULL, 6, FALSE, 5); -- Age group optional for all apparel

-- Insert category-attribute relationships for Housing
INSERT INTO CategoryAttributes (category_id, subcategory_id, attribute_id, is_required, display_order) VALUES
    (7, NULL, 10, TRUE, 1), -- Sublet period required for all housing
    (7, NULL, 11, TRUE, 2), -- Number of rooms required for all housing
    (7, NULL, 12, TRUE, 3), -- Number of bathrooms required for all housing
    (7, NULL, 13, TRUE, 4), -- Bathroom type required for all housing
    (7, NULL, 14, TRUE, 5), -- Utilities included required for all housing
    (7, NULL, 15, FALSE, 6); -- Utilities details optional for all housing

-- Create a table for attribute values (for SELECT and MULTISELECT types)
CREATE TABLE AttributeValues (
    value_id INT AUTO_INCREMENT PRIMARY KEY,
    attribute_id INT NOT NULL,
    value_name VARCHAR(100) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    FOREIGN KEY (attribute_id) REFERENCES ProductAttributes(attribute_id) ON DELETE CASCADE,
    UNIQUE KEY (attribute_id, value_name)
);

-- Insert values for Gender attribute
INSERT INTO AttributeValues (attribute_id, value_name, display_name, display_order) VALUES
    (5, 'male', 'Male', 1),
    (5, 'female', 'Female', 2),
    (5, 'unisex', 'Unisex', 3);

-- Insert values for Age Group attribute
INSERT INTO AttributeValues (attribute_id, value_name, display_name, display_order) VALUES
    (6, 'adult', 'Adult', 1),
    (6, 'children', 'Children', 2);

-- Insert values for Format attribute
INSERT INTO AttributeValues (attribute_id, value_name, display_name, display_order) VALUES
    (7, 'hardcover', 'Hardcover', 1),
    (7, 'paperback', 'Paperback', 2),
    (7, 'spiral', 'Spiral-bound', 3),
    (7, 'looseleaf', 'Loose-leaf', 4);

-- Insert values for Sublet Period attribute
INSERT INTO AttributeValues (attribute_id, value_name, display_name, display_order) VALUES
    (10, 'fall', 'Fall Semester', 1),
    (10, 'spring', 'Spring Semester', 2),
    (10, 'summer1', 'Summer 1', 3),
    (10, 'summer2', 'Summer 2', 4),
    (10, 'full_year', 'Full Year', 5);

-- Insert values for Bathroom Type attribute
INSERT INTO AttributeValues (attribute_id, value_name, display_name, display_order) VALUES
    (13, 'private', 'Private', 1),
    (13, 'shared', 'Shared', 2);

-- Create a table to store product attribute values
CREATE TABLE ProductAttributeValues (
    product_attribute_value_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    attribute_id INT NOT NULL,
    text_value TEXT NULL,
    number_value DECIMAL(10,2) NULL,
    boolean_value BOOLEAN NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (attribute_id) REFERENCES ProductAttributes(attribute_id) ON DELETE CASCADE
);

-- Create a table to store product attribute multi-values (for MULTISELECT type)
CREATE TABLE ProductAttributeMultiValues (
    product_attribute_multi_value_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    attribute_id INT NOT NULL,
    value_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (attribute_id) REFERENCES ProductAttributes(attribute_id) ON DELETE CASCADE,
    FOREIGN KEY (value_id) REFERENCES AttributeValues(value_id) ON DELETE CASCADE,
    UNIQUE KEY (product_id, attribute_id, value_id)
);

-- Modify the Products table to include subcategory information
ALTER TABLE Products 
ADD COLUMN subcategory_id INT NULL,
ADD FOREIGN KEY (subcategory_id) REFERENCES ProductSubcategories(subcategory_id) ON DELETE SET NULL;

-- Create indices for performance
CREATE INDEX idx_products_subcategory ON Products(subcategory_id);
CREATE INDEX idx_product_attribute_values_product ON ProductAttributeValues(product_id);
CREATE INDEX idx_product_attribute_values_attribute ON ProductAttributeValues(attribute_id);
CREATE INDEX idx_product_attribute_multi_values_product ON ProductAttributeMultiValues(product_id);
CREATE INDEX idx_product_attribute_multi_values_attribute ON ProductAttributeMultiValues(attribute_id); 