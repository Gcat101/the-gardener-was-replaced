// priority: 0

const UPDATE_FREQUENCY = 20
let tick = 0

ServerEvents.tick(event => {
    tick++
    if (tick % UPDATE_FREQUENCY) return

    /** @type {Internal.Player} */
    let player = event.server.getPlayers().get(0)
    let world = event.server.getOverworld()
    if (!player.stages.has("can_plant_13")) return

    let flowerCounts = {}
    let range = (player.persistentData.getInt("expand_tier") + 1) * 4

    for (let x = 0; x < range; x++) {
        for (let z = 0; z < range; z++) {
            let block = world.getBlock(new BlockPos(x, 1, z))
            let flower = block.id

            if (flower == "minecraft:air" || flower == "botania:white_mystical_flower") continue
            if (flower == "tgwr:sprout") flower = block.entity.saveWithoutMetadata().getCompound("data").getString("flower")

            if (Object.keys(flowerCounts).indexOf(flower) < 0) flowerCounts[flower] = 1
            else flowerCounts[flower] += 1
        }
    }

    let count = Object.keys(flowerCounts).length
    if (count == 0) {
        global.whiteFlowerChance = 1
    }

    let avg = 0
    Object.values(flowerCounts).forEach(v => avg += v)
    avg /= count

    let devSum = 0
    Object.values(flowerCounts).forEach(v => devSum += Math.pow(v - avg, 2))
    let standardDev = Math.sqrt(devSum/count)

    global.whiteFlowerChance = 1 / (standardDev + 1)
    // console.log(global.whiteFlowerChance)
})