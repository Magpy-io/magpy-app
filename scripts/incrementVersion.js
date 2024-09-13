const semver = require( 'semver');
const {readFile} = require('node:fs/promises');
const replace = require('replace-in-file');

async function mainAsync(){

  const {gradleFile, versionIncrementLevel} = checkInput();

  const currentPackageJsonVersion = await extractPackageJsonVersion();

  if(!currentPackageJsonVersion){
    throw new Error("Version not found in package.json file.")
  }
  
  const gradleFileContent = await readFile(gradleFile, 'utf8');

  const currentGradleVersionNumber = extractGradleVersionNumber(gradleFileContent)
  const currentGradleVersionCode = extractGradleVersionCode(gradleFileContent)

  if(currentGradleVersionNumber != currentPackageJsonVersion){
    throw new Error("Version numbers in package.json does not match the one in build.gradle file.")
  }

  const newVersionName = semver.inc(currentPackageJsonVersion, versionIncrementLevel)
  const newVersionCode = (parseInt(currentGradleVersionCode, 10) + 1).toString()

  await replaceVersionNameInGradleFile(gradleFile, newVersionName)
  await replaceVersionCodeInGradleFile(gradleFile, newVersionCode)
  await replaceVersionNameInPackageFile(newVersionName)
  
}

async function extractPackageJsonVersion(){
  const packageJsonFile = await readFile('./package.json', 'utf8');
  const packageJson = JSON.parse(packageJsonFile);
  return packageJson.version;
}

async function replaceVersionNameInPackageFile(newVersion){
  const versionPattern = /"version":\s*"\d+\.\d+\.\d+"/;

  const options = {
    files: './package.json',
    from: versionPattern,
    to: (match) => {
      return match.replace(/\d+\.\d+\.\d+/, newVersion);
    },
  };
  
  await replace(options);
}

async function replaceVersionCodeInGradleFile(gradleFilePath, newVersionCode){

  const versionCodePattern = /versionCode\s*\d+/; 

  const options = {
    files: gradleFilePath,
    from: versionCodePattern,
    to: (match) => {
      return match.replace(/\d+/, newVersionCode);
    },
  };
  
  await replace(options);
}

async function replaceVersionNameInGradleFile(gradleFilePath, newVersion){

  const versionNamePattern = /versionName\s*"\d+\.\d+\.\d+"/; 

  const options = {
    files: gradleFilePath,
    from: versionNamePattern,
    to: (match) => {
      return match.replace(/\d+\.\d+\.\d+/, newVersion);
    },
  };
  
  await replace(options);
}

function checkInput(){

  if(process.argv.length < 4){
    throw new Error("Missing arguments, first argument is the path to gradle file, and the second should be 'major', 'minor' or 'patch'")
  }

  const gradleFile = process.argv[2];
  const versionIncrementLevel = process.argv[3];

  if(versionIncrementLevel != "major" && versionIncrementLevel != 'minor' && versionIncrementLevel != 'patch'){
    throw new Error("wrong argument, the second argument should be 'major', 'minor' or 'patch'")
  }

  return {gradleFile, versionIncrementLevel}
}

function extractGradleVersionNumber(gradleFileContent){
  const versionNamePattern = /versionName\s*"\d+\.\d+\.\d+"/;

  const gradleVersionName = gradleFileContent.match(versionNamePattern)?.[0]

  if(!gradleVersionName){
    throw new Error("Version name not found in build.gradle file")
  }

  const versionNumberPattern = /\d+\.\d+\.\d+/;
  const currentGradleVersionNumber = gradleVersionName.match(versionNumberPattern)?.[0]
  return currentGradleVersionNumber;
}

function extractGradleVersionCode(gradleFileContent){
  const versionCodePattern = /versionCode\s*\d+/;

  const gradleVersionCode = gradleFileContent.match(versionCodePattern)?.[0]

  if(!gradleVersionCode){
    throw new Error("Version code not found in build.gradle file")
  }

  const versionCodeNumberPattern = /\d+/;
  const currentGraldeVersionCode = gradleVersionCode.match(versionCodeNumberPattern)?.[0]
  return currentGraldeVersionCode
}

mainAsync().catch((e) => console.log(e.message))