package vn.edu.funix.charity.common.util;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAccessor;

public class DateTimeUtils {
    private static final DateTimeFormatter BASIC_FORMATTER = DateTimeFormatter.ofPattern("HH:mm dd/MM/yyyy");
    private static final DateTimeFormatter BASIC_DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final ZoneOffset ZONE_OFFSET = OffsetDateTime.now().getOffset();

    public static String formatDateTime(TemporalAccessor dateTime) {
        return BASIC_FORMATTER.format(dateTime);
    }

    public static String formatDateTime(TemporalAccessor dateTime, String format) {
        return formatDateTime(dateTime, DateTimeFormatter.ofPattern(format));
    }

    public static String formatDateTime(TemporalAccessor dateTime, DateTimeFormatter format) {
        return format.format(dateTime);
    }

    public static String formatDate(TemporalAccessor date) {
        return BASIC_DATE_FORMATTER.format(date);
    }

    public static LocalDateTime startOfMonth(LocalDateTime dateTime) {
        return LocalDateTime.of(dateTime.getYear(), dateTime.getMonth(), 1, 0, 0, 0);
    }

    public static LocalDateTime startOfDay(LocalDateTime dateTime) {
        return LocalDateTime.of(dateTime.getYear(), dateTime.getMonth(), dateTime.getDayOfMonth(), 0, 0, 0);
    }

    public static LocalDateTime getDateTimeFromMs(long ms) {
        return LocalDateTime.ofInstant(Instant.ofEpochMilli(ms), ZoneId.systemDefault());
    }

    public static LocalDateTime addDays(LocalDateTime dateTime, long days) {
        long ms = dateTime.toEpochSecond(ZONE_OFFSET) * 1000;
        return getDateTimeFromMs(ms + days * 24 * 60 * 60 * 1000);
    }

    public static LocalDateTime addDay(LocalDateTime dateTime) {
        return addDays(dateTime, 1);
    }

    public static LocalDateTime subDays(LocalDateTime dateTime, long days) {
        return addDays(dateTime, -days);
    }

    public static LocalDateTime subDay(LocalDateTime dateTime) {
        return subDays(dateTime, 1);
    }

    public static LocalDateTime endOfMonth(LocalDateTime dateTime) {
        int lastDayOfMonth = YearMonth.of(dateTime.getYear(), dateTime.getMonth()).lengthOfMonth();
        return LocalDateTime.of(dateTime.getYear(), dateTime.getMonth(), lastDayOfMonth, 23, 59, 59);
    }

    public static LocalDateTime endOfDay(LocalDateTime dateTime) {
        return LocalDateTime.of(dateTime.getYear(), dateTime.getMonth(), dateTime.getDayOfMonth(), 23, 59, 59);
    }
}
