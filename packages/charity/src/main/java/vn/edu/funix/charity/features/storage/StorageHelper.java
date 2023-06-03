package vn.edu.funix.charity.features.storage;

import org.springframework.stereotype.Component;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

@Component
public class StorageHelper {
    public InputStream tryResizeImage(InputStream inputStream, Integer maxWidth, String fileExtension) throws IOException {
        BufferedImage originalBufferedImage = ImageIO.read(inputStream);

        // Is not an image and can not be compressed
        if (originalBufferedImage == null) {
            return inputStream;
        }

        int originalWidth = originalBufferedImage.getWidth();
        int originalHeight = originalBufferedImage.getHeight();

        var width = originalWidth;
        var height = originalHeight;

        if (maxWidth != null && maxWidth < width) {
            height = (int) Math.round((double) originalHeight * Double.valueOf(maxWidth) / (double) width);
            width = maxWidth;
        }

        BufferedImage compressedImage = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);

        var pixels = new int[width * height];
        compressedImage.setRGB(0, 0, width, height, pixels, 0, width);

        var graphics = compressedImage.createGraphics();
        graphics.drawImage(originalBufferedImage, 0, 0, width, height, null);
        graphics.dispose();
        graphics.setComposite(AlphaComposite.Src);
        graphics.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        graphics.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
        graphics.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        return bufferedImageToInputStream(compressedImage, fileExtension);
    }

    protected InputStream bufferedImageToInputStream(BufferedImage bufferedImage, String fileExtension) throws IOException {
        ByteArrayOutputStream os = new ByteArrayOutputStream();
        ImageIO.write(bufferedImage, fileExtension, os);
        return new ByteArrayInputStream(os.toByteArray());
    }

}
