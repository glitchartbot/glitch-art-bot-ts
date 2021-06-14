import { ValueType, ValueBoundary } from '../types/sketch'

export const invalidValues = (type: ValueType, prop: string, allowed: ValueBoundary) =>
  `Invalid value for '${prop}', this option ${
    type === 'allowed' ? 'accepts' : 'must be between these numbers'
  }: ${allowed.join(', ')}`;

export default {
  standard: 'Here is your glitched image :)',
  invalidImage: 'No valid image found in the parent tweet',
  defaultConfig:
    'No valid configuration found, using default config.\nFor more information on using custom options, visit https://github.com/glitchartbot/glitch-art-bot-scripts',
  invalidSketch:
    'No sketch found with this name, visit https://github.com/glitchartbot/glitch-art-bot-scripts for available scripts',
  orphanTweet:
    'No parent tweet found, for more information on the bot usage, visit https://github.com/glitchartbot/glitch-art-bot-scripts',
};