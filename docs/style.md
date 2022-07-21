# :artist: Styling, CSS, and Icons

We use [Bluma](https://bulma.io).


## Global styles

- Edit the `sass/mystyles.css` to override Bulma defaults
- Run `npm run css-build` to compile the Bulma+customizations to `css/styles.css` (not version tracked)
- Add additional global styles to `css/main.css`


## Component specific stylesheet

In addition to global styles you can add component specific styles to your components

```vue
<script scoped>
.mydivstyle {
    text-size: 1.1em;
}
</script>
```

or global styles

```vue
<script>
.mydivstyle {
    text-size: 1.1em;
}
</script>
```

## How to add new icons

We use [FontAwesome Icons](https://fontawesome.com/icons/square-check?s=solid) (free).




