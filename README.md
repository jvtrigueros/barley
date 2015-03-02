# barley
>  A Ghost theme derived from [GhostLook's Magnum](http://magnum.ghostlook.com/) theme.

This theme is a fork of the Magnum theme, there were some changes made that make it a bit easier to hack on. A lot of the unused files were removed and there code was in general cleaned up a bit.

This fork will probably not merge upstream.

### Features
- Out of the box support for Disqus and Google Analytics.
- Included Attributions page.
- Code highlighting using [Google's Code Prettify](https://code.google.com/p/google-code-prettify/).

### Demo
Here's [demo](http://blog.jvtrigueros.com/).

### Installation
Download [theme](https://github.com/jvtrigueros/barley/releases/latest) and extract into in your `<Ghost directory>/content/themes`.

#### Disqus
To configure Disqus edit `barley/partials/disqus.hbs`.

#### Google Analytics
To configure Google Analytics edit `barley/partials/google-analytics.hbs`.

### Build
If you want to build it from source, clone the project

    git clone https://github.com/jvtrigueros/barley.git
    cd barley

Install build and frontend dependencies

    npm install

Build asset pipeline

    npm install -g gulp
    gulp
    # OR if you don't want to install gulp globally
    ./node_modules/.bin/gulp

This will minify all javascript and compile all the less files into css then minify it as well.

All preprocessed assets are in `src/`, if you'll be working on these files a lot, I'd recommend running `gulp watch`. This will watch all the preprocessed assets as you change them. 

### Issues and Feature Requests
Please submit a Github issue.
