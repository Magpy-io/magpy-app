# OpenCloud-photos

## Installation

### Android development setup
Follow [this tutorial](https://reactnative.dev/docs/environment-setup
).

To install openjdk : 
```
sudo apt-get install openjdk-11-jdk
```

To install Android Studio : 
```
sudo snap install android-studio --classic
```

### Install adb
```
sudo apt install adb
```
Use command `adb devices` to list all devices.

## Configuration

Add the IP adress and port of your server. In the file Helpers/Queries.tsx, edit the following lines.

```
const HOST = "192.168.0.12";
const PORT = "8000";
```


## Running the client 

```
yarn install
```

```
yarn start --reset-cache
```

```
yarn android
```

