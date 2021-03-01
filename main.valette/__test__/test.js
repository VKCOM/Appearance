const paletteMvk = require('../palette');
const paletteWeb = require('../palette_web');

function checkColorSyntax(palette) {
  Object.keys(palette).forEach((colorName) => {
    const colorValue = palette[colorName];
    if(!/^#([A-F0-9]{3,4}|[A-F0-9]{6}|[A-F0-9]{8})$/.test(colorValue)) {
      throw new Error(`Syntax '${colorName}': ${colorValue} is not a valid`);
    }
  });
}

[paletteMvk, paletteWeb].forEach(palette => checkColorSyntax(palette));


const schemeWeb = require('../scheme_web');

function checkWebSchemeColorDefine(colors, palette) {
  const colorsList = Object.keys(colors);
  const paletteList = Object.keys(palette)
  colorsList.forEach((colorSchemeName) => {
    const colorIdentifier = colors[colorSchemeName].color_identifier;
    if(!paletteList.includes(colorIdentifier)) {
      throw new Error(`Color '${colorSchemeName}': ${colorIdentifier} from web scheme is not define in web palette`);
    }
  });
}

Object.values(schemeWeb).forEach((scheme) => {
  checkWebSchemeColorDefine(scheme.colors, paletteWeb);
});
