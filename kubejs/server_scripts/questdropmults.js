// priority: 0

const MULT_PREFIX = "dropmult_"

FTBQuestsEvents.customReward(event => {
    let tag = event.reward.tags[0]
    if (tag == undefined || !tag.startsWith(MULT_PREFIX)) return

    let mult = +tag.replace(MULT_PREFIX, "")
    event.player.persistentData.putInt("drop_mult", mult)
})