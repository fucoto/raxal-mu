var sceneEl = document.querySelector('a-scene');
console.log({sceneEl});

var soundLoaded = false;
function handleSoundLoaded(event) {
  soundLoaded = true;
  trySound(event);
}

var interacted = false;
function handleInteraction(event) {
  interacted = true;
  trySound(event);
}

function trySound(event) {
    var els = sceneEl.querySelectorAll('[sound]');
    for (var i = 0; i < els.length; i++) {
      const sound = els[i].components.sound;
      sound.pauseSound();
      sound.playSound();
    }
}
  
AFRAME.registerComponent('log', {
  schema: {type: 'string'},

  init: function () {
    var stringToLog = this.data;
    // console.log(stringToLog);
    
    document.body.addEventListener('mousemove', handleInteraction);
    document.body.addEventListener('scroll', handleInteraction);
    document.body.addEventListener('keydown', handleInteraction);
    document.body.addEventListener('click', handleInteraction);
    document.body.addEventListener('touchstart', handleInteraction);
    
    var els = sceneEl.querySelectorAll('[sound]');
    for (var i = 0; i < els.length; i++) {
      els[i].addEventListener('sound-loaded', handleSoundLoaded);
    }
  }
});

AFRAME.components["look-controls"].Component.prototype.onTouchMove = function (evt) {
  var direction;
  var canvas = this.el.sceneEl.canvas;
  var deltaY;
  var yawObject = this.yawObject;
  if (!this.touchStarted || !this.data.touchEnabled) {
    return;
  }
  deltaY = /*2 * */ -Math.PI * (evt.touches[0].pageX - this.touchStart.x) / canvas.clientWidth;
  direction = this.data.reverseTouchDrag ? 1 : -1;

  yawObject.rotation.y -= deltaY * 0.5 * direction;

  var deltaX = -100 * (evt.touches[0].pageY - this.touchStart.y) / canvas.clientHeight;

  var d = new THREE.Vector3();
  this.el.sceneEl.camera.getWorldDirection(d);
  d.multiplyScalar(deltaX);

  this.el.object3D.position.x += d.x;
  this.el.object3D.position.z += d.z;
  //this.el.object3D.position.y += d.y;

  this.touchStart = {
    x: evt.touches[0].pageX,
    y: evt.touches[0].pageY
  };
}

