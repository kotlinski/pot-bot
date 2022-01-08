# pot-bot

A bot giving recommended bets at Svenska Spels Europatipset and Stryktipset depending on the current odds, distribution and pot.

## Set up

Mail Svenska Spel and ask for an api-key.

## Usage

### Fetch current draw

> yarn run fetch-current-draw

Optional parameters:

```
--game_type <stryktipset|europatipset>
--svenskaspel_api_key <api-key>
```

### Analyze current draw

> yarn run analyze-current-draw --game_type <stryktipset|europatipset> --number_of_lines <150>

## Dev

Run with

> npm run build; node ./build/scripts/fetch-current-draw.ts

> npm run build
> NODE_ENV=dev && npm run build
> npm run analyze -- --drawNumber 4632

//

## Other

to get nice printouts with sek you might add the swedish locale
`npm install -g full-icu`

## Quotes

_-En bra Stryktipskupong ger utrymme för skrällar!_
