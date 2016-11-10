(function() {
    var HIT_CHANNEL = "West-Hit";
    var hitSoundPath = Script.resolvePath("bulletHit.wav");
    print("Loading sound: ", hitSoundPath);
    var hitSound = SoundCache.getSound(hitSoundPath);
    var Target = function() {
        this.clickReleaseOnEntity = function(entityID, mouseEvent) {
            print("hit, playing sound");
            // Hit!
            // TODO: Play sound
            var position = Entities.getEntityProperties(entityID, 'position').position;
            Vec3.print("position", position);
            Audio.playSound(hitSound, {
                position: position,
                volume: 1.0,
                loop: false
            });

            // Send message
            Messages.sendMessage(HIT_CHANNEL, JSON.stringify({
                entityID: entityID
            }));
        }
    }

    return new Target();
})
