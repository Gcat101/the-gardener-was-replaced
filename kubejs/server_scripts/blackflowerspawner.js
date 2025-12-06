// priority: 0

const MIN_TICK_AMOUNT = 100
const MAX_TICK_AMOUNT = 2400
// const MAX_TICK_AMOUNT = 101

const MIN_TIER = 1

let getRandomTickAmount = () => Math.floor(Math.random() * (MAX_TICK_AMOUNT - MIN_TICK_AMOUNT + 1)) + MIN_TICK_AMOUNT
let findAvailableSpaces = () => {
    let world = Utils.server.getOverworld()
    let tier = Utils.server.getPlayers().get(0).persistentData.getInt("expand_tier")
    let range = (tier + 1) * 4

    if (tier < MIN_TIER) return []

    let spaces = []
    for (let x = 0; x < range; x++) {
        for (let z = 0; z < range; z++) {
            let pos = new BlockPos(x, 1, z)
            if (world.getBlock(pos).id == "minecraft:air" && world.getBlock(pos.offset(0, -1, 0)).id != "tgwr:still_farmland") {
                spaces.push(pos)
            }
        }
    }

    return spaces
}

let waitTick = getRandomTickAmount()
let tick = 0

ServerEvents.tick(event => {
    tick++
    if (tick < waitTick) return

    tick = 0
    waitTick = getRandomTickAmount()

    let spaces = findAvailableSpaces()
    if (spaces.length == 0) return

    let pos = global.randomPick(spaces)
    let world = Utils.server.getOverworld()

    world.setBlock(pos, Block.getBlock("tgwr:sprout").defaultBlockState(), 3)
    let entity = world.getBlockEntity(pos)
    let nbt = entity.saveWithoutMetadata()
    nbt.getCompound("data").putString("flower", "botania:black_mystical_flower")

    entity.load(nbt)
    entity.setChanged()
    world.sendBlockUpdated(pos, entity.blockState, entity.blockState, 3)
})