/**
 * Image Asset
 *
 * Abstract representation of an image that can come from different sources:
 * - Local file system (/public/images)
 * - CMS CDN (Strapi, Sanity)
 * - External CDN (Cloudinary, imgix)
 *
 * The adapter layer transforms CMS-specific image objects to this interface.
 */
export interface ImageAsset {
  /** Absolute URL to the image */
  url: string

  /** Alt text for accessibility and SEO */
  alt: string

  /** Optional width in pixels */
  width?: number

  /** Optional height in pixels */
  height?: number

  /** Optional blur data URL for placeholder */
  blurDataURL?: string

  /** Optional caption/credit */
  caption?: string
}
