game.tool.object.schemas.conversation = function(filler) {
    var template = {
        over:       false,
        available:  function() { return true },
        dialogue:   game.tool.list('dialogue')
    };
    
    if(filler) {
        template = game.tool.object.set_defaults(template, filler);
    }
    
    return template;
}

game.tool.object.schemas.dialogue = function(filler) {
    var template = {
        spoken:     false,
        text:       '',
        responses:   game.tool.list('dialogue')
    };
    
    if(filler) {
        template = game.tool.object.set_defaults(template, filler);
    }
    
    return template;
}