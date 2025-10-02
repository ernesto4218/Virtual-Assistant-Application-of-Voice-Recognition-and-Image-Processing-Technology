import express from 'express';
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";

import { 
  getConfig, 
  insertConfig, 
  updateConfig,
  insertProduct,
  insertProductImage,
  updateProduct,
  updateProductImage,
  deleteProduct,
  getAllProducts,
  getAllProductsBy,
  insertQuery,
  insertQueryImage,
  insertModelUpload,
  deleteModel,
  getModel,
  updateLoginInfoBy,
  getLoginInfo,
  updateAccount,
  changePass,
  checkauth,
 } from '../db/services.js';

import path from 'path';
import bodyParser from 'body-parser';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import fsp from 'fs/promises'
import unzipper from 'unzipper';
import cookieParser from 'cookie-parser';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '..', '/public/product_image');
const client = new OpenAI();

// middleware
const router = express.Router();
router.use(bodyParser.json({ limit: '10mb' })); // Increase if image is large
router.use(cookieParser());

router.post('/ask', async (req, res) => {
  const { question } = req.body;

  try {
    const api = (await getConfig('api_key')).value;
    const instructions = (await getConfig('instructions')).value;
    const restrictions = (await getConfig('selected_restrictions')).value;

    const products = await getAllProductsBy();
    const productsWithoutImages = products.map(({ image_path, ...rest }) => rest);
    const productsString = JSON.stringify(productsWithoutImages);    
    console.log(productsString);

    // const ai = new GoogleGenAI({ apiKey: api });

    // const response = await ai.models.generateContent({
    //   model: "gemini-2.0-flash",
    //   systemInstruction: {
    //     role: "system",
    //     parts: [{
    //       text: `${instructions}. Use only items available with categories and prices in Philippine pesos ₱00: ${productsString}. Topics you are not allowed to talk about: ${restrictions}.`
    //     }]
    //   },
    //   contents: [
    //     {
    //       role: "user",
    //       parts: [{ text: `The customer question: ${question}` }]
    //     }
    //   ],
    //   generationConfig: {
    //     maxOutputTokens: 100,
    //     temperature: 0.1,
    //   },
    // });

    const response = await client.responses.create({
        model: "gpt-3.5-turbo",
        input: `${instructions}. Use only items available with categories and prices in Philippine pesos ₱00: ${productsString}. Topics you are not allowed to talk about: ${restrictions}. The customer question: ${question}`
    });

    console.log(response.output_text);

    const text = response.output_text || 'Failed to create response.';

    const matchedProduct = products.find(product => 
      text.toLowerCase().includes(product.name.toLowerCase())
    );

    if (matchedProduct){
      const record = await insertQuery(question, text, matchedProduct.name, matchedProduct.description, matchedProduct.price);

    } else {
      const record = await insertQuery(question, text, null, null, null);
    }

    res.json({success: true, message: text });
  } catch (error) {
    console.error('AI error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});


router.post('/record_question', async (req, res) => {
  try {
    const { response, question } = req.body;
    const products = await getAllProductsBy();

    // Simulate response generation
    const text = response || 'Failed to create response.';

    const matchedProduct = products.find(product =>
      text.toLowerCase().includes(product.name.toLowerCase())
    );

    let record;
    if (matchedProduct) {
      record = await insertQuery(question, response, matchedProduct.name, matchedProduct.description, matchedProduct.price);
    } else {
      record = await insertQuery(question, response, null, null, null);
    }

    // Send back the result
    res.json({ success: true, record, responseText: text });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});


router.post('/getconfig', async (req, res) => {
  const instructions = (await getConfig('instructions')).value;
  const restrictions = (await getConfig('selected_restrictions')).value;
  const products = await getAllProductsBy();
  const productsString = JSON.stringify(products);

  res.json({success: true, instructions: instructions, restrictions: restrictions, productsString: productsString });

});

router.post('/saveconfig', async (req, res) => {
  const receivedData = req.body;
  if (receivedData){
      const updateapi = await updateConfig('api_key', receivedData.api_key);
      const updateinstructions = await updateConfig('instructions', receivedData.instructions);
      const updaterestrictions = await updateConfig('selected_restrictions', receivedData.restrictions);
      const recognition_model = await updateConfig('recognition', receivedData.recognition_model);

      if (updateapi || updateinstructions || updaterestrictions || recognition_model){
        res.json({ success: true, message: 'Configuration saved' });
      }
  } else {
      res.json({ success: false, message: 'Missing data' });
  }
 
  console.log('Received data:', receivedData);
});

router.post('/processimage', async (req, res) => {
  const base64Image = req.body.img;
  const question = req.body.question || 'What is in this image?';

  const allproducts = await getAllProducts();
  const productsWithoutImages = allproducts.map(({ image_path, id, ...rest }) => rest);
  const productsString = JSON.stringify(productsWithoutImages);
  const restrictions = (await getConfig('selected_restrictions')).value;
  const recognition = (await getConfig('recognition')).value;

  console.log(productsString);
  if (!base64Image) {
    return res.status(400).json({ message: 'No image provided.' });
  }

  // Extract actual base64 data
  const matches = base64Image.match(/^data:image\/(png|jpeg);base64,(.+)$/);

  if (!matches || matches.length !== 3) {
    return res.status(400).json({ message: 'Invalid image format.' });
  }

  const ext = matches[1];
  const data = matches[2];
  const buffer = Buffer.from(data, 'base64');

  const uploadsDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }

  const filename = `captured-${Date.now()}.${ext}`;
  const filepath = path.join(uploadsDir, filename);
  fs.writeFileSync(filepath, buffer);

  // Extract the relative path starting from `/routes`
  const keyword = `${path.sep}routes`;
  const index = filepath.indexOf(keyword);
  const relativePath = index !== -1 ? filepath.substring(index) : filepath;

  // AI Processing
  const prompt = `
    You are tasked with identifying a single object in an image.

    Rules:
    - Identify only the main object.
    - Match only from the product list; do NOT guess or invent.
    - Use the product name exactly as written in the list (no rewording).
    - Provide only 1 to 2 sentences with product info (description, price, category, stocks, usage_info).
    - End your answer with the exact product name in this format: "name":"<product name from list>".
    - If unclear or not in the list, reply: "Item not in database" or "Cannot recognize."
    - Never use synonyms, invented words, or alternate phrasing.
    - Absolutely do NOT answer questions outside the product list or allowed topics.

    ---
    Product List:
    ${productsString}
    ---

    ---
    Restricted Topics (do not answer about these):
    ${restrictions}
    ---

    Customer question: ${question}
    `;



  console.log('Image saved to:', filepath);
  console.log('productsString:', productsString);
  console.log('restrictions:', restrictions);

  try {
    const base64ImageFile = fs.readFileSync(filepath, {
      encoding: "base64",
    });

    const response = await client.responses.create({
        model: "gpt-4.1-mini",
        input: [
            {
                role: "user",
                content: [
                    { type: "input_text", text: prompt },
                    {
                        type: "input_image",
                        image_url: `data:image/jpeg;base64,${base64ImageFile}`,
                    },
                ],
            },
        ],
    });

    const match = response.output_text.match(/"name":"([^"]+)"/i);

    let matchedProduct = null;

    if (match && match[1]) {
      const itemName = match[1].toLowerCase();
      matchedProduct = allproducts.find(product => 
        product.name.toLowerCase() === itemName
      );
    }

    console.log(matchedProduct);


    await insertQueryImage(
      relativePath,
      matchedProduct?.name || null,
      matchedProduct?.description || null,
      matchedProduct?.price || null,
      question
    );

    res.status(200).json({ success: true, message: response.output_text, item: matchedProduct });
  } catch (err) {
    console.error("AI Error:", err);
    res.status(500).json({ message: "Error analyzing the image." });
  }
});

// add product
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const category = req.body.category || 'default_category';
    const name = req.body.name || 'default_name';

    const uploadPath = path.join(uploadDir, category, name);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    if (!req.fileIndex) {
      req.fileIndex = 1;
    } else {
      req.fileIndex++;
    }
    const ext = path.extname(file.originalname);
    cb(null, `${req.fileIndex}${ext}`);
  }
});

