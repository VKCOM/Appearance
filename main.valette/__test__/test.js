/*
  checks the validity of the color syntax
*/

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

/*
  checks that the colors specified in the scheme are define in the palette
*/

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

/*
  checks that the colors of the scheme are define in each theme
*/

function checkWebSchemeFullness(schemesList) {
  const tokenLists = {};
  Object.keys(schemesList).forEach((schemeName) => {
    tokenLists[schemeName] = Object.keys(schemesList[schemeName].colors);
  });
  Object.keys(tokenLists).forEach((schemeNameCurrent, _, schemeNameArr) => {
    schemeNameArr.forEach((schemeName) => {
      if (schemeName === schemeNameCurrent) {
        return;
      }
      tokenLists[schemeNameCurrent].forEach((token) => {
        if (!tokenLists[schemeName].includes(token)) {
          throw new Error(`Color '${token}' define in '${schemeNameCurrent}', but not define in '${schemeName}' theme`)
        }
      })
    });
  });
}

checkWebSchemeFullness(schemeWeb);

/*
  checks that the colors deprecated and transparent_version in in all schemes
*/

function checkWebSchemeDeprecatedFullness(schemesList) {
  let deprecatedTokenLists = new Set();
  let transparentTokenLists = new Set();
  Object.keys(schemesList).forEach((schemeName) => {
    const curSchemeColors = schemesList[schemeName].colors;
    Object.keys(curSchemeColors).forEach((colorName) => {
      if (curSchemeColors[colorName].deprecated_for_web) {
        deprecatedTokenLists.add(colorName);
      }
      if (curSchemeColors[colorName].transparent_version) {
        transparentTokenLists.add(colorName);
      }
    });
  });
  deprecatedTokenLists = Array.from(deprecatedTokenLists);
  transparentTokenLists = Array.from(transparentTokenLists);
  Object.keys(schemesList).forEach((schemeName) => {
    const curSchemeColors = schemesList[schemeName].colors;
    Object.keys(curSchemeColors).forEach((colorName) => {
      if (deprecatedTokenLists.includes(colorName) && !curSchemeColors[colorName].deprecated_for_web) {
        throw new Error(`Color ${colorName} is deprecated for web not in all schemes`);
      }
      if (transparentTokenLists.includes(colorName) && !curSchemeColors[colorName].transparent_version) {
        throw new Error(`Color ${colorName} has a transparent_version property not in all schemes`);
      }
    });
  });
}

checkWebSchemeDeprecatedFullness(schemeWeb);
