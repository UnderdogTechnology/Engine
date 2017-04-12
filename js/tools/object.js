game.tool.object = function(type, filler) {
    if(game.tool.object.schemas[type])
        return game.tool.object.schemas[type](filler || {});
};

game.tool.object.schemas = {};

// TODO: Create function for adding schemas...

game.tool.object.set_defaults = function(template, filler) {
    for(var prop in template) {
        if(!template.hasOwnProperty(prop)) continue;
        
        if(filler.hasOwnProperty(prop) && (filler[prop] || filler[prop] === false)) {
            template[prop] = filler[prop];
        }
    }
    
    return template;
}

game.tool.object.validate = function(validation, object) {
    for(var field in validation) {
        if(!validation.hasOwnProperty(field)|| !object.hasOwnProperty(field)) continue;
        if(!validation[field].rule || typeof validation[field].rule !== 'function') continue;
        
        if(!validation[field].rule(object[field])) {
            if(validation[field].message)
                game.ui.alert(validation[field].message, object);
                
            return false
        };
    }
    return true;
}

game.tool.object.schemas.character = function(filler) {
    var template = {
        name:           '',
        type:           'NPC',
        affects:        game.tool.list('affect'),
        attributes:     game.tool.list('attribute'),
        inventory:      game.tool.list('stack'),
        equipment:      game.tool.list('stack'),
        conversations:  game.tool.list('conversation')
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

game.tool.object.schemas.story = function(filler) {
    var template = {
        title:          '',
        author:         '',
        description:    '',
        chapters:       game.tool.list('chapter'),
        characters:     game.tool.list('character')
    };
    
    if(filler) {
        template = game.tool.object.set_defaults(template, filler);
    }
    
    return template;
}

game.tool.object.schemas.chapter = function(filler) {
    var template = {
        title:          '',
        description:    '',
        characters:     game.tool.list('character'),
        initiators:     game.tool.list('character')
    };
    
    if(filler) {
        template = game.tool.object.set_defaults(template, filler);
    }
    
    return template;
}

game.tool.object.schemas.attribute = function(filler) {
    var template = {
        name:   '',
        value:  ''
    };
    
    var validation = {};
    
    validation.name = {
        rule:       function(val) { return typeof val === 'string' && val.length },
        message:    'Name must be populated.'
    };
    
    validation.value = {
        rule:       function(val) { return val || val === false || false },
        message:    'Value must be populated.'
    };
    
    if(template) {
        template = game.tool.object.set_defaults(template, filler);
    }
    
    if(game.tool.object.validate(validation, template))
        return template;
}

game.tool.object.schemas.stack = function(filler) {
    var template = {
        type:   '',
        items:  game.tool.list('item'),
        depth:  1
    };
    
    var validation = {};
    
    validation.type = {
        rule:       function(val) { return ['HEAD','TORSO', 'INVENTORY'].indexOf(val) >= 0 },
        message:    'Type \'<<type>>\' is not within accepted types.'
    }
    
    if(filler) {
        template = game.tool.object.set_defaults(template, filler);
    }
    
    if(game.tool.object.validate(validation, template))
        return template;
}

game.tool.object.schemas.item = function(filler) {
    var template = {
        name:      '',
        attributes: game.tool.list('attribute'),
        causes:     game.tool.list('affect')
    };
    
    if(filler) {
        template = game.tool.object.set_defaults(template, filler);
    }
    
    return template;
}

game.tool.object.schemas.affect = function(filler) {
    var template = {
        name:       '',
        type:       '',
        value:      1,
        target:     1,
        initiator:  1
    };
    
    if(filler) {
        template = game.tool.object.set_defaults(template, filler);
    }
    
    return template;
}