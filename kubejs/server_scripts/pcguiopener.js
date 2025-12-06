// priority: 0

const $ItemStack = Java.loadClass("net.minecraft.world.item.ItemStack")
const $PocketComputerItem = Java.loadClass("dan200.computercraft.shared.pocket.items.PocketComputerItem")
const $ModRegistry$Items = Java.loadClass("dan200.computercraft.shared.ModRegistry$Items")
const $PocketHolder$PlayerHolder = Java.loadClass("dan200.computercraft.shared.pocket.core.PocketHolder$PlayerHolder")

const PC_ITEM_SLOT = 9
const COMPUTER_ITEM = $ModRegistry$Items.POCKET_COMPUTER_ADVANCED.get()

NetworkEvents.dataReceived("open_pc_gui", event => {
    Utils.server.players.forEach(p => {
        COMPUTER_ITEM.open(
            p,
            p.inventory.getItem(PC_ITEM_SLOT),
            new $PocketHolder$PlayerHolder(p, PC_ITEM_SLOT),
            false
        )
    })
})
PlayerEvents.tick(event => {
    let { inventory } = event.player
    let pc = inventory.getItem(PC_ITEM_SLOT)

    if (!pc || !(pc.item instanceof $PocketComputerItem)) {
        let newPc = new $ItemStack(COMPUTER_ITEM)
        newPc.addTagElement("ComputerId", 1)
        newPc.addTagElement("Upgrade", "computercraft:wireless_modem_advanced")
        inventory.add(PC_ITEM_SLOT, newPc)
    }
})