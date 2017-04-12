(function() {
    
    var speak = function() {
        if(this.conversations.count()) {
            var conversations = this.conversations.find({available: true});
            
            console.log(conversations)
        }
    }

    game.tool.object.schemas.character = function(filler) {
        var template = {
            name:           '',
            type:           'NPC',
            affects:        game.tool.list('affect'),
            attributes:     game.tool.list('attribute'),
            inventory:      game.tool.list('stack'),
            equipment:      game.tool.list('stack'),
            conversations:  game.tool.list('conversation'),
            speak:          speak
        };
        
        var validation = {};
        
        validation.name = {
            rule:       function(val) { return typeof val === 'string' && val.length },
            message:    'Name must be a string value.'
        };
        
        validation.type = {
            rule:       function(val) { return ['NPC', 'PLAYER'].indexOf(val) >= 0 },
            message:    'Type \'<<type>>\' is not within accepted types.'
        };
        
        if(filler) {
            template = game.tool.object.set_defaults(template, filler);
        }
        
        if(game.tool.object.validate(validation, template))
            return template;
    }

}())