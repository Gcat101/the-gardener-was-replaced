// priority: 0

const $VariableHandler = Java.loadClass("de.keksuccino.fancymenu.customization.variables.VariableHandler")

let shortenNumber = i => {
    if (i < 1000) return i.toString()
    else if (i < 1000000) return Math.floor(i / 1000).toString() + "K"
    else if (i < 1000000000) return Math.floor(i / 1000000).toString() + "M"
    else return Math.floor(i / 1000000000).toString() + "B"
}

PlayerEvents.tick(event => {
    let { inventory } = event.player
    global.colors.forEach(c => {
        let petals = inventory.getAllItems().filter(i => i.item.id == `botania:${c}_petal`)[0]
        $VariableHandler.setVariable(c+"_petal_count", shortenNumber(petals != null ? petals.count : 0))
    })
})