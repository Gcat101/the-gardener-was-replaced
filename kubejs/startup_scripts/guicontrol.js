// priority: 0

const $PauseScreen = Java.loadClass("net.minecraft.client.gui.screens.PauseScreen")
const $ChatScreen = Java.loadClass("net.minecraft.client.gui.screens.ChatScreen")
const $ReceivingLevelScreen = Java.loadClass("net.minecraft.client.gui.screens.ReceivingLevelScreen")
const $GenericDirtMessageScreen = Java.loadClass("net.minecraft.client.gui.screens.GenericDirtMessageScreen")
const $ConfirmScreen = Java.loadClass("net.minecraft.client.gui.screens.ConfirmScreen")
const $InventoryScreen = Java.loadClass("net.minecraft.client.gui.screens.inventory.InventoryScreen")
const $ScreenWrapper = Java.loadClass("dev.ftb.mods.ftblibrary.ui.ScreenWrapper")
const $QuestScreen = Java.loadClass("dev.ftb.mods.ftbquests.client.gui.quests.QuestScreen")
const $ValidItemsScreen = Java.loadClass("dev.ftb.mods.ftbquests.client.gui.quests.ValidItemsScreen")
const $SelectQuestObjectScreen = Java.loadClass("dev.ftb.mods.ftbquests.client.gui.SelectQuestObjectScreen")
const $EditConfigScreen = Java.loadClass("dev.ftb.mods.ftblibrary.config.ui.EditConfigScreen")
const $EditConfigListScreen = Java.loadClass("dev.ftb.mods.ftblibrary.config.ui.EditConfigListScreen")
const $SelectItemStackScreen = Java.loadClass("dev.ftb.mods.ftblibrary.config.ui.SelectItemStackScreen")
const $SelectImageResourceScreen = Java.loadClass("dev.ftb.mods.ftblibrary.config.ui.SelectImageResourceScreen")
const $ComputerScreen = Java.loadClass("dan200.computercraft.client.gui.ComputerScreen")

ForgeEvents.onEvent("net.minecraftforge.client.event.ScreenEvent$Opening", event => {
    let { screen } = event
    if (global.disableLocks || global.mc.level == null || global.mc.isPaused() || (
        (
            screen instanceof $PauseScreen ||
            screen instanceof $ChatScreen ||
            screen instanceof $ReceivingLevelScreen ||
            screen instanceof $GenericDirtMessageScreen ||
            screen instanceof $ConfirmScreen ||
            screen instanceof $ComputerScreen
        )
    )) return

    if (
        screen instanceof $ScreenWrapper &&
        (
            screen.getGui() instanceof $QuestScreen ||
            screen.getGui() instanceof $ValidItemsScreen ||
            screen.getGui() instanceof $EditConfigScreen ||
            screen.getGui() instanceof $SelectItemStackScreen ||
            screen.getGui() instanceof $EditConfigListScreen ||
            screen.getGui() instanceof $SelectQuestObjectScreen ||
            screen.getGui() instanceof $SelectImageResourceScreen
        )
    ) {
        global.mc.player.sendData("hide_qb_toast")
        return
    }

    event.setCanceled(true)
    if (screen instanceof $InventoryScreen) global.mc.player.sendData("open_pc_gui")

    // console.log(screen)
    // console.log(screen.getGui())
})