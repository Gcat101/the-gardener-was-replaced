// priority: 0

const $Minecraft = Java.loadClass("net.minecraft.client.Minecraft")

global.tempDropIncrease = 0
global.whiteFlowerChance = 0

global.mc = $Minecraft.getInstance()

global.colors = [
    "red",
    "orange",
    "yellow",
    "green",
    "lime",
    "light_blue",
    "cyan",
    "blue",
    "purple",
    "magenta",
    "pink",
    "gray",
    "light_gray",
    "white",
    "black",
    "brown"
]
global.disableLocks = false

global.randomPick = arr => arr[Math.floor(Math.random() * arr.length)]
global.log = (msg, err) => {
    let text = `[@/${err ? "ERR" : "INFO"}] ${msg}`
    console.log(text)

    Utils.server.players.forEach(p => {
        p.tell(err ? Component.red(text) : Component.literal(text))
    })
}