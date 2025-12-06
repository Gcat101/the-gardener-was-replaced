// priority: 0

const $TutorialToast = Java.loadClass("net.minecraft.client.gui.components.toasts.TutorialToast")

let toast = null

NetworkEvents.dataReceived("show_qb_toast", event => {
    toast = new $TutorialToast(
        $TutorialToast.Icons.RECIPE_BOOK,
        Component.literal("Open the guide"),
        Component.literal("Press the ").append(Component.literal("~ key").bold()),
        false
    )
    global.mc.toasts.addToast(toast)
})
NetworkEvents.dataReceived("hide_qb_toast", event => {
    if (toast != null) {
        toast.hide()
        toast = null
    }
})