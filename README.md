# Pokemon GO Web Client
## What?
Now you can interact with official Pokemon GO's server with a web client!
You can use your arrow keys to walk and your mouse to catch pokemons. Everything is displayed in a nice way using Google Maps.
Also, you can use pokestops, transfer/evolve pokemons and use/drop items.
In this version, you actually see other players on map and can even chat with them.
Just login with your facebook account and link how many Pokemon GO accounts to it, so you can switch between your trainers.

## Screenshots
![alt tag](https://raw.githubusercontent.com/rafaelcorreiapoli/pokemon-web/master/screenshots/Jogo1.png?token=AMPsyCZf3UXh4hEXSu3eKf0H75Z7S30xks5X1d9HwA%3D%3D)
*Encounter pokemons*

![alt tag](https://raw.githubusercontent.com/rafaelcorreiapoli/pokemon-web/master/screenshots/Jogo2.png?token=AMPsyFUDq0CBDZd4Tk5Otxydw1akpm0bks5X1eA9wA%3D%3D)
*Nice map visualization. Rotating the angle that you are walking makes the entire map to rotate*

![alt tag](https://raw.githubusercontent.com/rafaelcorreiapoli/pokemon-web/master/screenshots/Jogo3.png?token=AMPsyEb48BWRprj1jEQmFEvE0LZvf89kks5X1d-zwA%3D%3D)
*Play with multiple Pokemon GO' accounts*

![alt tag](https://raw.githubusercontent.com/rafaelcorreiapoli/pokemon-web/master/screenshots/Jogo5.png?token=AMPsyFTcohJSub4NVZwyKDcuJPhHeOPcks5X1d__wA%3D%3D)
*Get Pokestops and check your inventory*

![alt tag](https://raw.githubusercontent.com/rafaelcorreiapoli/pokemon-web/master/screenshots/Jogo6.png?token=AMPsyGPXsKeCtrOGXXaFz97LbaI4Qp1Kks5X1eAXwA%3D%3D)
*Catch pokemons!!*

## How to play
- Login with your facebook
- Click on the top-right menu and select Create New Trainer
- Select a starting location for the bot
- Use a fake gmail account (Or use your offical account at your own risk)
- Click Create
- Go to the same menu and select your recently created trainer
- Click "LOGIN BOT"
- Use your arrow keys to walk in the map
- Use your mouse to catch pokemons/pokestops

## Todo
- [x] Display pokemons on map
- [x] Display pokestops on map
- [x] Display catched pokemons on map
- [x] Display fleed pokemons on map
- [ ] Encounter cleanup
- [ ] Geo filter on map entites to optmize performance
- [x] Transfer pokemons
- [x] List of catched pokemons
- [x] List of items on inventory
- [ ] List of eggs
- [ ] Hatch Egg
- [ ] Show profile
- [x] Multiple accounts
- [ ] Use pokesniper to jump to rare pokemon
- [ ] Use pokestop to unban IP (interact 40 times with pokestop)
- [x] See other players on map
- [ ] Chat
- [ ] Use Razzberry
- [ ] Use Lucky Egg
- [ ] Evolve
- [ ] Lucky Egg + Evolve algorithm
- [x] Encounter pokemons
- [x] Catch pokemons


## Running

First, you need to run the pokemon-bot-service (the service that will interact with PokemonGO official API)

Here is a link to the repo: https://github.com/rafaelcorreiapoli/pokemon-bot-service
```
git clone https://github.com/rafaelcorreiapoli/pokemon-bot-service
cd pokemon-bot-service
npm i
meteor -p 4000
```
and just leave it running...


```
git clone https://github.com/rafaelcorreiapoli/pokemon-web.git
cd pokemon-web
npm i
meteor
```
and access http://localhost:3000

*(Note: go to ```src/server/BotService/index.js``` and make sure you are connecting to the right IP where pokemon-bot-service is running)*
