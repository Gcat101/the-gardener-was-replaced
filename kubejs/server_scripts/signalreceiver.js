// priority: 0

const $Direction = Java.loadClass("net.minecraft.core.Direction")
const $SoundEvents = Java.loadClass("net.minecraft.sounds.SoundEvents")
const $SoundSource = Java.loadClass("net.minecraft.sounds.SoundSource")
const $ServerContext = Java.loadClass("dan200.computercraft.shared.computer.core.ServerContext")
const $TurtleBlock = Java.loadClass("dan200.computercraft.shared.turtle.blocks.TurtleBlock")
const $TurtleAnimation = Java.loadClass("dan200.computercraft.api.turtle.TurtleAnimation")

const TURTLE_ID = 0
const PC_ID = 1
const TURTLE_Y_LEVEL = 2
const MIN_TEMP_DROP_INCREASE_FOR_LIME = 7

const INGREDIENTS = [
    ["botania:yellow_petal", "botania:magenta_petal"],
    ["botania:yellow_petal", "botania:red_petal"],
    [],
    ["botania:yellow_petal", "botania:cyan_petal"],
    [],
    [],
    [],
    ["botania:magenta_petal", "botania:cyan_petal"],
    ["botania:pink_petal", "botania:black_petal"],
    [],
    ["botania:magenta_petal", "botania:blue_petal"],
    ["botania:black_petal"],
    ["botania:gray_petal"],
    ["botania:red_petal", "botania:orange_petal", "botania:yellow_petal", "botania:green_petal", "botania:lime_petal", "botania:light_blue_petal", "botania:cyan_petal", "botania:blue_petal", "botania:purple_petal", "botania:magenta_petal", "botania:pink_petal", "botania:gray_petal", "botania:light_gray_petal", "botania:black_petal", "botania:brown_petal"],
    [],
    ["botania:orange_petal", "botania:black_petal"]
]
const UPLANTABLE_IDS = [4, 5, 14]
const GROUND_TYPES = [
    "minecraft:grass_block",
    "tgwr:still_water",
    "minecraft:mycelium",
    "tgwr:still_farmland"
]

let getPcOfIndex = i => {
    let pcReg = $ServerContext.get(Utils.server).registry()

    let pc = null
    pcReg.getComputers().forEach(p => {if (p.ID == i) pc = p})
    return pc
}
let sendEventToPc = (i, ev, data) => {
    if (data != null) getPcOfIndex(i).queueEvent(ev, data)
    else getPcOfIndex(i).queueEvent(ev)
}

/** @returns {Internal.Player_} */
let getPlayer = () => Utils.server.getPlayers().get(0)
let getExpandTier = () => getPlayer().persistentData.getInt("expand_tier")
let getRange = () => (getExpandTier() + 1) * 4
let getTurtle = () => {
    let world = Utils.server.getOverworld()
    let range = getRange()

    for (let x = 0; x < range; x++) {
        for (let z = 0; z < range; z++) {
            let block = world.getBlock(new BlockPos(x, TURTLE_Y_LEVEL, z))
            if (block.blockState.block instanceof $TurtleBlock) return block
        }
    }

    console.log("[TGWR] Turtle could not be found, something has gone seriously wrong")
}

