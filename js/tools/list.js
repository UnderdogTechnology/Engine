game.tool.list = function(type, defaults, global) {
    var list = {
        items:  {},
        type:   type || ''
    };
    
    list.next_id = function() {
        var keys = Object.keys(list.items).sort(),
            i = keys.length - 1;
            
        while(i >= 0) {
            var key = keys[i];
            --i;
            if(isNaN(key)) continue;
            return ++key;
        }
        return 1;
    };
    
    list.count     = function() {
        return Object.keys(list.items).length
    };
    
    list.copy     = function() {
        // TODO: fix this shiiiiiiiit
        if (null == list || "object" != typeof list) return game.tool.list(list.type);
        var copy = game.tool.list(list.type);
        
        if(Object.keys(list.items).length > 0) {
            copy.items = Object.assign(list.items);
        }
        
        return copy;
    };
    
    list.find      = function(o) {
        if(!o) return list;
        
        var found = {}
            items = list.items;
        
        for(var key in items) {
            if(!items.hasOwnProperty(key)) continue;
            var match = true;
            for(var prop in o) {
                if(!o.hasOwnProperty(prop) || !items[key].hasOwnProperty(prop)) continue;
                if(o[prop] != items[key][prop]) {
                    match = false;
                    break;
                }
            }
            if(match) found[key] = Object.assign(items[key]);
        }
        
        var out = list.copy();
        
        out.items = found;
        
        return out;
    }
    list.add       = function(o, global, id, not_init) {
        if(!o) return list;
        
        var found = list.find(o);
        
        if(found.count()) return;
        
        var data = game.data[list.type],
            g_id;
        
        if(!data && global) {
            data = game.data[list.type] = game.data[list.type] || tool.list(list.type);
        }
    
        if(data && data != list) {
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
        
        o = game.tool.object(list.type, o);
        found = list.find(o);
        if(found.count()) return;
        
        id = id || list.next_id();
        
        if(!o.id) {
            o.id = g_id || id;
        }
        
        list.items[id] = o;
        
        return list;
    };
    
    list.remove    = function(o, global) {
        if(!o) return list;
        var found = list.find(o),
            items = list.items;
        
        for(var key in found.items) {
            if(!found.items.hasOwnProperty(key) || !items.hasOwnProperty(key)) continue;
            
            if(global) {
                var data    = game.data[list.type],
                    id      = items[key].id;
                
                if(data && data.items && id) {
                    data.remove({id: id});
                }
            }
            
            delete items[key];
        }
        
        return list;
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