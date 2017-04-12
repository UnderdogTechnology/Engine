(function() {
    var narrator = game.tool.object('character',  { 
        name: 'Narrator',
        attributes:     game.tool.list('attribute', [
            { name: 'attackable', value: false }
        ])
    });
    
    narrator.conversations.add({
        dialogue: game.tool.list('dialogue',[
            {
                text: 'Greetings!',
                responses: game.tool.list('dialogue', [
                    { text: 'Hey friend!'},
                    { text: 'Hello.'},
                    { text: 'What up hommie?'},
                    { text: 'Where am I?'}
                ])
            },
            {
                text: 'What\'s your name traveller?',
                responses: game.tool.list('dialogue', [
                    { text: 'Joe'},
                    { text: 'Bob'},
                    { text: 'I know you are but what am I?'},
                    { text: 'I don\'t know...'}
                ])
            }
        ])
    });
    
    var bob = game.tool.object('character', {
        name: 'Bob',
        attributes:     game.tool.list('attribute', [
            { name: 'attackable', value: true }
        ])
    });
    
    var tutorial = game.tool.object('story', {
        title:          'Tutorial',
        author:         'David Magee',
        description:    'This story is the tutorial.'
    });
    
    tutorial.characters.add(narrator);
    tutorial.characters.add(bob);
    
    game.data.story.add(tutorial);
    
    narrator.speak();
}())