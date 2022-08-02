import * as THREE from "three"
import { FontLoader } from "three/examples/jsm/loaders/FontLoader"

const fontUrl = new URL("../fonts/josefin.json", import.meta.url).href;

export function generateText(text, position, rotation = [0, 0, 0], hasSide = false) {
  let displayedText = new THREE.Object3D();
  const fontLoader = new FontLoader();
  fontLoader.load(fontUrl, (font) => {
    let color = 0xffffff;
    const matDark = new THREE.LineBasicMaterial({
      color,
      side: hasSide && THREE.DoubleSide,
    });

    const shapes = font.generateShapes(text, 5);
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