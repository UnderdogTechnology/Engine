(function() {
    game.tool.object = function(type, filler) {
        if(schemas[type])
            return schemas[type](filler || {});
    };
    
    var schemas = game.tool.object.schemas = {};
    
    // TODO: Create function for adding schemas...
    
    var set_defaults = game.tool.object.set_defaults =  function(template, filler) {
        for(var prop in template) {
            if(!template.hasOwnProperty(prop)) continue;
            
            if(filler.hasOwnProperty(prop) && (filler[prop] || filler[prop] === false)) {
                template[prop] = filler[prop];
            }
        }
        
        return template;
    }
    
    var validate = game.tool.object.validate = function(validation, object) {
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
    
    schemas.story = function(filler) {
        var template = {
            title:          '',
            author:         '',
            description:    '',
            chapters:       game.tool.list('chapter'),
            characters:     game.tool.list('character')
        };
        
        if(filler) {
            template = set_defaults(template, filler);
        }
        
        return template;
    }
    
    schemas.chapter = function(filler) {
        var template = {
            title:          '',
            description:    '',
            characters:     game.tool.list('character'),
            initiators:     game.tool.list('character')
        };
        
        if(filler) {
            template = set_defaults(template, filler);
        }
        
        return template;
    }
    
    schemas.attribute = function(filler) {
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
            template = set_defaults(template, filler);
        }
        
        if(validate(validation, template))
            return template;
    }
    
    schemas.stack = function(filler) {
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
            template = set_defaults(template, filler);
        }
        
        if(validate(validation, template))
            return template;
    }
    
    schemas.item = function(filler) {
        var template = {
            name:      '',
            attributes: game.tool.list('attribute'),
            causes:     game.tool.list('affect')
        };
        
        if(filler) {
            template = set_defaults(template, filler);
        }
        
        return template;
    }
    
    schemas.affect = function(filler) {
        var template = {
            name:       '',
            type:       '',
            value:      1,
            target:     1,
            initiator:  1
        };
        
        if(filler) {
            template = set_defaults(template, filler);
        }
        
        return template;
    }

}())