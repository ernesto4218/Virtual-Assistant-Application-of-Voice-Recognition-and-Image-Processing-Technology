import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './routes/api.js';
import { getAllConfigs,
  insertConfig,
  updateConfig,
  getAllProducts,
  getCountProduct,
  getCountImg,
  getCountQuery,
  getQueryCustomer,
  getImgProcess,
  getAllUploadedModels,
  checkauth,
} from './db/services.js';

import cookieParser from 'cookie-parser';
import axios, { all } from "axios";
import * as cheerio from "cheerio";

const app = express();
const port = 3002;

// __dirname workaround for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// EJS setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/routes/uploads', express.static(path.join(__dirname, 'routes/uploads')));

// Routes
app.get('/', async (req, res) => {
  res.render('homepage');
});

app.get('/assistant', async (req, res) => {
  const allconfig = await getAllConfigs();
  const uploadedfiles = await getAllUploadedModels();

  res.render('index', {allconfig: allconfig});
});


app.get('/admin/home', async (req, res) => {
  try {
    const token = req.cookies.auth_token;

    console.log(token);
    if (!token) {
      return res.redirect('/login');
    }

    const auth = await checkauth(token);
    console.log(auth);
    if (!auth){
      return res.redirect('/login');
    }

    const formattedAuth = {
      ...auth,
      last_login: formatDate(auth.last_login),
      last_updated: formatDate(auth.last_updated),
      date_added: formatDate(auth.date_added),
    };
    
    const countProduct = await getCountProduct();
    const countProductLocal = Number(countProduct).toLocaleString();

    const countImg = await getCountImg();
    const countImgLocal = Number(countImg).toLocaleString();

    const countQuery = await getCountQuery();
    const countQueryLocal = Number(countQuery).toLocaleString();

    const getCustomerQuestion = await getQueryCustomer();
    const getImageRecognition = await getImgProcess();

    console.log(getCustomerQuestion);


    const header = {
      date: getFormattedTime(),
      name: `${getGreeting()}, ${formattedAuth.first_name}`,
      title: "System Configuration",
      path: req.path
    }

    
    res.render('admin', {
      header: header,
      title: 'Overview',
      account: formattedAuth,
      count_query: countQueryLocal,
      count_img: countImgLocal,
      count_product: countProductLocal,
      questions: getCustomerQuestion,
      recognitions: getImageRecognition
    });
  } catch (error) {
    console.error('Error loading admin overview:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/admin/account', async (req, res) => {

  const token = req.cookies.auth_token;
  console.log(token);
  if (!token) {
    return res.redirect('/login');
  }

  const auth = await checkauth(token);
  console.log(auth);
  if (!auth){
    return res.redirect('/login');
  }

  const formattedAuth = {
    ...auth,
    last_login: formatDate(auth.last_login),
    last_updated: formatDate(auth.last_updated),
    date_added: formatDate(auth.date_added),
  };

  console.log(formattedAuth);

  const header = {
    date: getFormattedTime(),
    name: `${getGreeting()}, ${formattedAuth.first_name}`,
    title: "Account Information",
    path: req.path
  }

  res.render('account', {header: header, account: formattedAuth});
});

app.get('/admin/sysconfig', async (req, res) => {
  const token = req.cookies.auth_token;
  console.log(token);
  if (!token) {
    return res.redirect('/login');
  }

  const auth = await checkauth(token);
  console.log(auth);
  if (!auth){
    return res.redirect('/login');
  }

  const formattedAuth = {
    ...auth,
    last_login: formatDate(auth.last_login),
    last_updated: formatDate(auth.last_updated),
    date_added: formatDate(auth.date_added),
  };

  const config = {};
  const allconfig = await getAllConfigs();
  const allproducts = await getAllProducts();
  const uploadedfiles = await getAllUploadedModels();

  allconfig.forEach(row => {
    config[row.name] = row.value;

    // Format the date into a shorter, readable version
    row.formatted_date = new Date(row.date_updated).toLocaleString('en-PH', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  });

  uploadedfiles.forEach(file => {
    file.formatted_date = new Date(file.upload_date).toLocaleString('en-PH', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  });

  const activeModel = config['active_model']; // e.g., 'gemini'
  const matchingModel = uploadedfiles.find(file => file.filename === activeModel); // or undefined if no match

  // console.log('Uploaded files:', uploadedfiles);
  // console.log('Matching active model:', matchingModel);

  allproducts.sort((a, b) => b.id - a.id);
  console.log(allproducts);
  const header = {
    date: getFormattedTime(),
    name: `${getGreeting()}, ${formattedAuth.first_name}`,
    title: "System Configuration",
    path: req.path
  }

  res.render('config', {
    header: header,
    config: config,
    account: formattedAuth,
    allconfig: allconfig,
    allproducts: allproducts,
    uploadedmodels: uploadedfiles,
    activemodelinfo: matchingModel || null, // pass it to the view
  });
  
});

app.get('/admin/imageprocessing', async (req, res) => {
  const token = req.cookies.auth_token;
  console.log(token);
  if (!token) {
    return res.redirect('/login');
  }

  const auth = await checkauth(token);
  console.log(auth);
  if (!auth){
    return res.redirect('/login');
  }

  const formattedAuth = {
    ...auth,
    last_login: formatDate(auth.last_login),
    last_updated: formatDate(auth.last_updated),
    date_added: formatDate(auth.date_added),
  };

  // const iframe = await modifyHtmlFromUrl("https://teachablemachine.withgoogle.com/train/image");
  // console.log(iframe);
  
  const products = await getAllProducts();

  const header = {
    date: getFormattedTime(),
    name: `${getGreeting()}, ${formattedAuth.first_name}`,
    title: "Image Processing",
    path: req.path
  }

  console.log(products);
  
  res.render('machinelearning2', {
    header: header,
    account: formattedAuth,
    products: products
  });
});

app.get("/modified-teachable", async (req, res) => {
  try {
    res.send(`
      https://teachablemachine.withgoogle.com/train/image
    `);
  } catch (error) {
    res.status(500).send("Error fetching or modifying page");
  }
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/logout', (req, res) => {
  res.clearCookie('auth_token', { path: '/' });
  res.redirect('login');
});



app.use('/api', apiRouter);

// cdn
app.use('/cdn/apexcharts', express.static(path.join(__dirname, 'node_modules/apexcharts')));
app.use('/cdn/lodash', express.static(path.join(__dirname, 'node_modules/lodash')));
app.use('/cdn/flyonui', express.static(path.join(__dirname, 'node_modules/flyonui')));
app.use('/cdn/preline', express.static(path.join(__dirname, 'node_modules/preline')));
app.use('/machinelearning/', express.static(path.join(__dirname, 'ml/model/')));
app.use('/capturedimg/', express.static(path.join(__dirname, 'routes/uploads/')));

//helper
function getFormattedTime() {
  const now = new Date();

  // Day of the week, e.g., 'Wed'
  const weekday = now.toLocaleDateString('en-US', { weekday: 'short' });

  // Month, e.g., 'May'
  const month = now.toLocaleDateString('en-US', { month: 'short' });

  // Day of the month, e.g., '28'
  const day = now.getDate();

  // Time in hours and minutes with AM/PM, e.g., '9:12 AM'
  const time = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  return `${weekday} ${month} ${day} ${time}`;
}

function formatDate(date) {
  if (!date) return null;
  return new Date(date).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Manila'
  });
}

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


async function modifyHtmlFromUrl(url) {
  const { data: html } = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  });

  const $ = cheerio.load(html);

  // ✅ Modify the <span id="app-name"> element
  $("#app-name").text("Ernesto's Machine");

  // Log the modified HTML
  return $.html();
}