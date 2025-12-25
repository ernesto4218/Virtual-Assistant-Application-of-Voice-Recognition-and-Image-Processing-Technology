export const GET_CONFIG_BY_NAME = 'SELECT * FROM system_config WHERE name = ?';
export const INSERT_CONFIG = 'INSERT INTO system_config (name, value) VALUES (?, ?)';
export const UPDATE_CONFIG = 'UPDATE system_config SET value = ?, date_updated = NOW() WHERE name = ?';
export const DELETE_CONFIG = 'DELETE FROM system_config WHERE name = ?';
export const GET_ALL_CONFIGS = 'SELECT * FROM system_config';

// products
export const GET_PRODUCT_BY_NAME = 'SELECT * FROM products WHERE name = ?';
export const INSERT_PRODUCT = 'INSERT INTO products (name, description, usage_info, category, price, stocks_val) VALUES (?, ?, ?, ?, ?, ?)';
export const UPDATE_PRODUCT = 'UPDATE products SET name = ?, description = ?, usage_info = ?, category = ?, price = ?, stocks_val = ? WHERE id = ?';
export const DELETE_PRODUCT = 'DELETE FROM products WHERE id = ?';
export const GET_ALL_PRODUCT = `
  SELECT products.id, products.name, products.description, products.usage_info, products.category, products.price, product_images.image_path, products.stocks_val, products.variants
  FROM products
  LEFT JOIN product_images ON products.id = product_images.product_id
`;

export const GET_ALL_PRODUCT_COUNT = `
  SELECT COUNT(*) AS total_products
  FROM products
`;



export const GET_PRODUCT_IMAGE_BY_NAME = 'SELECT * FROM product_images WHERE name = ?';
export const INSERT_PRODUCT_IMAGE = 'INSERT INTO product_images (product_id, image_path) VALUES (?, ?)';
export const UPDATE_PRODUCT_IMAGE = 'UPDATE product_images SET image_path = ? WHERE product_id = ?';
export const DELETE_PRODUCT_IMAGE = 'DELETE FROM system_config WHERE name = ?';
export const GET_ALL_PRODUCT_IMAGE = `
  SELECT product_images.image_path
  FROM products
  JOIN product_images ON products.id = product_images.product_id
`;

export const UPDATE_PRODUCT_VARIANTS =
  'UPDATE products SET variants = ? WHERE id = ?';

// ai
export const GET_PRODUCT_BY = 'SELECT id, name, description, category, price, stocks_val, variants FROM products';
export const GET_PRODUCT_BY_ID = `
  SELECT p.*, pi.image_path
  FROM products p
  LEFT JOIN product_images pi ON pi.product_id = p.id
  WHERE p.id = ?
`;

export const INSERT_QUERY = 'INSERT INTO customer_queries (question, response, matched_item_name, matched_item_description, price) VALUES (?, ?, ?, ?, ?)';
export const INSERT_QUERY_IMAGE = 'INSERT INTO image_processing (image_path, matched_item_name, matched_item_description, price, question) VALUES (?, ?, ?, ?, ?)';

export const GET_ALL_IMAGE_COUNT = `
  SELECT COUNT(*) AS total_img_process
  FROM image_processing
`;

export const GET_ALL_QUERY_COUNT = `
  SELECT COUNT(*) AS total_query
  FROM customer_queries
`;

export const GET_ALL_QUERY_CUSTOMER = `
  SELECT id, question, response, matched_item_name, matched_item_description, price, created_at
  FROM customer_queries
`;

export const Get_ALL_RECOGNITIONS = `
  SELECT id, image_path, matched_item_name, price, question, created_at, matched_item_description
  FROM image_processing
`;

// machine learning model
export const INSERT_MODEL = 'INSERT INTO uploaded_models (filename, original_name, extracted_path, zip_path, class) VALUES (?, ?, ?, ?, ?)';
export const GET_MODEL_BY_ID = 'SELECT * FROM uploaded_models WHERE id = ?';
// export const UPDATE_CONFIG = 'UPDATE system_settings SET value = ? WHERE name = ?';
export const DELETE_MODEL = 'DELETE FROM uploaded_models WHERE id = ?';
export const GET_ALL_UPLOADED_MODELS = 'SELECT * FROM uploaded_models ORDER BY id DESC';


// login
export const GET_LOGIN_INFO = 'SELECT * FROM users WHERE email = ? AND password = ?';
export const UPDATE_LOGIN = 'UPDATE users SET auth_token = ?, last_login = ? WHERE email = ? && password = ?';
export const CHECK_TOKEN = 'SELECT * FROM users WHERE auth_token = ?';

// account
export const UPDATE_ACCOUNT = 'UPDATE users SET first_name = ?, last_name = ?, email = ?, phone = ? WHERE auth_token = ?';
export const UPDATE_ACCOUNT_PASS = 'UPDATE users SET password = ? WHERE auth_token = ?';
