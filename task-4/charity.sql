-- MariaDB dump 10.19  Distrib 10.11.2-MariaDB, for debian-linux-gnu (aarch64)
--
-- Host: localhost    Database: charity
-- ------------------------------------------------------
-- Server version	10.11.2-MariaDB-1:10.11.2+maria~ubu2204

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `campaigns`
--

DROP TABLE IF EXISTS `campaigns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `campaigns` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT = 'ID đợt quyên góp, tự động tăng',
  `content` text NOT NULL COMMENT = 'Nội dung hiển thị của đợt quyên góp, lưu text dưới dạng markdown',
  `created_at` timestamp NULL DEFAULT NULL COMMENT = 'Thời gian tạo đợt quyên góp',
  `created_by_user_id` varchar(255) NOT NULL COMMENT = 'ID tài khoản đã tạo đợt quyên góp, id này lấy từ user id của keycloak',
  `deadline` date NOT NULL COMMENT = 'Ngày đợt quyên góp hết hạn',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT = 'Thời gian xoá đợt quyên góp, mặc định = null nếu chưa bị xoá (apply soft delete)',
  `description` varchar(500) NOT NULL COMMENT = 'Mô tả vắn tắt đợt quyên góp',
  `images` varchar(2048) DEFAULT NULL COMMENT = 'Đường dẫn ảnh của đợt quyên góp, nếu có nhiều ảnh thì sẽ ngăn cách bằng dấu ","',
  `last_updated_by_user_id` varchar(255) NOT NULL COMMENT = 'Tương tự Id tài khoản tạo, nhưng là người update cuối',
  `organization_id` int(11) NOT NULL COMMENT = 'Id của tổ chức/cá nhân tổ chức đợt quyên góp',
  `slug` varchar(300) NOT NULL COMMENT = 'Đường dẫn url của đợt quyên góp, thường được gen trực tiếp từ title',
  `status` enum('CLOSED','INITIAL','OPENING','OUT_DATED') NOT NULL COMMENT = 'Trạng thái đợt quyên góp',
  `target_amount` bigint(20) NOT NULL COMMENT = 'Số tiền cần quyên góp',
  `title` varchar(255) NOT NULL COMMENT = 'Tiêu đề đợt quyên góp',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT = 'Thời gian cập nhật lần cuối',
  `total_donations` int(11) NOT NULL COMMENT = 'Số lượt đã quyên góp, cần khớp với bảng donations',
  `total_received_amount` bigint(20) NOT NULL COMMENT = 'Số tiền đã quyên góp, cần khớp với bảng donations',
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_g6ksjym2qdcby6fhnogyttus8` (`slug`),
  KEY `FKsatdia4ouyp8u32ivbg3k3q11` (`organization_id`),
  KEY `IDXd1moluodbgax5n8hej9ias8ot` (`created_by_user_id`),
  KEY `IDXayu5rx7o3oui4mt4pav4bsdhr` (`last_updated_by_user_id`),
  CONSTRAINT `FKsatdia4ouyp8u32ivbg3k3q11` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT = 'Đợt quyên góp';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `campaigns`
--

