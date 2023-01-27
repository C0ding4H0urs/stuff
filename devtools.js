const frameEl = document.createElement('iframe');
frameEl.setAttribute('src','');
frameEl.setAttribute('width', 500);
frameEl.setAttribute('height', 500);
document.body.appendChild(frameEl);

const fetch = await fetch('https://russell2259.github.io/stuff/devtools.html');
const template = fetch.json();
const frame = frameEl.contentDocument;

frame.documentElement = template;
frame.eval('alert("test")');