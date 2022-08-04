import * as THREE from "three"
import { FontLoader } from "three/examples/jsm/loaders/FontLoader"

const fontUrl = new URL("/fonts/nasa.json", import.meta.url).href;

export function generateText({ text, size = 1, position = [0, 0, 0], rotation = [0, 0, 0], hasSide = false }) {
  let displayedText = new THREE.Object3D();
  const fontLoader = new FontLoader();
  fontLoader.load(fontUrl, (font) => {
    let color = 0xffffff;
    const matDark = new THREE.LineBasicMaterial({
      color,
      side: hasSide && THREE.DoubleSide,
    });

    const shapes = font.generateShapes(text, size);
    const geo = new THREE.ShapeBufferGeometry(shapes);
    geo.computeBoundingBox();
    const xMid = -0.5 * (geo.boundingBox.max.x - geo.boundingBox.min.x);
    geo.translate(xMid, 0, 0);
    const generatedText = new THREE.Mesh(geo, matDark);
    generatedText.position.set(...position);
    generatedText.rotation.set(...rotation);
    displayedText.add(generatedText);
  });
  return displayedText;
};

export function makeTextSprite(message, parameters) {
  if (parameters === undefined) parameters = {};
  var fontface = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Arial";
  var fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 18;
  var borderThickness = parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 4;
  var borderColor = parameters.hasOwnProperty("borderColor") ? parameters["borderColor"] : { r: 0, g: 0, b: 0, a: 1.0 };
  var backgroundColor = parameters.hasOwnProperty("backgroundColor") ? parameters["backgroundColor"] : { r: 0, g: 0, b: 255, a: 1.0 };
  var textColor = parameters.hasOwnProperty("textColor") ? parameters["textColor"] : { r: 244, g: 244, b: 244, a: 1.0 };

  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  context.font = "Bold " + fontsize + "px " + fontface;
  var metrics = context.measureText(message);
  var textWidth = metrics.width;

  context.fillStyle = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")";
  context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";
  context.fillStyle = "rgba(" + textColor.r + ", " + textColor.g + ", " + textColor.b + ", 1.0)";
  context.fillText(message, borderThickness, fontsize + borderThickness);

  var texture = new THREE.Texture(canvas)
  texture.needsUpdate = true;
  var spriteMaterial = new THREE.SpriteMaterial({ map: texture, useScreenCoordinates: false });
  var sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(0.25 * fontsize, 0.125 * fontsize);
  return sprite;
}