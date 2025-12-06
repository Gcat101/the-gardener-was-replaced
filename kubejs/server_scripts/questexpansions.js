// priority: 0

const $Blocks = Java.loadClass("net.minecraft.world.level.block.Blocks")

const EXPAND_PREFIX = "expand_"
const Y_LEVEL = -46

FTBQuestsEvents.customReward(event => {
    let tag = event.reward.tags[0]
    if (tag == undefined || !tag.startsWith(EXPAND_PREFIX)) return

    let tier = +tag.replace(EXPAND_PREFIX, "")
    let world = event.server.getLevel("minecraft:overworld")

    for (let y = 0; y <= tier; y++) {
        world.setBlock(new BlockPos(
            (4 * (tier + 1)) - 1,
            Y_LEVEL,
            y * 4
        ), $Blocks.REDSTONE_BLOCK.defaultBlockState(), 3)
    }
    for (let x = 0; x <= tier + 1; x++) {
        world.setBlock(new BlockPos(
            x * 4 - (+(x == (tier + 1))),
            Y_LEVEL,
            (4 * (tier + 1)) - 1
        ), $Blocks.REDSTONE_BLOCK.defaultBlockState(), 3)
    }

    event.player.persistentData.putInt("expand_tier", tier + 1)
})