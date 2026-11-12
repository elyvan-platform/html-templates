export const THUMBNAIL_DIR = "src/_thumbnails";
export const THUMBNAIL_WIDTHS = [480, 960];
// Source screenshots are 1440 × 900 (16:10); both dimensions are reserved on the <img>.
export const THUMBNAIL_SIZE = { width: 960, height: 600 };
// Encoder arguments for ImageMagick, keyed by file extension.
export const THUMBNAIL_FORMATS = {
  avif: ["-quality", "50"],
  webp: ["-quality", "78"],
  jpg: ["-quality", "78", "-interlace", "Plane"],
};
