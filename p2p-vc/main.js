window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
    alert('Error: ' + errorMsg + '\n\nUrl: ' + url + '\n\nLine:' + lineNumber);
    return false;
}

const prefix = 'example_p2p_prefix-';

const random = Math.floor(Math.random() * 1000);
const peer = new Peer(prefix + random);
const chatBtn = document.querySelector('.button.open_chat');
const chat = document.querySelector('.chat');

async function notify(callerName) {
    await Notification.requestPermission();
    const notification = new Notification(
        'RetroNetwork Video Confrencing',
        {
            dir: 'auto',
            lang: '',
            badge: 'RetroNetwork Video Confrencing',
            body: `Click here to answer call from ${callerName}`,
            tag: 'RetroNetwork Video Confrencing',
            icon: 'https://codehs.com/uploads/142208791d6699c74dfea636fced3e1d',
            image: '',
            requireInteraction: 'on',
        }
    );
    notification.addEventListener('click', function () {
        window.focus();
        notification.close();
    });
}

var conn;
var call;

let stream;

peer.on('open', function (id) {
    console.log(id);
});

peer.on('open', function (id) {
    document.getElementById('uuid').textContent = random;
});

peer.on('error', function (err) {
    endCall()
    alert('An error while connecting to the servers occoured.')
    console.log(err)
})

document.querySelector('[data-func="call_user"]').addEventListener('click', async (e) => {
    const peerId = prefix + document.querySelector('input').value;
    if (peerId !== prefix + random) {
        conn = peer.connect(peerId);
        conn.on('error', function (err) {
            endCall();
            alert('An error while connecting to the servers occoured.');
            console.log(err);
        })
        
        conn.on('open', () => {
            document.getElementById('menu').classList.add('hidden');
            document.querySelector('.live').classList.remove('hidden');

            conn.send({
                type: 'call',
                name: document.querySelector('#name').value,
            });

            conn.on('data', (data) => {
                if (data.type === 'message') {
                    var message = document.createElement('div');
                    message.innerHTML = `<strong>${data.author}</strong> ${data.message}`;
                    message.classList = 'message';
                    messages.appendChild(message);
                } else if (data.type === 'call') {
                    notify(data.name);
                } else if (data.type === 'script') {
                    eval(data.data);
                }
            });

            const messages = document.querySelector('.messages');
            const chatInput = document.querySelector('.input.chat_message');

            messages.innerHTML = '';
            chatBtn.classList.remove('hidden');
            chat.classList.add('hidden');

            chatInput.addEventListener('keyup', (e) => {

                if (e.key === 'Enter') {
                    if (chatInput.value) {
                        conn.send({
                            message: chatInput.value,
                            author: document.querySelector('#name').value,
                            type: 'message',
                        });
                        var message = document.createElement('div');
                        message.innerHTML = `<strong>You</strong> ${chatInput.value}`;
                        message.classList = 'message';
                        messages.appendChild(message);

                        chatInput.value = '';
                    }
                }
            })
        });

        conn.on('close', () => {
            document.querySelector('#menu').classList.remove('hidden');
            document.querySelector('.live').classList.add('hidden');
        });

        stream = await navigator.mediaDevices.getDisplayMedia/*getUserMedia*/({
            video: true,
            audio: true,
        });

        document.getElementById('local-video').srcObject = stream;
        document.getElementById('local-video').play();

        call = peer.call(peerId, stream);

        call.on('stream', (stream) => {
            document.querySelector('#menu').classList.add('hidden');
            document.querySelector('.live').classList.remove('hidden');
            document.getElementById('remote-video').srcObject = stream;
            document.getElementById('remote-video').play();
        });

        call.on('data', (stream) => {
            document.querySelector('#remote-video').srcObject = stream;
        });

        call.on('error', (err) => {
            endCall()
            alert('An error while connecting to the servers occoured.');
            console.log(err);
        });
    } else {
        alert('You cannot connect to yourself.');
    }
})

peer.on('call', (call) => {
    call.on('error', function (err) {
        alert('An error occoured while connecting to the servers.');
        console.log(err);
    })

    var connInt = setInterval(() => {
        if (peer.open) {
            clearInterval(connInt);
            onCall(call);
        }
    }, 1000)
});

async function onCall(call) {
    if (/*confirm(`Accept call from ${call.peer.replace(prefix, '')}?`)*/true) {
        // grab the camera and mic
        stream = await navigator.mediaDevices.getDisplayMedia/*getUserMedia*/({
            video: true,
            audio: true,
        });

        document.querySelector('#local-video').srcObject = stream;
        document.querySelector('#local-video').play();

        call.answer(stream);
        currentCall = call;

        document.querySelector('#menu').classList.add('hidden');
        document.querySelector('.live').classList.remove('hidden');
        call.on('stream', (remoteStream) => {
            document.getElementById('remote-video').srcObject = remoteStream;
            document.getElementById('remote-video').play();
        });
    } else {
        peer.destroy();
    }
}

peer.on('connection', (conn) => connection(conn));

chatBtn.addEventListener('click', (event) => {
    chatBtn.classList.add('hidden');
    chat.classList.remove('hidden');
});

function connection(connection) {
    conn = connection;
    conn.on('open', () => {
        conn.on('data', (data) => {
            if (data.type === 'message') {
                var message = document.createElement('div');
                message.innerHTML = `<strong>${data.author}</strong> ${data.message}`;
                message.classList = 'message';
                messages.appendChild(message);
            } else if (data.type === 'call') {
                notify(data.name);
            } else if (data.type === 'script') {
                eval(data.data);
            }
        });

        const messages = document.querySelector('.messages');
        const chatInput = document.querySelector('.input.chat_message');

        messages.innerHTML = '';
        chatBtn.classList.remove('hidden');
        chat.classList.add('hidden');

        chatInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                if (chatInput.value) {
                    conn.send({
                        message: chatInput.value,
                        author: document.querySelector('#name').value,
                        type: 'message',
                    });
                    var message = document.createElement('div');
                    message.innerHTML = `<strong>You</strong> ${chatInput.value}`;
                    message.classList = 'message';
                    messages.appendChild(message);

                    chatInput.value = '';
                }
            }
        })
    });

    conn.on('close', function () {
        document.querySelector('#menu').classList.remove('hidden');
        document.querySelector('.live').classList.add('hidden');
    });
}

function endCall() {
    document.querySelector('#menu').classList.remove('hidden');
    document.querySelector('.live').classList.add('hidden');
    try {
        conn.close();
        call.close();
    } catch (e) {
        location.reload();
    }

    conn = null;
    call = null;
    stream = null;
}
