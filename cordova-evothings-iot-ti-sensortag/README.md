# SAM Implementation of a Demo app for the TI SensorTag

This app demonstrates how to read the accelerometer of the Texas Instruments SensorTag.

The app displays an image that can be moved by tilting the SensorTag in various directions.

This app is based on the EvoThings Studio [TI SensorTag sample](https://evothings.com/doc/examples/ble-ti-sensortag-cc2650-demo.html) and the GoogleVR [Sensor Fusion Library WebVR](https://github.com/googlevr/webvr-polyfill)  

The code was tested with a TI CC2650 SensorTag kit.

The SAM implementation can be found in the index.html file. 

Note: I am not sure if my sensor is defective, but I had to turn off the gyroscope data in the position calculations otherwise the position seemed to be random.
