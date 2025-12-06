// priority: 0

StartupEvents.registry("block", event => {
    event.create("tgwr:still_water")
        .color(0x3F76E4)
        .defaultTranslucent()
        .modelJson ={
            "parent": "minecraft:block/block",
            "elements": [{
                "from": [0, 0, 0],
                "to": [16, 16, 16],
                "faces": {
                    "north": { "texture": "#all", "tintindex": 0 },
                    "east": { "texture": "#all", "tintindex": 0 },
                    "south": { "texture": "#all", "tintindex": 0 },
                    "west": { "texture": "#all", "tintindex": 0 },
                    "up": { "texture": "#all", "tintindex": 0 },
                    "down": { "texture": "#all", "tintindex": 0 }
                }
            }],
            "textures": {
                "all": "minecraft:block/water_still"
            }
        }

        event.create("tgwr:still_farmland")
            .model("minecraft:block/farmland")
            .tagBlock("minecraft:dirt")
})