const upload = multer({ storage: storage });

router.post('/addProduct', upload.array('productImages', 10), async (req, res) => {
  
  const filePaths = req.files
  .map(file => path.relative(path.join(__dirname, '..', 'public'), file.path).replace(/\\/g, '/'))
  .join(', ');

  console.log('Form Fields:', req.body);
  console.log('filePaths:', filePaths);

  const id = req.body.id;
  const name = req.body.name;
  const description = req.body.description;
  const usage_info = req.body.usage_info;
  const category = req.body.category;
  const price = req.body.price;
  const stocks_val = req.body.stocks_val;


  console.log(req.body);

  if (id){
    const update = await updateProduct(name, description, usage_info, category, price, stocks_val, id);
    if (!update) return res.status(500).json({ error: 'Product update failed' });

    if (filePaths){
      const updateImage = await updateProductImage(filePaths, id);
      if (!updateImage) return res.status(500).json({ error: 'Image upate failed' });
    }
    
    const allproducts = await getAllProducts();
    res.status(200).json({ message: 'Update successful', allproducts: allproducts});

  } else {
    const insert = await insertProduct(name, description, usage_info, category, price, stocks_val);
    if (!insert) return res.status(500).json({ error: 'Product insert failed' });

    const insertImage = await insertProductImage(insert, filePaths);
    if (!insertImage) return res.status(500).json({ error: 'Image insert failed' });

    const allproducts = await getAllProducts();
    res.status(200).json({ message: 'Insert successful', product_id: insert, allproducts: allproducts });
  }

});

