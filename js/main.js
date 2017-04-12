(function() {
    var q = function(query, context) {
        return (context || document).querySelector(query);
    };
    
    String.prototype.format = function(object) {
        var string = this.toString();
        if(typeof object !== 'object') return string;
        
        for(var key in object) {
            if (!object.hasOwnProperty(key)) continue;
            
            string = string.replace(new RegExp('<<' + key + '>>', 'g'), object[key]);
        }
        
        return string;
    }
    
    var game = window.game = window.game || {
        ui:     {},
        tool:   {},
        data:   {}
    };

    game.ui.prompt = function(message, object) {
        var output = q('#output');
        message = message.format(object);
        
        output.innerText = output.innerText + message + '\n';
        return message;
    }
    
    game.ui.alert = function(message, object) {
        var output = q('#output');
        message = message.format(object);
        
        output.innerText = output.innerText + message + '\n';
        return message;
    }
    
    game.new = function() {
        game.data.player     = game.tool.object('character', {
            name:   game.ui.prompt('Greetings traveller! What is your name?'),
            type:   'PLAYER'
        });
        game.data.story      = game.tool.list('story');
        game.data.character  = game.tool.list('character');
        game.data.item       = game.tool.list('item');
        var stories = ['tutorial'];
        load(stories, 'stories');
    }
    
    var count = 0;
    
    var load = function(modules, path, cb) {
        var loaded = 0;
        
        var load = function() {
            loaded += 1;
            if (loaded === modules.length && cb) cb();
        }
        
        if(path) {
            path += '/';
        }
        
        for(var i in modules) {
            var source = '/js/' + (path || '') + modules[i] + '.js'
            console.log('loading \'' + source + '\'');
            var script = document.createElement('script');
            script.onload = load;
            script.src = source;
            document.head.appendChild(script);
        }
    }
    
    var tools = ['list', 'object'];
    
    var something = ['conversation', 'character'];
    
    load(tools, 'tools', load.bind(this, something, '', game.new));
}());