let checkIfTurtleCanMove = backwards => {
    let turtle = getTurtle()
    let facing = turtle.properties["facing"]

    let offset = $Direction.byName(facing)
    if (backwards) offset = offset.getOpposite()

    let newPos = turtle.pos.relative(offset)
    let range = getRange()

    return (
        (newPos.x >= 0 && newPos.x < range) &&
        (newPos.z >= 0 && newPos.z < range)
    )
}
let plantFlower = id => {
    let turtle = getTurtle()
    let pos = turtle.pos.offset(0, -1, 0)
    let world = Utils.server.getOverworld()
    
    if (
        world.getBlock(pos).id != "minecraft:air" || 
        !world.getBlock(pos.offset(0, -1, 0)).tags.contains(new ResourceLocation("minecraft:dirt"))
    ) return

    if (isNaN(id) || (+id) >= global.colors.length) {
        global.log(`Tried to plant unknown plant with ID: ${id}`, true)
        return
    }

    id = +id
    let plant = `botania:${global.colors[id]}_mystical_flower`
    let player = getPlayer()

    if (UPLANTABLE_IDS.indexOf(id) > -1) {
        global.log(`Tried to plant the following flower, but it is not plantable: ${plant}`, true)
        return
    }
    else if (!player.stages.has(`can_plant_${id}`)) {
        global.log(`Tried to plant the following flower, but it hasn't been unlocked yet: ${plant}`, true)
        return
    }

    let stacksToShrink = []
    for (let ingredient of INGREDIENTS[id]) {
        let stacks = player.inventory.getAllItems().filter(i => i.item.id == ingredient)

        if (stacks.length == 0) {
            global.log(`Tried to plant ${plant}, but the following prerequisite was missing: ${ingredient}`, true)
            return
        }
        stacksToShrink.push(stacks[0])
    }
    stacksToShrink.forEach(s => s.shrink(1))

    world.setBlock(pos, Block.getBlock("tgwr:sprout").defaultBlockState(), 3)
    world.playSound(null, pos, $SoundEvents.GRASS_PLACE, $SoundSource.BLOCKS)

    let entity = world.getBlockEntity(pos)
    let nbt = entity.saveWithoutMetadata()
    nbt.getCompound("data").putString("flower", plant)

    entity.load(nbt)
    entity.setChanged()
    world.sendBlockUpdated(pos, entity.blockState, entity.blockState, 3)
}
let changeGround = id => {
    if (isNaN(id) || (+id) >= GROUND_TYPES.length) {
        global.log(`Tried to change the ground to an unknown type with ID: ${id}`, true)
        return
    }
    id = +id

    let { pos } = getTurtle()
    let type = GROUND_TYPES[id]

    if (id != 0 && !getPlayer().stages.has(`can_ground_${id}`)) {
        global.log(`Tried change the ground to the following type, but it hasn't been unlocked yet: ${type}`, true)
        return
    }

    Utils.server.getOverworld().destroyBlock(pos.offset(0, -1, 0), false)
    Utils.server.getOverworld().setBlock(pos.offset(0, -2, 0), Block.getBlock(type).defaultBlockState(), 3)
}

