export default () => ({
    host: true,
    port: 9211,
    proxy: {
        '/api': {
            target: 'http://101.42.232.163:8040/api',
            changeOrigin: true,
            rewrite: (path) => path.replace('/api', ''),
        },
    },
})
