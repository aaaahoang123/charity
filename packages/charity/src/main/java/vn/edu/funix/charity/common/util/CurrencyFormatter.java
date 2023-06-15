package vn.edu.funix.charity.common.util;

import java.text.NumberFormat;
import java.util.Locale;

public interface CurrencyFormatter {
    default String formatCurrency(Object num) {
        Locale locale = new Locale("vi", "VN");
        NumberFormat numberFormat = NumberFormat.getCurrencyInstance(locale);
        return numberFormat.format(num);
    }
}
