// services/configService.js
import db from './db.js';
import * as queries from './queries.js';

// system config
export async function getConfig(name) {
  const [rows] = await db.execute(queries.GET_CONFIG_BY_NAME, [name]);
  return rows[0];
}

export async function insertConfig(name, value) {
  const [result] = await db.execute(queries.INSERT_CONFIG, [name, value]);
  return result.insertId;
}

export async function updateConfig(name, value) {
  const [result] = await db.execute(queries.UPDATE_CONFIG, [value, name]);
  return result.affectedRows;
}

export async function deleteConfig(name) {
  const [result] = await db.execute(queries.DELETE_CONFIG, [name]);
  return result.affectedRows;
}

export async function getAllConfigs() {
  const [rows] = await db.execute(queries.GET_ALL_CONFIGS);
  return rows;
}

// Products
export async function getProduct(name) {
  const [rows] = await db.execute(queries.GET_PRODUCT_BY_NAME, [name]);
  return rows[0];
}

export async function insertProduct(name, description, usage_info, category, price, stocks_val) {
  const [result] = await db.execute(queries.INSERT_PRODUCT, [name, description, usage_info, category, price, stocks_val]);
  return result.insertId;
}

export async function updateProduct(name, description, usage_info, category, price, stocks_val, id) {
  const [result] = await db.execute(queries.UPDATE_PRODUCT, [name, description, usage_info, category, price, stocks_val, id]);
  return result.affectedRows;
}

export async function deleteProduct(id) {
  const [result] = await db.execute(queries.DELETE_PRODUCT, [id]);
  return result.affectedRows;
}

export async function getAllProducts() {
  const [rows] = await db.execute(queries.GET_ALL_PRODUCT);
  return rows;
}

export async function getCountProduct() {
  const [rows] = await db.execute(queries.GET_ALL_PRODUCT_COUNT);
  return rows[0].total_products;
}


export async function getProductImage(name) {
  const [rows] = await db.execute(queries.GET_PRODUCT_BY_NAME, [name]);
  return rows[0];
}

export async function insertProductImage(product_id, image_path) {
  const [result] = await db.execute(queries.INSERT_PRODUCT_IMAGE, [product_id, image_path]);
  return result.insertId;
}

export async function updateProductImage(image_path, product_id) {
  const [result] = await db.execute(queries.UPDATE_PRODUCT_IMAGE, [image_path, product_id]);
  return result.affectedRows;
}

export async function deleteProductImage(name) {
  const [result] = await db.execute(queries.DELETE_PRODUCT, [name]);
  return result.affectedRows;
}

export async function getAllProductsImage() {
  const [rows] = await db.execute(queries.GET_ALL_PRODUCT);
  return rows;
}

export async function UPDATE_PRODUCT_VARIANTS(variants, product_id) {
  const [result] = await db.execute(queries.UPDATE_PRODUCT_VARIANTS, [JSON.stringify(variants), product_id]);
  return result.affectedRows;
}

// AI
export async function getAllProductsBy() {
  const [rows] = await db.execute(queries.GET_PRODUCT_BY);
  return rows;
}

export async function GET_PRODUCT_BY_ID(id) {
  const [rows] = await db.execute(queries.GET_PRODUCT_BY_ID, [id]);
  return rows[0];
}

export async function insertQuery(question, response, matched_item_name, matched_item_description, price) {
  const [result] = await db.execute(queries.INSERT_QUERY, [question, response, matched_item_name, matched_item_description, price]);
  return result.insertId;
}

export async function insertQueryImage(image_path, matched_item_name, matched_item_description, price, question) {
  const [result] = await db.execute(queries.INSERT_QUERY_IMAGE, [image_path, matched_item_name, matched_item_description, price, question]);
  return result.insertId;
}

export async function getCountImg() {
  const [rows] = await db.execute(queries.GET_ALL_IMAGE_COUNT);
  return rows[0].total_img_process;
}

export async function getCountQuery() {
  const [rows] = await db.execute(queries.GET_ALL_QUERY_COUNT);
  return rows[0].total_query;
}

export async function getQueryCustomer() {
  const [rows] = await db.execute(queries.GET_ALL_QUERY_CUSTOMER);
  return rows;
}

export async function getImgProcess() {
  const [rows] = await db.execute(queries.Get_ALL_RECOGNITIONS);
  return rows;
}

// machine learning model
export async function insertModelUpload(filename, original_name, extracted_path, zip_path, classname) {
  const [result] = await db.execute(queries.INSERT_MODEL, [filename, original_name, extracted_path, zip_path, classname]);
  return result.insertId;
}
export async function getModel(id) {
  const [rows] = await db.execute(queries.GET_MODEL_BY_ID, [id]);
  return rows[0];
}

// export async function updateConfig(name, value) {
//   const [result] = await db.execute(queries.UPDATE_CONFIG, [value, name]);
//   return result.affectedRows;
// }

export async function deleteModel(id) {
  const [result] = await db.execute(queries.DELETE_MODEL, [id]);
  return result.affectedRows;
}

export async function getAllUploadedModels() {
  const [rows] = await db.execute(queries.GET_ALL_UPLOADED_MODELS);
  return rows;
}

// login
export async function getLoginInfo(email, password) {
  const [result] = await db.execute(queries.GET_LOGIN_INFO, [email, password]);
  return result[0];
}

export async function updateLoginInfoBy(token, lastlogin, email, password) {
  const [result] = await db.execute(queries.UPDATE_LOGIN, [token, lastlogin, email, password]);
  return result.affectedRows;
}

export async function checkauth(token) {
  const [result] = await db.execute(queries.CHECK_TOKEN, [token]);
  return result[0];
}

// account
export async function updateAccount(first, last, email, phone, token) {
  const [result] = await db.execute(queries.UPDATE_ACCOUNT, [first, last, email, phone, token]);
  return result.affectedRows;
}

export async function changePass(newpass, token) {
  const [result] = await db.execute(queries.UPDATE_ACCOUNT_PASS, [newpass, token]);
  return result.affectedRows;
}
