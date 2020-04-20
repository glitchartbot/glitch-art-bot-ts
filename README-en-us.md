# glitch-art-bot-ts

Twitter bot (@GlitchArtBot) that applies glitch art effects in images.

## How it works

The bot uses its credentials, connects to Twitter's stream and listens to whenever a user mentions its username, then the bot verifies if the "parent" tweet of which it was mentioned has any valid image (files classified as `photo` by Twitter), if it has, the bot downloads the image, updates the file used as configuration for the processing of the image, creates a child process and executes a command that applies the effects on the image, then it replies to the user that mentioned the bot with the edited image.

## How to use

For now the bot only have one available script, so the bot uses it by default. To use it you only need to mention the bot (@GlitchArtBot) as a reply to any tweet that has an image. I have plans to add more scripts and options to customize the scripts.

*PS.: The user that mentions the bot aswell as the user that posted the tweet with the image **CAN'T** have its tweets "protected", for the bot won't the able to see the tweets.*

## Available scripts

**Even though most of (if not all) the scripts are not of my authorship, they had to be adjusted to work properly with the bot. To see the scripts used by the bot and how they work, ~~click here~~ (soon).*

- Pixel Sort by [Kim Asendorf](https://github.com/kimasendorf) ([source](https://github.com/kimasendorf/ASDFPixelSort/blob/master/ASDFPixelSort.pde))

## TODO

- [ ] Add more scripts
- [x] Add customization to each script, if possible
- [x] Choose what image to edit, if there's more than one in a tweet 