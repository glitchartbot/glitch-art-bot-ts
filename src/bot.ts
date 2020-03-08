import { readFileSync } from 'fs';
import * as TwitterLite from 'twitter-lite';
import * as utils from './util/utils';
import { keys } from './config';

const client = new TwitterLite(keys);