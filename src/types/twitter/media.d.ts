export interface UploadedMedia {
  media_id: number;
  media_id_string: string;
  media_key: string;
  size: number;
  expires_after_secs: number;
  image: Image;
}

export interface Image {
  image_type: string;
  w: number;
  h: number;
}
