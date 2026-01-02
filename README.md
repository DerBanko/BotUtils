# BotUtils

Utitities for your Twitch Bot.

## Available Endpoints

### Relative Time

**URL:** `https://botutils.eiscre.me/relative-time?date=DATE&output=OUTPUT`

**Date:** a Date in ISO 8601 format (for example: 2002-12-26, 2026-01-02T17:25:06%2b00:00) or a Timestamp in seconds or milliseconds. 
**Note:** you have to encode the `+` sign with `%2b`.

**Output:** choose one: `years`, `months`, `weeks`, `days`, `hours`, `minutes`, `seconds` or `milliseconds`.