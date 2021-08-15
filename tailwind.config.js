module.exports = {
    purge: [
        "./**/*.html",
        "./**/*.tsx",
    ],
    theme: {
        container: {
            center: true,
            padding: "1rem",
        },
    },
    variants: {
        extend: {
            opacity: ["disabled"],
            cursor: ["disabled"],
        },
    },
    plugins: [],
}
