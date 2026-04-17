CREATE TABLE `available_days` (
  `day_id` tinyint NOT NULL AUTO_INCREMENT,
  `day_name` varchar(10) NOT NULL,
  PRIMARY KEY (`day_id`),
  UNIQUE KEY `day_name` (`day_name`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
