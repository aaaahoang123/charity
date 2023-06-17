CREATE TABLE `campaigns`
(
    `id`                      int(11) NOT NULL AUTO_INCREMENT COMMENT='ID đợt quyên góp, tự động tăng',
    `content`                 text         NOT NULL COMMENT='Nội dung hiển thị của đợt quyên góp, lưu text dưới dạng markdown',
    `created_at`              timestamp NULL DEFAULT NULL COMMENT='Thời gian tạo đợt quyên góp',
    `created_by_user_id`      varchar(255) NOT NULL COMMENT='ID tài khoản đã tạo đợt quyên góp, id này lấy từ user id của keycloak',
    `deadline`                date         NOT NULL COMMENT='Ngày đợt quyên góp hết hạn',
    `deleted_at`              timestamp NULL DEFAULT NULL COMMENT='Thời gian xoá đợt quyên góp, mặc định = null nếu chưa bị xoá (apply soft delete)',
    `description`             varchar(500) NOT NULL COMMENT='Mô tả vắn tắt đợt quyên góp',
    `images`                  varchar(2048) DEFAULT NULL COMMENT='Đường dẫn ảnh của đợt quyên góp, nếu có nhiều ảnh thì sẽ ngăn cách bằng dấu ","',
    `last_updated_by_user_id` varchar(255) NOT NULL COMMENT='Tương tự Id tài khoản tạo, nhưng là người update cuối',
    `organization_id`         int(11) NOT NULL COMMENT='Id của tổ chức/cá nhân tổ chức đợt quyên góp',
    `slug`                    varchar(300) NOT NULL COMMENT='Đường dẫn url của đợt quyên góp, thường được gen trực tiếp từ title',
    `status`                  enum('CLOSED','INITIAL','OPENING','OUT_DATED') NOT NULL COMMENT='Trạng thái đợt quyên góp',
    `target_amount`           bigint(20) NOT NULL COMMENT='Số tiền cần quyên góp',
    `title`                   varchar(255) NOT NULL COMMENT='Tiêu đề đợt quyên góp',
    `updated_at`              timestamp NULL DEFAULT NULL COMMENT='Thời gian cập nhật lần cuối',
    `total_donations`         int(11) NOT NULL COMMENT='Số lượt đã quyên góp, cần khớp với bảng donations',
    `total_received_amount`   bigint(20) NOT NULL COMMENT='Số tiền đã quyên góp, cần khớp với bảng donations',
    PRIMARY KEY (`id`),
    UNIQUE KEY `UK_g6ksjym2qdcby6fhnogyttus8` (`slug`),
    KEY                       `FKsatdia4ouyp8u32ivbg3k3q11` (`organization_id`),
    KEY                       `IDXd1moluodbgax5n8hej9ias8ot` (`created_by_user_id`),
    KEY                       `IDXayu5rx7o3oui4mt4pav4bsdhr` (`last_updated_by_user_id`),
    CONSTRAINT `FKsatdia4ouyp8u32ivbg3k3q11` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`)
) COMMENT='Đợt quyên góp';

CREATE TABLE `donations`
(
    `id`                   bigint(20) NOT NULL AUTO_INCREMENT COMMENT='Id lượt quyên góp, tự tăng',
    `amount`               bigint(20) NOT NULL COMMENT='Số tiền quyên góp',
    `created_at`           timestamp NULL DEFAULT NULL COMMENT='Thời gian tạo bản ghi',
    `deleted_at`           timestamp NULL DEFAULT NULL COMMENT='Thời gian xoá bản ghi (soft delete)',
    `donor_id`             int(11) NOT NULL COMMENT='ID Người quyên góp',
    `message`              varchar(500) DEFAULT NULL COMMENT='Lời nhắn quyên góp',
    `status`               enum('CONFIRMED','INITIAL','PROVIDER_TRANSACTION_CREATED','REJECTED') NOT NULL COMMENT='Trạng thái quyên góp',
    `transaction_code`     varchar(255) DEFAULT NULL COMMENT='Mã giao dịch (Có thể lấy từ ngân hàng)',
    `updated_at`           timestamp NULL DEFAULT NULL COMMENT='Thời gian cập nhật lần cuối',
    `confirmed_at`         timestamp NULL DEFAULT NULL COMMENT='Thời gian giao dịch được xác nhận',
    `transaction_provider` enum('MOMO','PAYPAL','TRANSFER','VN_PAY') DEFAULT NULL COMMENT='Nguồn thanh toán',
    `campaign_id`          int(11) NOT NULL COMMENT='Id đợt quyên góp',
    PRIMARY KEY (`id`),
    KEY                    `FK1xqpcjicjb1juat5f8itmxj2t` (`donor_id`),
    KEY                    `FKr5m6trggwgkgoanlalgea1psh` (`campaign_id`),
    CONSTRAINT `FK1xqpcjicjb1juat5f8itmxj2t` FOREIGN KEY (`donor_id`) REFERENCES `donors` (`id`),
    CONSTRAINT `FKr5m6trggwgkgoanlalgea1psh` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns` (`id`)
) COMMENT='Lượt quyên góp';

