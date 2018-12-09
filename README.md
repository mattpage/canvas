# canvas

My scratchbuilt game framework, some basic physics, and some interesting demos.

* Useful Canvas and Game abstractions
* Multi-channel audio support
* Mouse and Keyboard support
* Physics - constraints, collision detection, vectors, etc
* Particles - the beginning of a particle system

## Demos
* Basic - Draws multiple color rectangles on the screen. Demonstrates mouse interaction. 
* Balls - Balls bouncing about in a constraining box. Demonstrates mouse interaction, double buffering, and Physics (constraints + deflection). 
* Asteroids - A playable version of the classic 1979 space shooter. Full featured demo of Physics (w/Spatial Partitioning), Keyboard, double buffering, and Audio.
* Particles - A fountain of confetti-like particles.
* Attract - Particles are attracted to and swarm the mouse cursor.

## scripts
run the demo(s)
```
npm start
```

run the tests
```
npm test
```

generate test coverage report
```
npm run coverage
open coverage/lcov-report/index.html
```

## resources
* [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
* [Drawing shapes](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes)
* [Advanced Animations](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Advanced_animations)
* [HTML5 Canvas Game: 2D Collision Detection](http://blog.sklambert.com/html5-canvas-game-2d-collision-detection)
* [Quick Tip: Use Quadtrees to Detect Likely Collisions in 2D Space](https://gamedevelopment.tutsplus.com/tutorials/quick-tip-use-quadtrees-to-detect-likely-collisions-in-2d-space--gamedev-374)
* [Javascript Gauntlet - Collision Detection](https://codeincomplete.com/posts/javascript-gauntlet-collision-detection/)
* [Revisting HTML5 Audio](https://codeincomplete.com/posts/revisiting-html5-audio/)
* [Leshy SFMaker](https://www.leshylabs.com/apps/sfMaker/)

