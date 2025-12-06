local function transmit_signal(signal, wait)
    rednet.open("back")
    rednet.broadcast(signal)
    if wait then sleep(.45) end
end

function log(str)
    transmit_signal("log_" .. str, false)
end

function turnLeft()
    transmit_signal("turn_left", true)
end
function turnRight()
    transmit_signal("turn_right", true)
end

function forward()
    transmit_signal("move_forwards", true)
end
function back()
    transmit_signal("move_backwards", true)
end

function gather()
    transmit_signal("gather", true)
end
function plant(id)
    transmit_signal("plant_" .. id, true)
end
function changeGround(id)
    transmit_signal("ground_" .. id, true)
end

function getCoords()
    transmit_signal("get_coords", false)
    local _, x, z = os.pullEvent("get_coords")
    return x, z
end
function getRange()
    transmit_signal("get_range", false)
    local _, range = os.pullEvent("get_range")
    return range
end
function getFacing()
    transmit_signal("get_facing", false)
    local _, facing = os.pullEvent("get_facing")
    return facing
end
function getGrown()
    transmit_signal("get_grown", false)
    local _, grown = os.pullEvent("get_grown")
    return grown
end
function getPlant()
    transmit_signal("get_plant", false)
    local _, plant = os.pullEvent("get_plant")
    return plant
end
function getGround()
    transmit_signal("get_ground", false)
    local _, ground = os.pullEvent("get_ground")
    return ground
end


return {
    log = log, say = log,
    turnLeft = turnLeft, turnRight = turnRight, left = turnLeft, right = turnRight,
    forward = forward, back = back, backward = back, backwards = back, moveForward = forward, moveBackward = back, moveForwards = forward, moveBackwards = back, moveBack = back,
    gather = gather, dig = gather, digDown = gather, suck = plant, suckDown = gather, harvest = gather,
    plant = plant, place = plant, placeDown = plant, drop = plant, dropDown = plant,
    changeGround = changeGround, setGround = changeGround, ground = changeGround,
    getCoords = getCoords, coords = getCoords,
    getRange = getRange, getSize = getRange, range = getRange, size = getRange,
    getFacing = getFacing, getDirection = getFacing, getOrientation = getFacing, getTurn = getFacing, facing = getFacing, direction = getFacing, orientation = getFacing,
    getGrown = getGrown, canHarvest = getGrown, canGather = getGrown,
    getPlant = getPlant, getFlower = getPlant, getPlantType = getPlant, getFlowerType = getPlant, plantType = getPlant, flowerType = getPlant,
    getGround = getGround, getGroundType = getGround, groundType = getGround
}