CREATE TABLE `donors`
(
    `id`                 int(11) NOT NULL AUTO_INCREMENT COMMENT='Id Người quyên góp',
    `email`              varchar(255) DEFAULT NULL COMMENT='Email người quyên góp',
    `name`               varchar(255) NOT NULL COMMENT='Tên người quyên góp',
    `phone_number`       varchar(255) DEFAULT NULL COMMENT='SDT người quyên góp',
    `created_at`         timestamp NULL DEFAULT NULL COMMENT='Thời gian tạo bản ghi',
    `deleted_at`         timestamp NULL DEFAULT NULL COMMENT='Thời gian xoá bản ghi (soft delete)',
    `updated_at`         timestamp NULL DEFAULT NULL COMMENT='Thời gian cập nhật thông tin lần cuối',
    `created_by_user_id` varchar(50)  DEFAULT NULL COMMENT='Id user đã tạo bản ghi (Có thể null nếu tài khoản quyên góp khi chưa đăng nhập)',
    PRIMARY KEY (`id`),
    KEY                  `IDX7x7qjdirb39rysoc7abs3isen` (`created_by_user_id`)
) COMMENT='Người quyên góp';

CREATE TABLE `organizations`
(
    `id`           int(11) NOT NULL AUTO_INCREMENT COMMENT='Id tổ chức',
    `avatar`       varchar(255) DEFAULT NULL COMMENT='Avatar/Logo tổ chức',
    `email`        varchar(255) DEFAULT NULL COMMENT='Email đại diện',
    `name`         varchar(255) NOT NULL COMMENT='Tên tổ chức/cá nhân',
    `phone_number` varchar(255) NOT NULL COMMENT='SDT',
    `created_at`   timestamp NULL DEFAULT NULL COMMENT='Thời gian tạo',
    `deleted_at`   timestamp NULL DEFAULT NULL COMMENT='Thời gian xoá',
    `updated_at`   timestamp NULL DEFAULT NULL COMMENT='Thời gian chỉnh sửa lần cuối',
    PRIMARY KEY (`id`)
) COMMENT='Tổ chức/Cá nhân quyên góp';

CREATE TABLE `subscribers`
(
    `id`          int(11) NOT NULL AUTO_INCREMENT COMMENT='ID tự generate',
    `campaign_id` int(11) NOT NULL COMMENT='Id đợt quyên góp',
    `user_id`     varchar(50) NOT NULL COMMENT='Id user đã theo dõi đợt quyên góp',
    PRIMARY KEY (`id`),
    KEY           `IDXi9nkq1al1yxxf8alvi2g4d7qd` (`user_id`),
    KEY           `FK7u72ib2tlscxeliuu5sd3kirn` (`campaign_id`),
    CONSTRAINT `FK7u72ib2tlscxeliuu5sd3kirn` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns` (`id`)
) COMMENT='Bảng trung gian chứng minh việc theo dõi của user với đợt quyên góp';
