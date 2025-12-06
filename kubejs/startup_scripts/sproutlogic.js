// priority: 0

// /setblock 1 1 1 tgwr:sprout{data:{flower:"botania:red_mystical_flower"}}
// /setblock 1 1 1 air

const $Integer = Java.loadClass("java.lang.Integer")

const UPDATE_FREQ = 5
const DEFAULT_TIMES = {
    "botania:red_mystical_flower": 600,
    "botania:orange_mystical_flower": 1000,
    "botania:yellow_mystical_flower": 400,
    "botania:green_mystical_flower": 600,
    "botania:lime_mystical_flower": 0,
    "botania:light_blue_mystical_flower": 0,
    "botania:cyan_mystical_flower": 500,
    "botania:blue_mystical_flower": 600,
    "botania:purple_mystical_flower": 1800,
    "botania:magenta_mystical_flower": 500,
    "botania:pink_mystical_flower": 1000,
    "botania:gray_mystical_flower": 60,
    "botania:light_gray_mystical_flower": 800,
    "botania:white_mystical_flower": 2400,
    "botania:black_mystical_flower": 3600,
    "botania:brown_mystical_flower": 1200
}

/**
 * @param {Internal.BlockEntityJS_} sprout 
 * @param {string} flower 
 * @param {number} tick
 */
let checkGrowth = (sprout, flower, tick) => {
    let world = Utils.server.getOverworld()
    let player = Utils.server.getPlayers().get(0)
    let pos = sprout.blockPos

    let block = world.getBlock(pos)
    let adjBlocks = [
        block.offset(1, 0, 0),
        block.offset(-1, 0, 0),
        block.offset(0, 0, 1),
        block.offset(0, 0, -1),
    ]

    let addTime = 0
    let ground = world.getBlock(pos.offset(0, -1, 0))
    let adjGrounds = [
        ground.offset(1, 0, 0),
        ground.offset(-1, 0, 0),
        ground.offset(0, 0, 1),
        ground.offset(0, 0, -1),
    ]
    if (ground.id == "tgwr:still_farmland") addTime += .3
    adjGrounds.forEach(g => {
        if (g.id == "tgwr:still_water" && flower != "botania:cyan_mystical_flower") addTime -= 0.125
        else if (g.id == "minecraft:mycelium") addTime += 0.25
    })

    let growthTime = DEFAULT_TIMES[flower] + (DEFAULT_TIMES[flower] * addTime)
    if (tick < growthTime) return

    let successfulPlant = true
    switch (flower) {
        case "botania:red_mystical_flower":
            let blocksToBreak = adjBlocks.filter(b => b.id != "minecraft:air")
            if (blocksToBreak.length == 0) break

            world.destroyBlock(global.randomPick(blocksToBreak).pos, false)
            break
        case "botania:orange_mystical_flower":
            let blocksToReplace = adjBlocks.filter(b => b.id != "minecraft:air")
            if (blocksToReplace.length == 0) break

            blocksToReplace.forEach(b => {
                if (Math.random() > .5) return
                world.setBlock(b.pos, Block.getBlock("botania:orange_mystical_flower").defaultBlockState(), 3)
            })
            break
        case "botania:cyan_mystical_flower":
            if (adjGrounds.filter(g => g.id == "tgwr:still_water").length == 0) successfulPlant = false
            break
        case "botania:blue_mystical_flower":
            if (adjGrounds.filter(g => g.id == "minecraft:air").length == 0) successfulPlant = false
            break
        case "botania:magenta_mystical_flower":
            if (ground.id != "minecraft:mycelium") successfulPlant = false
            break
        case "botania:light_gray_mystical_flower":
            let countedFlowers = []
            let grayFlowerDropChance = 0.2

            adjBlocks.forEach(b => {
                if (b.id == "minecraft:air") return
                if (countedFlowers.indexOf(b.id) < 0) countedFlowers.push(b.id)
            })
            grayFlowerDropChance += 0.2 * countedFlowers.length

            if (Math.random() > grayFlowerDropChance) successfulPlant = false
            break
        case "botania:white_mystical_flower":
            if (Math.random() > global.whiteFlowerChance) successfulPlant = false
            break
        case "botania:brown_mystical_flower":
            let countedGrounds = []
            let brownFlowerDropChance = 0.2

            adjGrounds.forEach(g => {
                if (g.id != "minecraft:air" && countedGrounds.indexOf(g.id) < 0) countedGrounds.push(g.id)
            })
            brownFlowerDropChance += 0.2 * countedGrounds.length

            if (Math.random() > brownFlowerDropChance) successfulPlant = false
            break
        default:
            break
    }

    if (successfulPlant) {
        let blockToPlant = (
            (
                flower == "botania:blue_mystical_flower" &&
                player.stages.has("can_plant_5") &&
                ground.id == "minecraft:mycelium"
            ) ?
            Block.getBlock("botania:light_blue_mystical_flower").defaultBlockState() :
            Block.getBlock(flower).defaultBlockState()
        )

        world.setBlock(
            pos,
            blockToPlant,
            3
        )
    } else {
        world.destroyBlock(pos, false)
    }
}

StartupEvents.registry("block", event => {
    event.create("tgwr:sprout").blockEntity(info => {
        info.serverTick(UPDATE_FREQ, 0, entity => {
            let { data } = entity
            if (!data.contains("flower")) return

            let flower = data.getString("flower")
            if (
                flower == "botania:gray_mystical_flower" &&
                entity.block.offset(0, 1, 0).id == "minecraft:air"
            ) return

            let tick = data.contains("tick") ? (data.getInt("tick") + UPDATE_FREQ) % $Integer.MAX_VALUE : 1
            entity.data.putInt("tick", tick)
            checkGrowth(entity, flower, tick)
        })
    }).model("minecraft:block/sweet_berry_bush_stage0").defaultCutout().soundType(SoundType.BAMBOO)
})