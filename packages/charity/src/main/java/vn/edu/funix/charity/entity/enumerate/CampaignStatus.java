package vn.edu.funix.charity.entity.enumerate;

public enum CampaignStatus {
    INITIAL, OPENING, COMPLETED, CLOSED;

    public String getText() {
        return switch (this) {
            case INITIAL -> "Mới tạo";
            case OPENING -> "Đang quyên góp";
            case COMPLETED -> "Kết thúc quyên góp";
            case CLOSED -> "Đóng quyên góp";
        };
    }
}
