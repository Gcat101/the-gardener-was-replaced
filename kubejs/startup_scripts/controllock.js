// priority: 0

let lockPlayer = input => {
    input.forwardImpulse = 0
    input.leftImpulse = 0
    input.up = false
    input.down = false
    input.left = false
    input.right = false
    input.jumping = false
    input.shiftKeyDown = false
}

ForgeEvents.onEvent("net.minecraftforge.client.event.MovementInputUpdateEvent", event => {
    if (global.disableLocks) return
    lockPlayer(event.getInput())
})