# glitch-art-bot-ts

Twitter bot (@GlitchArtBot) that applies glitch art effects in images.

## How it works

The bot uses its credentials, connects to Twitter's stream and listens to whenever a user mentions its username, then the bot verifies if the "parent" tweet of which it was mentioned has any valid image (files classified as `photo` by Twitter), if it has, the bot downloads the image, creates a child process and executes a command that applies the effects on the image, then it replies to the user that mentioned the bot with the edited image.

## How to use

There's a repository just for that, how amazing! [Click here](https://github.com/friaca/glitch-art-bot-scripts) for a detailed explanation on how to use the bot and customize it! :)

## Available scripts

**Even though most of (if not all) the scripts are not of my authorship, they had to be adjusted to work properly with the bot. To see the scripts used by the bot and how they work, [click here](https://github.com/friaca/glitch-art-bot-scripts).*

- Pixel Sort by [Kim Asendorf](https://github.com/kimasendorf)

## TODO

- [ ] Add more scripts
- [x] Add customization to each script, if possible
- [x] Choose what image to edit, if there's more than one in a tweet 