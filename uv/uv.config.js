self.__uv$config = {
    prefix: '/stuff/uv/service/',
    bare: 'https://polarislearning.arg/bare/',
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: 'https://unpkg.com/@titaniumnetwork-dev/ultraviolet@2.0.0/dist/uv.handler.js',
    client: 'https://unpkg.com/@titaniumnetwork-dev/ultraviolet@2.0.0/dist/uv.client.js',
    bundle: 'https://unpkg.com/@titaniumnetwork-dev/ultraviolet@2.0.0/dist/uv.bundle.js',
    config: 'https://unpkg.com/@titaniumnetwork-dev/ultraviolet@2.0.0/dist/uv.config.js',
    sw: 'https://unpkg.com/@titaniumnetwork-dev/ultraviolet@2.0.0/dist/uv.sw.js',
};
