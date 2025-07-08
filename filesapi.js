import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from "@google/genai";

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


import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ai = new GoogleGenAI({ apiKey: "AIzaSyDqmPnLlDKnSl-NlaLFQWrkY1EOhW2Nln0" }); // Replace with your actual API key

async function uploadfile() {
    const allproducts = await getAllProducts();

    const simplifiedProducts = allproducts.map(product => {
        const firstImage = product.image_path.split(',')[0].trim();
        return {
            id: product.id,
            name: product.name,
            description: product.description,
            category: product.category,
            price: product.price,
            imagePath: __dirname + firstImage
        };
    });

    console.log(simplifiedProducts);

    const myfile = await ai.files.upload({
        file: "/Users/ernesto/Documents/Capstone Projects/Virtual Assistant/public/product_image/household/keys/1.jpg", // Your image path
        config: { mimeType: "image/jpeg" }, // Assuming it's a JPEG image based on the .jpg extension
    });

    console.log("File uploaded successfully:", myfile);
}

// uploadfile();

// async function listUploadedFiles() {
//     const listResponse = await ai.files.list({ config: { pageSize: 10 } });
//     for await (const file of listResponse) {
//         console.log(file.name);
//         console.log(file);
//     }

//     const response = await ai.models.generateContent({
//         model: "gemini-2.0-flash",
//         contents: createUserContent([
//             createPartFromUri('https://generativelanguage.googleapis.com/v1beta/files/vqgq0m0ljxu5', 'image/jpeg'),
//             "Describe this image of a product in 1 sentence.",
//         ]),
//     });

//     console.log(response.text);

//     // await ai.files.delete({ name: "files/lqgk7ygzr84y" });
// }

// Call the function to list your uploaded files
// await listUploadedFiles();

// await main();

// Suppose `ai` is your Gemini client instance

// async function describeUploadedImage(fileId) {
//   const response = await ai.chat.completions.create({
//     model: "gemini-1.5-turbo", // or whatever model you use
//     messages: [
//       {
//         role: "user",
//         parts: [
//           { fileData: { fileUri: fileId, mimeType: "image/jpeg" } }, // your uploaded image file ID here
//           { text: "Please describe the main item in this image." }
//         ]
//       }
//     ]
//   });

//   console.log("Description:", response.choices[0].message.text);
//   return response.choices[0].message.text;
// }

// // Call it with your uploaded file id
// await describeUploadedImage("files/vqgq0m0ljxu5");


// async function ask(){
//     const response = await ai.models.generateContent({
//       model: "gemini-2.0-flash",
//       contents: "Can you describe each product image i uploaded. https://generativelanguage.googleapis.com/v1beta/files/vqgq0m0ljxu5",
//       config: {
//         systemInstruction: `you are a store assistant`,
//       },
//       generationConfig: {
//         maxOutputTokens: 100,
//         temperature: 0.1,
//       },
//     });

//     const text = response?.candidates?.[0]?.content?.parts?.[0]?.text || 'Failed to create response.';

//     console.log(text);
// }

// await ask();


// Working 
async function describeImageWithContext() {
    // 1. List and pick the most recent N files
    const listResponse = await ai.files.list({ config: { pageSize: 2 } }); // <--- Change this to 2
    const files = [];

    for await (const file of listResponse) {
        files.push(file);
    }

    if (files.length < 2) { // Check if you have at least two files
        console.log("Not enough files uploaded to send two images.");
        return;
    }

    console.log(files);

    // No need for latestFile if you're directly using files[0] and files[1]
    const latestFile = files[0];
    console.log(latestFile.uri);

    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: createUserContent([
            createPartFromUri(files[0].uri, files[0].mimeType),
            createPartFromUri(files[1].uri, files[1].mimeType),
            "How many images are there? and describe what is the main object in the center of the image?",
        ]),
    });

    console.log(response);
    console.log(response.text);
}

describeImageWithContext();


async function deletefile(){
    await ai.files.delete({ name: 'https://generativelanguage.googleapis.com/v1beta/files/89rsdcfel4oj' });
    await ai.files.delete({ name: 'https://generativelanguage.googleapis.com/v1beta/files/vqgq0m0ljxu5' });
}

// deletefile();