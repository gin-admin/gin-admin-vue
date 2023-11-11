export default () => ({
    host: true,
    port: 9211,
    proxy: {
        '/api': {
            target: 'http://101.42.232.163:8080/api',
            // target: 'http://127.0.0.1:8045/api',
            changeOrigin: true,
            rewrite: (path) => path.replace('/api', ''),
        },
    },
})
