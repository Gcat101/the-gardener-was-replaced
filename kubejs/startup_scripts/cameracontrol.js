// priority: 0

const $CameraType = Java.loadClass("net.minecraft.client.CameraType")
const $OrthoCamera = Java.loadClass("com.dimaskama.orthocamera.client.OrthoCamera")

const CAMERA_YAW = 135
const CAMERA_PITCH = 45
const MIN_CAMERA_SCALE = 3
const MAX_CAMERA_SCALE = 20

let setCameraScale = s => {
    $OrthoCamera.CONFIG.scale_x = s
    $OrthoCamera.CONFIG.scale_y = s
}
let getCameraScale = () => $OrthoCamera.CONFIG.scale_x

ForgeEvents.onEvent("net.minecraftforge.client.event.ViewportEvent$ComputeCameraAngles", event => {
    if (global.disableLocks) return

    event.setYaw(CAMERA_YAW)
    event.setPitch(CAMERA_PITCH)

    global.mc.options.setCameraType($CameraType.FIRST_PERSON)
    $OrthoCamera.CONFIG.enabled = true

    setCameraScale(Math.max(
        Math.min(getCameraScale(), MAX_CAMERA_SCALE), MIN_CAMERA_SCALE
    ))

    // if (global.mc.gui.getSpectatorGui().isMenuActive()) global.mc.gui.getSpectatorGui().onHotbarSelected(-1)
})

ForgeEvents.onEvent("net.minecraftforge.client.event.InputEvent$MouseScrollingEvent", event => {
    let newCameraScale = getCameraScale() - Math.sign(event.scrollDelta)
    setCameraScale(Math.max(
        Math.min(newCameraScale, MAX_CAMERA_SCALE), MIN_CAMERA_SCALE
    ))
})