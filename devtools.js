var frame = document.createElement('iframe');
frame.setAttribute('src','');
document.body.appendChild(frame);

frame.contentWindow.document.documentElement = `Hello ${prompt('What is your name?')}!`;