package vn.edu.funix.charity.common.util;

import java.text.Normalizer;
import java.util.Locale;
import java.util.regex.Pattern;

public class StringToSlug {
    private static final Pattern WHITESPACE = Pattern.compile(" ");
    private static final Pattern UNICODE = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
    private static final Pattern D_CHARACTER = Pattern.compile("[đĐ]");

    /**
     *
     * @param input - the input string
     * @param whiteSpace - the character you want to replace to space
     * @return the string that compile to slug
     */
    public static String compile(String input, String whiteSpace) {
        Pattern nonLatin = Pattern.compile("[^\\w" + whiteSpace + "]");

        String result = WHITESPACE.matcher(input).replaceAll(whiteSpace);
        result = Normalizer.normalize(result, Normalizer.Form.NFD);
        result = UNICODE.matcher(result).replaceAll("");
        result = D_CHARACTER.matcher(result).replaceAll("d");
        result = nonLatin.matcher(result).replaceAll(whiteSpace);
        return result.toLowerCase(Locale.ENGLISH);
    }

    public static String compile(String input) {
        return compile(input, "-");
    }
}