router.post('/deleteProduct', async (req, res) => {
  const receivedData = req.body;
  if (receivedData){
      const delete_Product = await deleteProduct(receivedData.id);
      const allproducts = await getAllProducts();

      console.log(allproducts);
      res.json({ success: true, message: 'Product delete successfully', allproducts: allproducts });
  } else {
      res.json({ success: false, message: 'Missing data' });
  }
 
  console.log('Received data:', receivedData);
});

// upload model
const storage_model = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'ml/zip'); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    // Keep or  iginal file name
    cb(null, file.originalname);
  }
});

const uploadModel = multer({ storage: multer.memoryStorage() });
router.post('/uploadModel', upload.fields([
  { name: 'model.json', maxCount: 1 },
  { name: 'model.weights.bin', maxCount: 1 },
  { name: 'class_names', maxCount: 1 } // optional class name file
]), async (req, res) => {
  try {
    // Resolve the model save path relative to this file (api/)
    const modelDir = path.resolve(__dirname, '../models/');
    fs.mkdirSync(modelDir, { recursive: true });

    // Save model.json
    if (req.files['model.json']) {
      fs.writeFileSync(
        path.join(modelDir, 'model.json'),
        req.files['model.json'][0].buffer
      );
    }

    // Save model.weights.bin
    if (req.files['model.weights.bin']) {
      fs.writeFileSync(
        path.join(modelDir, 'model.weights.bin'),
        req.files['model.weights.bin'][0].buffer
      );
    }

    // Optional: Save class_names.json
    if (req.files['class_names']) {
      fs.writeFileSync(
        path.join(modelDir, 'class_names.json'),
        req.files['class_names'][0].buffer
      );
    }

    res.json({ message: 'Model uploaded and saved to routes/models/' });
  } catch (error) {
    console.error('Upload failed:', error);
    res.status(500).json({ message: 'Failed to save model files.' });
  }
});

router.post('/upload-model', uploadModel.single('file'), async (req, res) => {
  try {
    const projectRoot = path.resolve(__dirname, '..');
    const zipPath = path.join(projectRoot, 'ml/zip', req.file.filename);
    const baseName = path.parse(req.file.filename).name;
    const extractPath = path.join(projectRoot, 'ml/model', baseName);

    // Clear old folder if it exists
    if (fs.existsSync(extractPath)) {
      fs.rmSync(extractPath, { recursive: true, force: true });
    }

    fs.mkdirSync(extractPath, { recursive: true });

    // Wait for the entire unzip to finish
    await new Promise((resolve, reject) => {
      fs.createReadStream(zipPath)
        .pipe(unzipper.Extract({ path: extractPath }))
        .on('close', resolve)
        .on('error', reject);
    });

    // Correct metadata path
    const metadataPath = path.join(extractPath, 'metadata.json');
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    const labelsString = metadata.labels.join(', ');

    console.log('Looking for metadata at:', metadataPath);
    console.log('Files in folder:', fs.readdirSync(extractPath));


    // Insert into DB or any store
    await insertModelUpload(baseName, req.file.filename, extractPath, zipPath, labelsString);

    res.json({
      status: 'success',
      message: 'File uploaded and extracted successfully.',
      extracted_to: extractPath,
    });
  } catch (error) {
    console.error('Extraction failed:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to extract zip file.',
    });
  }
});

