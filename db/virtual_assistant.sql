-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jul 18, 2025 at 08:30 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `virtual_assistant`
--

-- --------------------------------------------------------

--
-- Table structure for table `customer_queries`
--

CREATE TABLE `customer_queries` (
  `id` int(11) NOT NULL,
  `question` text NOT NULL,
  `response` text DEFAULT NULL,
  `matched_item_name` varchar(255) DEFAULT NULL,
  `matched_item_description` text DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `image_processing`
--

CREATE TABLE `image_processing` (
  `id` int(11) NOT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `matched_item_name` varchar(255) DEFAULT NULL,
  `matched_item_description` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `question` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `image_processing`
--

INSERT INTO `image_processing` (`id`, `image_path`, `matched_item_name`, `matched_item_description`, `price`, `question`, `created_at`) VALUES
(1, '/routes/uploads/captured-1748169922452.jpeg', 'Smartphones', 'Realme, Xiaomi, Samsung, Oppo, Vivo', 7500.00, 'can you identify this item', '2025-05-25 18:45:25'),
(2, '/routes/uploads/captured-1748170167510.jpeg', 'Nail Cutter', 'Stainless Trim brand', 100.00, 'can you identify this item', '2025-05-25 18:49:30'),
(3, '/routes/uploads/captured-1748223134437.jpeg', 'Glass Mugs', 'Glass Mugs', 142.00, '', '2025-05-26 09:32:17'),
(4, '/routes/uploads/captured-1748223422367.jpeg', NULL, NULL, NULL, 'can you identify this item', '2025-05-26 09:37:04'),
(5, '/routes/uploads/captured-1748223534171.jpeg', NULL, NULL, NULL, '', '2025-05-26 09:38:56'),
(6, '/routes/uploads/captured-1748224210810.jpeg', NULL, NULL, NULL, 'i don\'t know what category or name of this item belongs to', '2025-05-26 09:50:13'),
(7, '/routes/uploads/captured-1748224378825.jpeg', 'Tooth Brush', 'Oral-B Pink Toothbrush', 50.00, 'identify this item', '2025-05-26 09:53:01'),
(8, '/routes/uploads/captured-1748608360206.jpeg', 'sling bag', 'black, sling bag, small', 100.00, 'it is a black and leather like a bad something black and white zippers i don\'t know what it is can you help me', '2025-05-30 20:32:43'),
(9, '/routes/uploads/captured-1748613338815.jpeg', 'Spoon', 'Silver', 100.00, '', '2025-05-30 21:55:41'),
(10, '/routes/uploads/captured-1748688765497.jpeg', NULL, NULL, NULL, 'can you help me identify this item', '2025-05-31 18:52:48'),
(11, '/routes/uploads/captured-1748690148611.jpeg', 'Smartphones', 'Realme, Xiaomi, Samsung, Oppo, Vivo', 7500.00, 'i don\'t know the name of this item', '2025-05-31 19:15:51'),
(12, '/routes/uploads/captured-1748918271412.jpeg', NULL, NULL, NULL, 'i don\'t know what the name of this item please help me', '2025-06-03 10:37:54'),
(13, '/routes/uploads/captured-1748918358420.jpeg', 'Slipper', 'Brow Slipper', 500.00, 'i don\'t know the name of this item please use your camera', '2025-06-03 10:39:21'),
(14, '/routes/uploads/captured-1748926061852.jpeg', 'Sunglass', 'Black', 100.00, 'i don\'t know the name of this item can you help me', '2025-06-03 12:47:43'),
(15, '/routes/uploads/captured-1748926157012.jpeg', NULL, NULL, NULL, 'can you identify this item', '2025-06-03 12:49:19'),
(16, '/routes/uploads/captured-1748926481695.jpeg', 'Paracetamol', 'Biogesic, Alaxan, Neozep, Decolgen, Bioflu', 5.00, 'can you identify this product', '2025-06-03 12:54:43'),
(17, '/routes/uploads/captured-1748927018948.jpeg', 'nature spring', '1L bottle and has a transparent', 20.00, 'can you identify this item', '2025-06-03 13:03:42'),
(18, '/routes/uploads/captured-1748927503386.jpeg', NULL, NULL, NULL, 'can you identify this item', '2025-06-03 13:11:46'),
(19, '/routes/uploads/captured-1748927626268.jpeg', 'Rice', 'Dinorado, Sinandomeng, Jasmine, Well-Milled, Brown Rice', 200.00, 'can you identify this product', '2025-06-03 13:13:49'),
(20, '/routes/uploads/captured-1748927958629.jpeg', NULL, NULL, NULL, 'image', '2025-06-03 13:19:21'),
(21, '/routes/uploads/captured-1748929640845.jpeg', 'Water Bottle', 'Nature Spring', 20.00, 'what product it is', '2025-06-03 13:47:23'),
(22, '/routes/uploads/captured-1748929691144.jpeg', 'nature spring', '1L bottle and has a transparent', 20.00, 'could you please identify this product', '2025-06-03 13:48:14'),
(23, '/routes/uploads/captured-1748929802198.jpeg', 'Bantam', 'Medicare, for wound', 20.00, 'could you please identify this item', '2025-06-03 13:50:05'),
(24, '/routes/uploads/captured-1749921459373.jpeg', 'Toothbrush', 'Toothbrush Pink Oral-B', 100.00, '', '2025-06-15 01:17:41'),
(25, '/routes/uploads/captured-1749923572086.jpeg', 'Nail Cutter', 'Nail Cutter', 50.00, 'what is this item', '2025-06-15 01:52:54'),
(26, '/routes/uploads/captured-1749923619494.jpeg', 'Nail Cutter', 'Nail Cutter', 50.00, '', '2025-06-15 01:53:41'),
(27, '/routes/uploads/captured-1749923706483.jpeg', 'Star Screws', 'Small Star Screws', 50.00, '', '2025-06-15 01:55:09'),
(28, '/routes/uploads/captured-1749924135150.jpeg', NULL, NULL, NULL, '', '2025-06-15 02:02:17'),
(29, '/routes/uploads/captured-1749924176943.jpeg', NULL, NULL, NULL, '', '2025-06-15 02:02:59'),
(30, '/routes/uploads/captured-1749924203994.jpeg', NULL, NULL, NULL, '', '2025-06-15 02:03:26'),
(31, '/routes/uploads/captured-1749924269920.jpeg', 'Nail Cutter', 'Nail Cutter', 50.00, '', '2025-06-15 02:04:32'),
(32, '/routes/uploads/captured-1749924314319.jpeg', NULL, NULL, NULL, '', '2025-06-15 02:05:16'),
(33, '/routes/uploads/captured-1749924340038.jpeg', 'Computer Mouse', 'Gaming Mouse', 500.00, '', '2025-06-15 02:05:42'),
(34, '/routes/uploads/captured-1750170098986.jpeg', NULL, NULL, NULL, 'what is this item', '2025-06-17 22:21:41'),
(35, '/routes/uploads/captured-1750170131600.jpeg', 'Keys', 'Keys', 50.00, 'What is in this image?', '2025-06-17 22:22:14'),
(36, '/routes/uploads/captured-1750212892255.jpeg', NULL, NULL, NULL, 'how many items do you have available in stock', '2025-06-18 10:14:54'),
(37, '/routes/uploads/captured-1751006555240.jpeg', NULL, NULL, NULL, 'What is in this image?', '2025-06-27 14:42:37'),
(38, '/routes/uploads/captured-1751949462449.jpeg', 'Cellphone', 'Android Phone', 5000.00, 'What is in this image?', '2025-07-08 12:37:45'),
(39, '/routes/uploads/captured-1751949855421.jpeg', 'Pet roll bag', 'black, blue, green, purple, orange small roll bag', 50.00, 'wait do you have available this thing', '2025-07-08 12:44:18'),
(40, '/routes/uploads/captured-1751950113466.jpeg', 'Pet roll bag', 'black, blue, green, purple, orange small roll bag', 50.00, 'product', '2025-07-08 12:48:36');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `usage_info` text DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `usage_info`, `category`, `price`, `created_at`) VALUES
(5, 'Toothbrush', 'Toothbrush Pink Oral-B', 'Use for brushing teeth', 'personal-care', 100.00, '2025-06-14 10:48:39'),
(6, 'Wallet', 'Black Wallet', NULL, 'household', 150.00, '2025-06-14 16:06:45'),
(7, 'Keys', 'Keys', NULL, 'household', 50.00, '2025-06-14 16:08:02'),
(8, 'Computer Mouse', 'Gaming Mouse', NULL, 'electronics', 500.00, '2025-06-14 16:09:15'),
(9, 'Cellphone', 'Android Phone', NULL, 'electronics', 5000.00, '2025-06-14 16:10:24'),
(10, 'Nail Cutter', 'Nail Cutter', NULL, 'personal-care', 50.00, '2025-06-14 16:46:28'),
(14, 'Pet roll bag', 'black, blue, green, purple, orange small roll bag', 'use for collecting or putting animal waste in the bag', 'pet-supplies', 50.00, '2025-07-08 04:43:15');

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `image_path` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_images`
--

INSERT INTO `product_images` (`id`, `product_id`, `image_path`) VALUES
(5, 5, 'product_image/personal-care/Toothbrush/1.jpg, product_image/personal-care/Toothbrush/2.jpg, product_image/personal-care/Toothbrush/3.jpg, product_image/personal-care/Toothbrush/4.jpg, product_image/personal-care/Toothbrush/5.jpg, product_image/personal-care/Toothbrush/6.jpg, product_image/personal-care/Toothbrush/7.jpg, product_image/personal-care/Toothbrush/8.jpg, product_image/personal-care/Toothbrush/9.jpg, product_image/personal-care/Toothbrush/10.jpg'),
(6, 6, 'product_image/household/Wallet/1.jpg, product_image/household/Wallet/2.jpg, product_image/household/Wallet/3.jpg, product_image/household/Wallet/4.jpg, product_image/household/Wallet/5.jpg, product_image/household/Wallet/6.jpg, product_image/household/Wallet/7.jpg, product_image/household/Wallet/8.jpg, product_image/household/Wallet/9.jpg, product_image/household/Wallet/10.jpg'),
(7, 7, 'product_image/household/Keys/1.jpg, product_image/household/Keys/2.jpg, product_image/household/Keys/3.jpg, product_image/household/Keys/4.jpg, product_image/household/Keys/5.jpg, product_image/household/Keys/6.jpg, product_image/household/Keys/7.jpg, product_image/household/Keys/8.jpg, product_image/household/Keys/9.jpg, product_image/household/Keys/10.jpg'),
(8, 8, 'product_image/electronics/Computer Mouse/1.jpg, product_image/electronics/Computer Mouse/2.jpg, product_image/electronics/Computer Mouse/3.jpg, product_image/electronics/Computer Mouse/4.jpg, product_image/electronics/Computer Mouse/5.jpg, product_image/electronics/Computer Mouse/6.jpg, product_image/electronics/Computer Mouse/7.jpg, product_image/electronics/Computer Mouse/8.jpg, product_image/electronics/Computer Mouse/9.jpg, product_image/electronics/Computer Mouse/10.jpg'),
(9, 9, 'product_image/electronics/Cellphone/1.jpg, product_image/electronics/Cellphone/2.jpg, product_image/electronics/Cellphone/3.jpg, product_image/electronics/Cellphone/4.jpg, product_image/electronics/Cellphone/5.jpg, product_image/electronics/Cellphone/6.jpg, product_image/electronics/Cellphone/7.jpg, product_image/electronics/Cellphone/8.jpg, product_image/electronics/Cellphone/9.jpg, product_image/electronics/Cellphone/10.jpg'),
(10, 10, 'product_image/personal-care/Nail Cutter/1.jpg, product_image/personal-care/Nail Cutter/2.jpg, product_image/personal-care/Nail Cutter/3.jpg, product_image/personal-care/Nail Cutter/4.jpg, product_image/personal-care/Nail Cutter/5.jpg, product_image/personal-care/Nail Cutter/6.jpg, product_image/personal-care/Nail Cutter/7.jpg, product_image/personal-care/Nail Cutter/8.jpg, product_image/personal-care/Nail Cutter/9.jpg, product_image/personal-care/Nail Cutter/10.jpg'),
(14, 14, 'product_image/pet-supplies/Pet roll bag/1.jpg, product_image/pet-supplies/Pet roll bag/2.jpg, product_image/pet-supplies/Pet roll bag/3.jpg, product_image/pet-supplies/Pet roll bag/4.jpg, product_image/pet-supplies/Pet roll bag/5.jpg, product_image/pet-supplies/Pet roll bag/6.jpg, product_image/pet-supplies/Pet roll bag/7.jpg, product_image/pet-supplies/Pet roll bag/8.jpg, product_image/pet-supplies/Pet roll bag/9.jpg, product_image/pet-supplies/Pet roll bag/10.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `system_config`
--

CREATE TABLE `system_config` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `value` text NOT NULL,
  `date_updated` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `system_config`
--

INSERT INTO `system_config` (`id`, `name`, `value`, `date_updated`) VALUES
(1, 'api_key', 'AIzaSyDqmPnLlDKnSl-NlaLFQWrkY1EOhW2Nln0', '2025-06-15 14:23:48'),
(2, 'instructions', 'Your job is to answer customer questions about store products — including what they are, how they’re used (if usage information is provided), where to find them, and how much they cost — in no more than two clear and friendly sentences.\n\nOnly respond to questions related to the store’s inventory or services. Politely decline anything outside that scope.\n\nIf a customer asks about an item and you need a better view to help, let them know why, then use the command [open camera] to activate the camera and capture an image of the item.\nUse the camera only when needed to give accurate product information.\n\nImportant: Only include how the product is used if usage information is available. Do not answer usage questions unless the usage is already provided. Never add or change usage information on your own.\n\n', '2025-07-08 12:57:08'),
(3, 'restrictions', 'Outside-the-store information,Local news,International news,Weather forecasts,Current conditions,Traffic updates,Directions,Events from other stores,Promotions from other stores,Product availability from competitors,Pricing from competitors,Online shopping,External marketplaces,Medical advice,Health-related questions,Legal advice,Financial advice,Investment advice,Relationship advice,Emotional advice,Parenting questions,Personal life questions,Self-help guidance,Motivational guidance,Career advice,Job applications unrelated to the store,Science topics,Technology topics,Innovations,History,Geography,World knowledge,Politics,Government,Elections,Religion,Spirituality,Belief systems,Education unrelated to store training,Programming tutorials,AI tutorials,Technical tutorials,Violence,Abuse,Crime,Sexual content,Explicit discussions,Hate speech,Discriminatory remarks,Drugs,Alcohol,Illegal activity,Conspiracy theories,Unverified claims,Mentions of internet,Mentions of browsing,Mentions of Google,Mentions of ChatGPT,Mentions of Wikipedia,Mentions of being powered by AI,Mentions of AI,Mentions of updates,Mentions of plugins,Mentions of external data', '2025-05-21 20:35:46'),
(4, 'selected_restrictions', 'International news,Traffic updates,Directions,Events from other stores,Promotions from other stores,Product availability from competitors,Pricing from competitors,Online shopping,External marketplaces,Medical adviceOutside-the-store information,Local news,International news,Weather forecasts,Current conditions,Traffic updates,Directions,Events from other stores,Promotions from other stores,Product availability from competitors,Pricing from competitors,Online shopping,External marketplaces,Medical advice,Health-related questions,Legal advice,Financial advice,Investment advice,Relationship advice,Emotional advice,Parenting questions,Personal life questions,Self-help guidance,Motivational guidance,Career advice,Job applications unrelated to the store,Science topics,Technology topics,Innovations,History,Geography,World knowledge,Politics,Government,Elections,Religion,Spirituality,Belief systems,Education unrelated to store training,Programming tutorials,AI tutorials,Technical tutorials,Violence,Abuse,Crime,Sexual content,Explicit discussions,Hate speech,Discriminatory remarks,Drugs,Alcohol,Illegal activity,Conspiracy theories,Unverified claims,Mentions of internet,Mentions of browsing,Mentions of Google,Mentions of ChatGPT,Mentions of Wikipedia,Mentions of being powered by AI,Mentions of AI,Mentions of updates,Mentions of plugins,Mentions of external data', '2025-06-15 14:23:48'),
(5, 'active_model', 'tm-my-image-model (1)', '2025-06-03 13:37:53'),
(6, 'recognition', 'gemini', '2025-06-15 14:23:48');

-- --------------------------------------------------------

--
-- Table structure for table `uploaded_models`
--

CREATE TABLE `uploaded_models` (
  `id` int(11) NOT NULL,
  `filename` varchar(255) NOT NULL,
  `class` text DEFAULT NULL,
  `original_name` varchar(255) DEFAULT NULL,
  `extracted_path` varchar(500) NOT NULL,
  `zip_path` varchar(500) NOT NULL,
  `upload_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `uploaded_models`
--

INSERT INTO `uploaded_models` (`id`, `filename`, `class`, `original_name`, `extracted_path`, `zip_path`, `upload_date`) VALUES
(6, 'Test 1', 'Background, Mini Fan, Alcohol', 'Test 1.zip', '/Users/ernesto/Documents/Capstone Projects/Virtual Assistant/ml/model/Test 1', '/Users/ernesto/Documents/Capstone Projects/Virtual Assistant/ml/zip/Test 1.zip', '2025-05-31 10:19:19'),
(7, 'sample1', 'Alcohol, Sunglass, Background', 'sample1.zip', '/Users/ernesto/Documents/Capstone Projects/Virtual Assistant/ml/model/sample1', '/Users/ernesto/Documents/Capstone Projects/Virtual Assistant/ml/zip/sample1.zip', '2025-06-03 02:18:18'),
(8, 'sample2', 'Sunglass, Water Bottle, Background', 'sample2.zip', '/Users/ernesto/Documents/Capstone Projects/Virtual Assistant/ml/model/sample2', '/Users/ernesto/Documents/Capstone Projects/Virtual Assistant/ml/zip/sample2.zip', '2025-06-03 05:00:26'),
(9, 'tm-my-image-model', 'Sunglass, Water Bottle, Background, Bantam', 'tm-my-image-model.zip', '/Users/ernesto/Documents/Capstone Projects/Virtual Assistant/ml/model/tm-my-image-model', '/Users/ernesto/Documents/Capstone Projects/Virtual Assistant/ml/zip/tm-my-image-model.zip', '2025-06-03 05:27:40'),
(10, 'tm-my-image-model (1)', 'Sunglass, Water Bottle, Background, Slipper ', 'tm-my-image-model (1).zip', '/Users/ernesto/Documents/Capstone Projects/Virtual Assistant/ml/model/tm-my-image-model (1)', '/Users/ernesto/Documents/Capstone Projects/Virtual Assistant/ml/zip/tm-my-image-model (1).zip', '2025-06-03 05:37:34');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `middle_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `auth_token` varchar(255) DEFAULT NULL,
  `photo_url` varchar(2083) DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `last_updated` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `date_added` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `middle_name`, `last_name`, `phone`, `email`, `password`, `auth_token`, `photo_url`, `last_login`, `last_updated`, `date_added`) VALUES
(1, 'Admin', NULL, 'Administrator', '+63123123123', 'admin@gmail.com', '1234', 'ede54349-09cd-4928-a57c-99a15168be62', 'https://www.pngmart.com/files/21/Admin-Profile-Vector-PNG-Clipart.png', '2025-07-08 12:38:19', '2025-07-08 12:38:19', '2025-06-01 10:09:04');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `customer_queries`
--
ALTER TABLE `customer_queries`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `image_processing`
--
ALTER TABLE `image_processing`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `system_config`
--
ALTER TABLE `system_config`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `uploaded_models`
--
ALTER TABLE `uploaded_models`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `customer_queries`
--
ALTER TABLE `customer_queries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `image_processing`
--
ALTER TABLE `image_processing`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `system_config`
--
ALTER TABLE `system_config`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `uploaded_models`
--
ALTER TABLE `uploaded_models`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
