# OreCzml JavaScript Interface

<p align="center">
  <img src=https://github.com/Zudokakikuto/OreCzml-JS-Interface/blob/main/src/iconOreCzml%20JS.png?raw=true alt=""/>
</p>

This project is the continuity of OreCzml available [here](https://github.com/Zudokakikuto/OreCZML), please make sure to check it !

The OreCzml JS interface aims at giving more features to the Cesium environment. Those can be listed as below :
* ![Lights](https://github.com/Zudokakikuto/OreCzml-JS-Interface/blob/main/public/buttons-display/light.png?raw=true) A button to display the day/night cycle light on earth.

<p align="center">
  <img src=https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExMndrZDY0Ym8xcnp1ZzJqb2VkZmdjOWlmZnQ3cnc0YXl5a3pmeDRhZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Uen9mKqcFoRR82xnea/giphy-downsized-large.gif alt=""/>
</p>

* ![ITRF](https://github.com/Zudokakikuto/OreCzml-JS-Interface/blob/main/public/buttons-display/ITRF.png?raw=true) A button to switch the camera between the inertial frame of the earth or a non-rotational earth frame

<p align="center">
  <img src=https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExZnR1bHg4eHdyd25uMXdrZ255a290MDF6Mnk1amNoaGlzNmk5ZXkzcCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/W5yyhpGds6JphALMRI/giphy-downsized-large.gif alt=""/>
</p>

* ![Objects](https://github.com/Zudokakikuto/OreCzml-JS-Interface/blob/main/public/buttons-display/objects.png?raw=true) If a Czml file is loaded, a button to display all the satellites/ground station/bodies is available. This button will display a list of all the objects grouped by nature. Then the user can click the ID of the object to zoom the camera to it.

<p align="center">
  <img src=https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExMm5xYzdzMGpkOWZrbHdtdzlkcWJ5MWVlcW9uZDV0aDJ6OHdhZGd2aCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/MPKPIBCY4PoMq1JOUY/giphy.gif alt=""/>
</p>

![NavBall](https://github.com/Zudokakikuto/OreCzml-JS-Interface/blob/main/public/buttons-display/navball.png?raw=true) A NavBall is available and can be switch off/on with a button. (Under Development) This navball adapt to the object targeted, to represent what is the attitude of the object in the ITR frame.

<p align="center">
  <img src=https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExb3Jtd2d3Z2E2MXY2eHN3dGtqM3NwNmJweHR2MDlqZm0weGJpaXNjZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/48JT6WKUMAEZkBfRQf/giphy.gif alt=""/>
</p>

# How to install

## Cloning the repository
First clone the repository into a new folder with:

`git clone https://gitlab.orekit.org/Zudo/oreczml-js-interface.git`

## Use of npm commands

### Use of nvs
To use npm as commands, you need a version of node installed.
I recommend installing **nvs** available [here](https://github.com/jasongin/nvs)

The readme of the repository should lead you to install nvs for your operating system.


### Install the dependencies

When npm commands are available, you can now open a shell into the folder where the interface is and use:

`npm install`

The shell should display such message: (the numbers are replaced with ***)
```shell
added *** packages and audited *** packages in *s

*** packages are looking for funding
   run 'npm fund' for details

*** vulnerabilities (*** moderate, *** high)

To adress all issues, run:
   npm audit fix
   
Run 'npm audit' for details
```

Now run:
`npm audit fix`

It should resolve the vulnerabilities of the code.

# Run the interface

Now that the dependencies are installed, you can run `npm run build`. To check that the version of the interface that you have correctly build, if not open an issue and put the error message you got.

And finally you can use the command `npm start` to launch the local server to

**To load your own Czml file, modify the 'Output.czml' file in the 'public' folder !**

# Use your token

The cesium ion token is a useful to display a precise skin of the earth. You can find one [here](https://ion.cesium.com/tokens?page=1), once you got one, you can change the line inside the `index.js`, by filling your token inside the "". 
```javascript
// Line to fill:
Ion.defaultAccessToken = "";
```

# Known errors

```
Request has failed. Status Code: 404 
handleError@webpack://cesium test/./node_modules/webpack-dev-server/client/overlay.js?:252:58 
createOverlay/<@webpack://cesiumtest/./node_modules/webpack-dev-server/client/overlay.js?:275:18
```

This error is because there is no Output.czml in the public folder.