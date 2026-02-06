export default defineAppConfig({
  ui: {
    colors: {
        //primary: 'blue',
        //secondary: 'purple',
        neutral: "zinc"
    },
    button: {
      variants: {
        size: {
          md: {
            base: 'px-5 py-2'
          }
        }
      }
    },
    input: {
      variants: {
        size: {
          md: {
            base: 'h-full'
          }
        }
      }
    }
  }
})