LOCK TABLES `campaigns` WRITE;
/*!40000 ALTER TABLE `campaigns` DISABLE KEYS */;
INSERT INTO `campaigns` VALUES
(1,'Em xứng đáng được trao một tương lai tươi sáng \n\nDương Thanh Trường là một cậu bé năm nay đã 13 tuổi, đến vá vòm trong chương trình đầu tháng 5 tại bệnh viện Đại học Y dược thành phố Hồ Chí Minh. Sinh ra với dị tật hở môi và hở hàm ếch, mẹ của Trường bỏ em lại với ba và bà nội. Vì nhà khó khăn, ba của em đi làm thợ hồ ở Bình Dương để có tiền trang trải. Đều đặn mỗi tháng anh đều gửi tiền về cho hai bà cháu, nhưng cũng mấy tháng mới tranh thủ về thăm mẹ, thăm con được một lần. Thế nên hai bà cháu nương tựa vào nhau suốt bao năm nay. Để có thêm tiền chợ, bà nội hàng ngày đều đi lựa mủ cao su, nhận được một ngày 65 ngàn đồng. \n\nNăm 10 tuổi, em mới được đi vá môi ở Long Xuyên lần đầu. Và đến nay, đây là lần thứ 2 em được điều trị, lần này các bác sĩ giúp em phẫu thuật vá vòm. Điều chúng tôi muốn kể trong câu chuyện này hơn cả hoàn cảnh khó khăn, ngặt nghèo mà gia đình phải trải qua, đó chính là cậu bé Trường. Trong phòng hậu phẫu, chúng tôi ngồi hỏi chuyện bà trong khi chờ em tỉnh lại. Mặc dù còn mê man chưa tỉnh hẳn, nhưng chúng tôi vẫn nhìn thấy rõ hai hàng nước mắt em lăn dài xuống gối. Có những đứa trẻ hiểu chuyện đến đau lòng như vậy. Lớn lên với những dị tật, trong sự thiếu thốn tình yêu thương của mẹ, cha lại không ở bên cạnh. Niềm an ủi lớn nhất của em chắc hẳn là bà nội, và niềm ao ước được trở thành một người bình thường, một cuộc sống không còn những cảnh thiếu thốn cái ăn, cái mặc và cơ hội được học hành như bao bạn bè khác.\n\n![](https://static-ved.topcv.vn/44/01/44015933b5d3c27133fb735789c60538.png)\nEm Trường và bà nội trong ca phẫu thuật bệnh viện Đại học Y dược thành phố Hồ Chí Minh\n\nThật khó để có thể bù đắp lại hết được những mất mát mà tuổi ấu thơ em đã trải qua. Thế nhưng, cùng chung tay chúng ta có thể giúp cho những đứa trẻ như Trường được tiếp cận với những ca phẫu thuật miễn phí, an toàn, trả lại cho em một cơ thể bình thường. Từ đó, giúp các em sẽ mạnh mẽ vượt lên nghịch cảnh để có một tương lai tốt đẹp hơn.\n\n![](https://static-ved.topcv.vn/58/f5/58f5676773300114c57fb1352cb1ee51.png)\nCùng Operation Smile Vietnam mang đến nhiều ca phẫu thuật miễn phí cho các em nhỏ kém may mắn\n\nTrong tháng 5 này, Siêu ứng dụng MoMo kết hợp cùng Operation Smile Vietnam kêu gọi cộng đồng các nhà hảo tâm, các mạnh thường quân cùng chung tay quyên góp 200.000.000 đồng tương đương với 20 em bé nhận được cơ hội phẫu thuật. Chúng tôi rất mong sẽ tiếp tục nhận được sự chia sẻ của cộng đồng MoMo cho các em bé và gia đình để các em tiến lên và bước tiếp cuộc đời mình một cách suôn sẻ hơn. Hãy cùng chúng tôi giúp đỡ thêm nhiều mảnh đời nhỏ kém may mắn, để các em có thể sống một cuộc đời trọn vẹn hơn và hạnh phúc hơn.','2023-06-13 11:15:59','a68451a1-f57b-4de4-b2e7-883a158871d9','2023-07-31',NULL,'❤️ Mỗi cuộc phẫu thuật sẽ giúp các em nhỏ kém may mắn có cơ hội tiến lên và bước tiếp cuộc đời mình một cách suôn sẻ hơn.','63/e3/63e3b546e339687b0fa1a60790036ae0.jpeg,9d/32/9d32e85b0c6670319e8d2cf81448f0ee.jpeg','a68451a1-f57b-4de4-b2e7-883a158871d9',1,'chung-tay-thap-sang-20-nu-cuoi-cho-cac-em-be-mang-di-tat-ham-mat-cung-operation-smile-vietnam','INITIAL',1000000000,'Chung tay thắp sáng 20 nụ cười cho các em bé mang dị tật hàm mặt cùng Operation Smile Vietnam','2023-06-13 11:15:59',0,0),
(2,'Content test','2023-06-13 15:14:30','user','2023-06-12',NULL,'Test123','1.png','a68451a1-f57b-4de4-b2e7-883a158871d9',2,'chan-che','INITIAL',12345,'Chan che','2023-06-14 23:00:39',0,0),
(3,'Content test','2023-06-13 15:19:35','user','2023-06-11',NULL,'Test1','1.png','a68451a1-f57b-4de4-b2e7-883a158871d9',3,'chan-che-2023-06-13-15-19-35','INITIAL',123457888787,'No xôi chán chè','2023-06-14 23:01:30',0,0),
(4,'Content test','2023-06-13 15:21:39','user','2023-06-13','2023-06-14 14:36:47','Test1','1.png','user',4,'chan-che-2023-06-13-15-21-39','INITIAL',12345,'Chan che','2023-06-13 15:21:39',0,0),
(5,'Content test','2023-06-13 15:23:46','user','2023-06-13','2023-06-14 14:36:42','Test1','1.png','user',5,'chan-che-2023-06-13-15-23-46','INITIAL',12345,'Chan che','2023-06-13 15:23:46',0,0),
(6,'Content test','2023-06-13 15:24:09','user','2023-06-13','2023-06-14 14:36:54','Test1','1.png','user',6,'chan-che-2023-06-13-15-24-09','INITIAL',12345,'Chan che','2023-06-13 15:24:09',0,0),
(7,'Content test','2023-06-13 16:08:43','user','2023-06-13','2023-06-14 10:47:05','Test1','1.png','user',7,'chan-che-2023-06-13-16-08-43','INITIAL',12345,'Chan che','2023-06-13 16:08:43',0,0),
(8,'Content test','2023-06-13 17:33:29','user','2023-06-13','2023-06-14 14:36:50','Test1','1.png','user',8,'chan-che-2023-06-13-17-33-29','INITIAL',12345,'Chan che','2023-06-13 17:33:29',0,0),
(9,'Content test','2023-06-14 09:26:25','user','2023-06-14','2023-06-14 10:41:40','Test1','1.png','user',9,'chan-che-2023-06-14-09-26-25','INITIAL',12345,'Chan che','2023-06-14 09:26:25',0,0),
(10,'Content test','2023-06-14 14:50:34','user','2023-06-14','2023-06-14 10:40:55','Test1','1.png','user',10,'chan-che-2023-06-14-14-50-34','INITIAL',12345,'Chan che','2023-06-14 14:50:34',0,0),
(11,'Content test','2023-06-14 14:56:20','user','2023-06-14','2023-06-14 10:42:51','Test1','1.png','user',11,'chan-che-2023-06-14-14-56-20','INITIAL',12345,'Chan che','2023-06-14 14:56:20',0,0);
/*!40000 ALTER TABLE `campaigns` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `donations`
--

DROP TABLE IF EXISTS `donations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `donations` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT = 'Id lượt quyên góp, tự tăng',
  `amount` bigint(20) NOT NULL COMMENT = 'Số tiền quyên góp',
  `created_at` timestamp NULL DEFAULT NULL COMMENT = 'Thời gian tạo bản ghi',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT = 'Thời gian xoá bản ghi (soft delete)',
  `donor_id` int(11) NOT NULL COMMENT = 'ID Người quyên góp',
  `message` varchar(500) DEFAULT NULL COMMENT = 'Lời nhắn quyên góp',
  `status` enum('CONFIRMED','INITIAL','PROVIDER_TRANSACTION_CREATED','REJECTED') NOT NULL COMMENT = 'Trạng thái quyên góp',
  `transaction_code` varchar(255) DEFAULT NULL COMMENT = 'Mã giao dịch (Có thể lấy từ ngân hàng)',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT = 'Thời gian cập nhật lần cuối',
  `confirmed_at` timestamp NULL DEFAULT NULL COMMENT = 'Thời gian giao dịch được xác nhận',
  `transaction_provider` enum('MOMO','PAYPAL','TRANSFER','VN_PAY') DEFAULT NULL COMMENT = 'Nguồn thanh toán',
  `campaign_id` int(11) NOT NULL COMMENT = 'Id đợt quyên góp',
  PRIMARY KEY (`id`),
  KEY `FK1xqpcjicjb1juat5f8itmxj2t` (`donor_id`),
  KEY `FKr5m6trggwgkgoanlalgea1psh` (`campaign_id`),
  CONSTRAINT `FK1xqpcjicjb1juat5f8itmxj2t` FOREIGN KEY (`donor_id`) REFERENCES `donors` (`id`),
  CONSTRAINT `FKr5m6trggwgkgoanlalgea1psh` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT = 'Lượt quyên góp';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `donations`
--

LOCK TABLES `donations` WRITE;
/*!40000 ALTER TABLE `donations` DISABLE KEYS */;
INSERT INTO `donations` VALUES
(1,100000,'2023-06-17 11:26:07',NULL,1,'Ung ho em','CONFIRMED','123','2023-06-17 11:26:42','2023-06-17 11:26:42','MOMO',1);
/*!40000 ALTER TABLE `donations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `donors`
--

DROP TABLE IF EXISTS `donors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `donors` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT = 'Id Người quyên góp',
  `email` varchar(255) DEFAULT NULL COMMENT = 'Email người quyên góp',
  `name` varchar(255) NOT NULL COMMENT = 'Tên người quyên góp',
  `phone_number` varchar(255) DEFAULT NULL COMMENT = 'SDT người quyên góp',
  `created_at` timestamp NULL DEFAULT NULL COMMENT = 'Thời gian tạo bản ghi',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT = 'Thời gian xoá bản ghi (soft delete)',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT = 'Thời gian cập nhật thông tin lần cuối',
  `created_by_user_id` varchar(50) DEFAULT NULL COMMENT = 'Id user đã tạo bản ghi (Có thể null nếu tài khoản quyên góp khi chưa đăng nhập)',
  PRIMARY KEY (`id`),
  KEY `IDX7x7qjdirb39rysoc7abs3isen` (`created_by_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT = 'Người quyên góp';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `donors`
--

LOCK TABLES `donors` WRITE;
/*!40000 ALTER TABLE `donors` DISABLE KEYS */;
INSERT INTO `donors` VALUES
(1,'hoangdo.2194@yahoo.com','Do Hoang','0987654321','2023-06-17 11:23:23',NULL,'2023-06-17 11:23:31','a68451a1-f57b-4de4-b2e7-883a158871d9');
/*!40000 ALTER TABLE `donors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `organizations`
--

DROP TABLE IF EXISTS `organizations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `organizations` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT = 'Id tổ chức',
  `avatar` varchar(255) DEFAULT NULL COMMENT = 'Avatar/Logo tổ chức',
  `email` varchar(255) DEFAULT NULL COMMENT = 'Email đại diện',
  `name` varchar(255) NOT NULL COMMENT = 'Tên tổ chức/cá nhân',
  `phone_number` varchar(255) NOT NULL COMMENT = 'SDT',
  `created_at` timestamp NULL DEFAULT NULL COMMENT = 'Thời gian tạo',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT = 'Thời gian xoá',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT = 'Thời gian chỉnh sửa lần cuối',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT = 'Tổ chức/Cá nhân quyên góp';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `organizations`
--

LOCK TABLES `organizations` WRITE;
/*!40000 ALTER TABLE `organizations` DISABLE KEYS */;
INSERT INTO `organizations` VALUES
(1,'4b/83/4b832cb53c8914f3202680dc73d476cd.jpeg','opensmile@gmail.com','Operation Smile','0987654321','2023-06-13 11:15:59',NULL,'2023-06-13 11:15:59'),
(2,'123.png','2@gmail.com','tcv','0987654321','2023-06-13 15:14:30',NULL,'2023-06-13 15:14:30'),
(3,'123.png','2@gmail.com','tcv','0987654321','2023-06-13 15:19:34',NULL,'2023-06-13 15:19:34'),
(4,'123.png','2@gmail.com','tcv','0987654321','2023-06-13 15:21:39',NULL,'2023-06-13 15:21:39'),
(5,'123.png','2@gmail.com','tcv','0987654321','2023-06-13 15:23:46',NULL,'2023-06-13 15:23:46'),
(6,'123.png','2@gmail.com','tcv','0987654321','2023-06-13 15:24:09',NULL,'2023-06-13 15:24:09'),
(7,'123.png','2@gmail.com','tcv','0987654321','2023-06-13 16:08:43',NULL,'2023-06-13 16:08:43'),
(8,'123.png','2@gmail.com','tcv','0987654321','2023-06-13 17:33:29',NULL,'2023-06-13 17:33:29'),
(9,'123.png','2@gmail.com','tcv','0987654321','2023-06-14 09:26:25',NULL,'2023-06-14 09:26:25'),
(10,'123.png','2@gmail.com','tcv','0987654321','2023-06-14 14:50:34',NULL,'2023-06-14 14:50:34'),
(11,'123.png','2@gmail.com','tcv','0987654321','2023-06-14 14:56:20',NULL,'2023-06-14 14:56:20');
/*!40000 ALTER TABLE `organizations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscribers`
--

DROP TABLE IF EXISTS `subscribers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `subscribers` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT = 'ID tự generate',
  `campaign_id` int(11) NOT NULL COMMENT = 'Id đợt quyên góp',
  `user_id` varchar(50) NOT NULL COMMENT = 'Id user đã theo dõi đợt quyên góp',
  PRIMARY KEY (`id`),
  KEY `IDXi9nkq1al1yxxf8alvi2g4d7qd` (`user_id`),
  KEY `FK7u72ib2tlscxeliuu5sd3kirn` (`campaign_id`),
  CONSTRAINT `FK7u72ib2tlscxeliuu5sd3kirn` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT = 'Bảng trung gian chứng minh việc theo dõi của user với đợt quyên góp';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscribers`
--

LOCK TABLES `subscribers` WRITE;
/*!40000 ALTER TABLE `subscribers` DISABLE KEYS */;
INSERT INTO `subscribers` VALUES
(1,1,'a68451a1-f57b-4de4-b2e7-883a158871d9');
/*!40000 ALTER TABLE `subscribers` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-06-17  4:31:20