router.post('/delete-model', async (req, res) => {
  try {
    const { model_id } = req.body; // destructure model_id from req.body
    console.log('Received model ID:', model_id);

    if (!model_id) {
      return res.status(400).json({
        status: 'error',
        message: 'Model ID is required.',
      });
    }

    const model = await getModel(model_id);
    if (!model) {
      return res.status(404).json({ status: 'error', message: 'Model not found.' });
    }

    const projectRoot = path.resolve(__dirname, '..');
    const extractedPath = path.join(projectRoot, 'ml', 'model', model.filename);
    const zipPath = path.join(projectRoot, 'ml', 'model', model.original_name);

    await fsp.rm(extractedPath, { recursive: true, force: true });
    await fsp.rm(zipPath, { recursive: true, force: true });

    await updateConfig('active_model', '');
    await deleteModel(model.id);

    // For now, just send a success response
    res.json({
      status: 'success',
      message: `Model ${model_id} deleted.`,
      model: model_id,
    });

  } catch (error) {
    console.error('Deletion failed:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete model.',
    });
  }
});

router.post('/use-model', async (req, res) => {
  try {
    const id = req.body.model_id;
    const model = await getModel(id);

    await updateConfig('active_model', model.filename);

    res.json({
      status: 'success',
      message: `Model ${model.filename} activated.`,
      model: model.filename
    });
  } catch (error) {
    console.error('Extraction failed:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to extract zip file.',
    });
  }
});


router.post('/login', async (req, res) => {
  const { email, password, rememberMe } = req.body;

  try {
    
    const exists = await getLoginInfo(email, password);
    console.log(exists);

    if (exists){
      const token = uuidv4();
      await updateLoginInfoBy(token, new Date(), email, password);
      
      if (rememberMe){
        res.cookie('auth_token', token, {
          httpOnly: true,
          secure: true,
          sameSite: 'Strict',
          maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds
        });
      } else {
         res.cookie('auth_token', token, {
          httpOnly: true,
          secure: true,
          sameSite: 'Strict',
            maxAge: 24 * 60 * 60 * 1000 // 1 day in milliseconds
        });
      }

      res.status(200).json({ status: 'success', message: 'Login  successfully' });
    } else {
      res.status(200).json({ status: 'error', message: 'Invalid email or password.' });
    }
   
  } catch (error) {
    console.error('Save settings error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

router.post('/save-account', async (req, res) => {
  const { first, last, email, phone } = req.body;
  const token = req.cookies.auth_token;

  try {
    await updateAccount(first, last, email, phone, token);
    
    // Simulate a response
    res.status(200).json({ status: 'success', message: 'Account saved successfully' });
  } catch (error) {
    console.error('Save settings error:', error);
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

router.post('/change-password', async (req, res) => {
  const { oldpass, newpass, confirm } = req.body;
  const token = req.cookies.auth_token;


  console.log(token);
  if (!token) {
    return res.redirect('login');
  }

  const auth = await checkauth(token);
  console.log(auth);

  if (!auth){
    return res.redirect('login');
  }

  try {

    if (auth.password === oldpass){
      await changePass(newpass, token);
      
      // Simulate a response
      res.status(200).json({ status: 'success', message: 'Account saved successfully' });
    } else {
      res.status(200).json({ status: 'error', message: 'Wrong old password.' });
    }
    
  } catch (error) {
    console.error('Save settings error:', error);
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

export default router;



                    // fetch('/api/ask', {
                    //     method: 'POST',
                    //     headers: {
                    //         'Content-Type': 'application/json'
                    //     },
                    //     body: JSON.stringify({ question: transcriptSegment })
                    // })
                    // .then(res => res.json())
                    // .then(data => {
                    //     console.log("Response in", Date.now() - start, "ms:", data);
                    //     speakWithVoice(data.message, "Google UK English Female");
                    //     typeCaption(data.message);     
                    //     isWaitingForResponse = false;
                    // })
                    // .catch(err => {
                    //     console.error('Error:', err);
                    //     isWaitingForResponse = false;
                    // });