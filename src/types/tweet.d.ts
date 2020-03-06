export interface GeoCoordinates {
  coordinates: [number, number] | [number, number][] | [number, number][][],
  type: string
}

export interface Geo {
  country: string,
  country_code: string,
  locality: string,
  region: string,
  sub_region: string,
  full_name: string,
  geo: GeoCoordinates
}

export interface User {
  id: number, 
  id_str: string,
  name: string,
  screen_name: string,
  location?: string,
  derived: Geo[],
  url?: string,
  description?: string,
  protected: boolean,
  verified: boolean,
  followers_count: number,
  friends_count: number,
  listed_count: number,
  favourites_count: number,
  statuses_count: number,
  created_at: string,
  profile_banner_url: string,
  profile_image_url_https: string,
  default_profile: boolean,
  default_profile_image: boolean,
  withheld_in_countries?: string[],
  withheld_scope?: string
}

export interface Place {
  id: string,
  url: string,
  place_type: string,
  name: string,
  full_name: string,
  country_code: string,
  country: string,
  bounding_box: GeoCoordinates,
  attributes?: object
}

export interface Hashtag {
  indices: number[],
  text: string
}

export interface Sizes {
  thumb: Size,
  large: Size,
  medium: Size,
  small: Size
}

export interface Size {
  w: number,
  h: number,
  resize: "crop" | "fit"
}

export interface Media {
  display_url: string,
  expanded_url: string,
  id: number,
  id_str: string,
  indices: number[],
  media_url: string,
  media_url_https: string,
  sizes: Sizes,
  source_status_id: number,
  source_status_id_str: string,
  type: "photo" | "video" | "animated_gif",
  url: string
}

export interface Unwound {
  url: string,
  status: number,
  title: string,
  description: string
}

export interface Url {
  display_url: string,
  expanded_url: string,
  indices: number[],
  url: string,
  unwound: Unwound
}

export interface UserMention {
  id: number,
  id_str: string,
  indices: number[],
  name: string,
  screen_name: string
}

export interface TSymbol {
  indices: number[],
  text: string
}

export interface PollOption {
  position: number,
  text: string
}

export interface Poll {
  options: PollOption[],
  end_datetime: string,
  duration_minutes: string
}

export interface Entities {
  hashtags: Hashtag[],
  media: Media[],
  urls: Url[],
  user_mentions: UserMention[],
  symbols: TSymbol[],
  polls: Poll[]
}

export interface MatchingRule {
  tag: string,
  id: number,
  id_str: string
}

export interface Tweet {
  created_at: string,
  id: number, 
  id_str: string,
  text: string,
  source: string,
  truncated: boolean,
  in_reply_to_status_id?: number,
  in_reply_to_status_id_str?: string,
  in_reply_to_user_id?: number,
  in_reply_to_user_id_str?: string,
  in_reply_to_screen_name?: string,
  user: User,
  coordinates?: GeoCoordinates,
  place?: Place,
  quoted_status_id: number,
  quoted_status_id_str: string,
  is_quote_status: boolean,
  quoted_status?: Tweet,
  retweeted_status?: Tweet,
  quote_count?: number,
  reply_count?: number,
  retweet_count: number,
  favorite_count?: number,
  entities: Entities,
  extended_entities: Media[],
  favorited: boolean,
  retweeted: boolean,
  possibly_sensitive: boolean,
  filter_level: "none" | "low" | "medium" | "high",
  lang: string,
  matching_rules: MatchingRule[]
}