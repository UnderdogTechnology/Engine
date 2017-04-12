(function(){
    var next_id = function() {
        var keys = Object.keys(this.items).sort(),
            i = keys.length - 1;
            
        while(i >= 0) {
            var key = keys[i];
            --i;
            if(isNaN(key)) continue;
            return ++key;
        }
        return 0;
    };
    
    var count = function() {
        return Object.keys(this.items).length
    };
    
    var copy = function() {
        // TODO: fix this shiiiiiiiit
        if (null == this || "object" != typeof this) return game.tool.list(this.type);
        var copy = game.tool.list(this.type);
        
        if(Object.keys(this.items).length > 0) {
            copy.items = Object.assign(this.items);
        }
        
        return copy;
    };
    
    var find = function(o) {
        if(!o) return this;
        
        var found = {}
            items = this.items;
        
        for(var key in items) {
            if(!items.hasOwnProperty(key)) continue;
            var match = true;
            for(var prop in o) {
                if(!o.hasOwnProperty(prop) || !items[key].hasOwnProperty(prop)) continue;
                
                if(typeof items[key][prop] === 'function') {
                    if(o[prop] != items[key][prop]()) {
                        match = false;
                        break;
                    }
                    continue;
                }
                
                if(o[prop] != items[key][prop]) {
                    match = false;
                    break;
                }
            }
            if(match) found[key] = Object.assign(items[key]);
        }
        
        var out = this.copy();
        
        out.items = found;
        
        return out;
    };
    
    var add = function(o, global, id, not_init) {
        if(!o) return this;
        
        var found = this.find(o);
        
        if(found.count()) return;
        
        var data = game.data[this.type],
            g_id;
        
        if(!data && global) {
            data = game.data[this.type] = game.data[this.type] || game.tool.list(this.type);
        }
    
        if(data && data != this) {
            if(o.id) {
                found = data.find({id: o.id});
                
                if(found.count() && found.items.hasOwnProperty(o.id)) {
                    o = found.items[o.id];
                }
            } else if(!not_init) {
                g_id = o.id = data.next_id();
                data.add(o, true, null, true);
            }
        }
        
        o = game.tool.object(this.type, o);
        found = this.find(o);
        if(found.count()) return;
        
        id = id || this.next_id();
        
        if(!o.id) {
            o.id = g_id || id;
        }
        
        this.items[id] = o;
        
        return this;
    };
    
    var remove = function(o, global) {
        if(!o) return this;
        var found = this.find(o),
            items = this.items;
        
        for(var key in found.items) {
            if(!found.items.hasOwnProperty(key) || !items.hasOwnProperty(key)) continue;
            
            if(global) {
                var data    = game.data[this.type],
                    id      = items[key].id;
                
                if(data && data.items && id) {
                    data.remove({id: id});
                }
            }
            
            delete items[key];
        }
        
        return this;
    };
    
    game.tool.list = function(type, defaults, global) {
    
        if(!game.tool.object.schemas[type]) return;
    
        var list = {
            next_id:    next_id,
            count:      count,
            copy:       copy,
            find:       find,
            add:        add,
            remove:     remove,
            items:      {},
            type:       type || ''
        };

        for(var i in defaults) {
            if(Array.isArray(defaults)) {
                list.add(defaults[i], global);
                continue;
            }
            list.add(defaults[i], global, i);
        }
        
        return list;
    }
}());