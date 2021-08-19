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

        theme: {
          extend: {
           spacing: {
             '96': '35rem',
           }
          }
        },
    
    plugins: [],
}
