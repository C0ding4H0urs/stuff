var frame = document.createElement('iframe');
frame.setAttribute('src','');
frame.setAttribute('width', 500);
frame.setAttribute('height', 500);
document.body.appendChild(frame);

frame.contentWindow.document.documentElement = `Hello ${prompt('What is your name?')}!`;