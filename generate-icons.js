import sharp from "sharp";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync, mkdirSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = [192, 512];
const sourceFile = join(__dirname, "public", "tomato.svg");

// Ensure icons directory exists
const iconsDir = join(__dirname, "public", "icons");
if (!existsSync(iconsDir)) {
  mkdirSync(iconsDir, { recursive: true });
}

async function generateIcons() {
  try {
    // Generate Android Chrome icons
    for (const size of sizes) {
      await sharp(sourceFile)
        .resize(size, size)
        .png()
        .toFile(
          join(__dirname, "public", `android-chrome-${size}x${size}.png`)
        );
      console.log(`Generated ${size}x${size} icon`);
    }

    // Generate shortcut icons
    const shortcutSizes = [96];
    for (const size of shortcutSizes) {
      await sharp(sourceFile)
        .resize(size, size)
        .png()
        .toFile(join(__dirname, "public", "icons", `diagnosis.png`));
      await sharp(sourceFile)
        .resize(size, size)
        .png()
        .toFile(join(__dirname, "public", "icons", `insights.png`));
      console.log(`Generated ${size}x${size} shortcut icons`);
    }

    console.log("All icons generated successfully!");
  } catch (error) {
    console.error("Error generating icons:", error);
  }
}

generateIcons();
