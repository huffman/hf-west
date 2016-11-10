// Run by a single user or an ac script
// 
//   Manager that starts the game
//   Game is broken up into "waves"
//   Each wave starts after all previous waves have finished
//   A wave finishes when it times out or the player completes it
//   A wave consists of a set of targets
//   When a target is hit by the player a "hit" message is broadcast
//     When receiving a "hit" message, apply to current wave and score
//     If wave is complete, start next wave
//   You can fail by missing too many targets
//   If you miss a total of 3 targets you lose altogether
//

findEntity = function(properties, searchRadius, filterFn) {
    var entities = findEntities(properties, searchRadius, filterFn);
    return entities.length > 0 ? entities[0] : null;
}

// Return all entities with properties `properties` within radius `searchRadius`
findEntities = function(properties, searchRadius, filterFn) {
    if (!filterFn) {
        filterFn = function(properties, key, value) {
            return value == properties[key];
        }
    }
    searchRadius = searchRadius ? searchRadius : 100000;
    var entities = Entities.findEntities({ x: 0, y: 0, z: 0 }, searchRadius);
    var matchedEntities = [];
    var keys = Object.keys(properties);
    for (var i = 0; i < entities.length; ++i) {
        var match = true;
        var candidateProperties = Entities.getEntityProperties(entities[i], keys);
        for (var key in properties) {
            if (!filterFn(properties, key, candidateProperties[key])) {
                // This isn't a match, move to next entity
                match = false;
                break;
            }
        }
        if (match) {
            matchedEntities.push(entities[i]);
        }
    }

    return matchedEntities;
}

function Target(entityID) {
    this.entityID = entityID;
}
Target.prototype = {
    moveUp: function() {
        print("Moving up");
        Entities.editEntity(this.entityID, {
            localRotation: Quat.fromPitchYawRollDegrees(0, 0, 0)
        });
    },
    moveDown: function() {
        print("Moving down");
        Entities.editEntity(this.entityID, {
            localRotation: Quat.fromPitchYawRollDegrees(-90, 0, 0)
        });
    }
};

var targets = [
    new Target(findEntity({ name: 'target1' })),
    new Target(findEntity({ name: 'target2' })),
    new Target(findEntity({ name: 'target3' })),
];

var HIT_CHANNEL = "West-Hit";

function receivedMessage(message, channel, sender) {
    if (channel == HIT_CHANNEL) {
        print(channel, message, sender);
    }
}
Messages.subscribe(HIT_CHANNEL);
Messages.messageReceived.connect(receivedMessage);

function reset() {
    for (var i = 0; i < targets.length; ++i) {
        targets[i].moveDown();
    }
}

function RandomWave(targets, opts, onFinish) {
    for (var i = 0; i < targets.length; ++i) {
        targets[i].moveUp();
    }
    Script.setTimeout(function() {
        print("TIMEOUT");
        for (var i = 0; i < targets.length; ++i) {
            targets[i].moveDown();
        }
        onFinish();
    }, 2000);
}

function randInt(min, max) {
    return Math.floor(min + Math.random() * (max - min));
}

function start() {
    // create list of targets left to hit
    //var entityChoices = entityIDs.slice();

    new RandomWave(targets, {}, function() {
        print("Finished");
    });

    // raise targets
    //
    // on hit, remove from list, update score
    //
    // when list is empty or timeout is reached, start next wave
    // if timeout is reached, play obnoxious sound
}
start();
