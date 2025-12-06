// priority: 0

const $GameType = Java.loadClass("net.minecraft.world.level.GameType")

PlayerEvents.tick(event => {
    if (global.disableLocks) return
    let { persistentData } = event.player

    if (!persistentData.contains("expand_tier")) persistentData.putInt("expand_tier", 0)
    if (!persistentData.contains("drop_mult")) persistentData.putInt("drop_mult", 1)

    let expandTier = persistentData.getInt("expand_tier")
    event.player.setGameMode($GameType.SPECTATOR)
    event.player.teleportTo(2 * (expandTier + 1), 0, 2 * (expandTier + 1))
})