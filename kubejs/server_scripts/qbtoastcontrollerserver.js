// priority: 0

PlayerEvents.loggedIn(event => {
    if (event.player.stages.has("opened_qb")) return
    event.player.sendData("show_qb_toast")
})
NetworkEvents.dataReceived("hide_qb_toast", event => {
    event.player.stages.add("opened_qb")
    event.player.sendData("hide_qb_toast")
})