const frame = document.createElement('iframe');
frame.setAttribute('src','');
frame.setAttribute('width', 500);
frame.setAttribute('height', 500);
document.body.appendChild(frame);

const fetch = await fetch('https://russell2259.github.io/stuff/devtools.html');
const template = fetch.json();

frame.contentWindow.document.write(template);