let proccessSignal = signal => {
    let player = getPlayer()
    let world = Utils.server.getOverworld()

    let turtle = getTurtle()
    let turtleAccess = turtle.entity.getAccess()
    let flower = turtle.offset(0, -1, 0)

    if (signal.startsWith("plant_")) {
        plantFlower(signal.replace("plant_", ""))
        return
    } else if (signal.startsWith("ground_")) {
        changeGround(signal.replace("ground_", ""))
        return
    } else if (signal.startsWith("log_")) {
        global.log(signal.replace("log_", ""), false)
        return
    }

    switch (signal) {
        case "turn_left":
            player.stages.add("turtle_moved")

            if (player.stages.has("fast_move")) turtleAccess.setDirection(turtleAccess.getDirection().getCounterClockWise())
            else sendEventToPc(TURTLE_ID, "turn_left")
            break
        case "turn_right":
            player.stages.add("turtle_moved")
            
            if (player.stages.has("fast_move")) turtleAccess.setDirection(turtleAccess.getDirection().getClockWise())
            else sendEventToPc(TURTLE_ID, "turn_right")
            break

        case "move_forwards":
            if (!checkIfTurtleCanMove(false)) break
            player.stages.add("turtle_moved")

            if (player.stages.has("fast_move")) turtleAccess.teleportTo(world, turtle.pos.relative($Direction.byName(turtle.properties["facing"])))
            else sendEventToPc(TURTLE_ID, "move_forwards")
            break
        case "move_backwards":
            if (!checkIfTurtleCanMove(true)) break
            player.stages.add("turtle_moved")

            if (player.stages.has("fast_move")) turtleAccess.teleportTo(world, turtle.pos.relative($Direction.byName(turtle.properties["facing"]).getOpposite()))
            else sendEventToPc(TURTLE_ID, "move_backwards")
            break

        case "gather":
            if (flower.id == "minecraft:air") break

            let dropAmount = 1
            if (flower.id == "botania:purple_mystical_flower") dropAmount += Math.max(MIN_TEMP_DROP_INCREASE_FOR_LIME - global.tempDropIncrease, 0)
            else dropAmount += global.tempDropIncrease

            if (flower.id == "botania:pink_mystical_flower") {
                let adj = [
                    flower.offset(1, 0, 0),
                    flower.offset(-1, 0, 0),
                    flower.offset(0, 0, 1),
                    flower.offset(0, 0, -1)
                ]
                dropAmount += adj.filter(b => b.id == "botania:pink_mystical_flower").length
            }

            let mult = player.persistentData.getInt("drop_mult")
            dropAmount *= mult

            let grownOnMycelium = false
            if (
                flower.id != "botania:magenta_mystical_flower" &&
                flower.offset(0, -1, 0).id == "minecraft:mycelium"
            ) {
                dropAmount *= 2
                grownOnMycelium = true
            }

            if (flower.id.endsWith("_mystical_flower") && flower.id != "botania:black_mystical_flower") {
                player.inventory.add(Item.getItem(flower.id.replace("mystical_flower", "petal")).getDefaultInstance().withCount(dropAmount))
                if (
                    flower.id == "botania:green_mystical_flower" &&
                    player.stages.has("can_plant_4") &&
                    global.tempDropIncrease >= MIN_TEMP_DROP_INCREASE_FOR_LIME
                ) player.inventory.add(Item.getItem("botania:lime_petal").getDefaultInstance().withCount(dropAmount - (MIN_TEMP_DROP_INCREASE_FOR_LIME * mult * (grownOnMycelium ? 2 : 1))))
            }
            else if (flower.id == "tgwr:sprout" && flower.entity.saveWithoutMetadata().getCompound("data").getString("flower") == "botania:black_mystical_flower")
                player.inventory.add(Item.getItem(flower.entity.saveWithoutMetadata().getCompound("data").getString("flower").replace("mystical_flower", "petal")).getDefaultInstance().withCount(dropAmount))
            world.destroyBlock(flower.pos, false)

            if (flower.id == "botania:green_mystical_flower") {
                global.tempDropIncrease += 1
                Utils.server.scheduleInTicks(200, () =>{
                    global.tempDropIncrease = Math.max(global.tempDropIncrease - 1, 0)
                })
            }
            
            break

        case "get_coords":
            let coords = turtle.pos
            sendEventToPc(PC_ID, "get_coords", [coords.x, coords.z])
            break
        case "get_range":
            sendEventToPc(PC_ID, "get_range", [getRange()])
            break
        case "get_facing":
            let facing = turtle.properties.get("facing")
            sendEventToPc(PC_ID, "get_facing", [facing])
            break
        case "get_grown":
            let block = turtle.offset(0, -1, 0).id
            sendEventToPc(PC_ID, "get_grown", [block.endsWith("_mystical_flower")])
            break
        case "get_plant":
            sendEventToPc(PC_ID, "get_plant", [flower.id == "tgwr:sprout" ? flower.entityData.getCompound("data").getString("flower") : flower.id])
            break
        case "get_ground":
            let ground = turtle.offset(0, -2, 0).id
            sendEventToPc(PC_ID, "get_ground", [ground.replace("tgwr:still_water", "minecraft:water").replace("tgwr:still_farmland", "minecraft:farmland")])
            break
    
        default:
            console.log(`[TGWR] Unknown signal: "${signal}"`)
            break
    }
}

ServerEvents.commandRegistry(event => {
    const { commands, arguments } = event
    event.register(commands.literal("receive_signal")
        .requires(source => source.hasPermission(2))
        .then(commands.argument("signal", arguments.MESSAGE.create(event))
            .executes(ctx => {
                proccessSignal(arguments.MESSAGE.getResult(ctx, "signal").getString())
                return 0
            })
        )
    )
})