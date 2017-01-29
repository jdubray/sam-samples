// File: tisensortag.js

/**
 * @namespace
 * @description Top-level object that holds generic functions and sub-modules.
 * @public
 */
evothings.tisensortag = {}

/**
 * Constant identifying the CC2650 Bluetooth Smart SensorTag.
 * @public
 */
evothings.tisensortag.CC2650_BLUETOOTH_SMART = 'CC2650 Bluetooth Smart'

/**
 * Constant identifying the CC2541 Bluetooth Smart SensorTag.
 * @public
 */
evothings.tisensortag.CC2541_BLUETOOTH_SMART = 'CC2541 Bluetooth Smart'

/**
 * Public. Create a SensorTag instance.
 * @param {string} type String with type of tag. Use constants
 * evothings.tisensortag.CC2650_BLUETOOTH_SMART and
 * evothings.tisensortag.CC2541_BLUETOOTH_SMART.
 * @returns {@link evothings.tisensortag.SensorTagInstance} or null
 * if an object of the requested type cannot be created.
 * @public
 */
evothings.tisensortag.createInstance = function(type)
{
	// TODO: Update this function as new models are added.

	// Get a factory object that will add in specific methods.
	if (evothings.tisensortag.CC2541_BLUETOOTH_SMART == type)
	{
		var factory = evothings.tisensortag.ble.CC2541
	}
	else if (evothings.tisensortag.CC2650_BLUETOOTH_SMART == type)
	{
		var factory = evothings.tisensortag.ble.CC2650
	}
	else
	{
		return null
	}

	// Create abstract instance.
	var instance = evothings.tisensortag.createGenericInstance()

	// Add specific implementation.
	return factory.addInstanceMethods(instance)
}

/**
 * Create an object with functions common to all SensorTag models.
 * This object specifies the public interface for SensorTag instances.
 * @public
 */
evothings.tisensortag.createGenericInstance = function()
{
	/**
	 * @namespace
	 * @alias evothings.tisensortag.SensorTagInstance
	 * @description Abstract SensorTag instance object that defines a common interface.
	 * @public
	 */
	var instance = {}

	/**
	 * Internal. Default error handler function.
	 * @instance
	 * @private
	 */
	instance.errorFun = function(error)
	{
		console.log('SensorTag error: ' + error)
	}

	/**
	 * Internal. Default status handler function.
	 * @instance
	 * @private
	 */
	instance.statusFun = function(status)
	{
		console.log('SensorTag status: ' + status)
	}

	/**
	 * Public. Set the IR temperature notification callback.
	 * @param fun - success callback called repeatedly: fun(data)
	 * @param interval - update rate in milliseconds (min 300ms)
	 * @instance
	 * @public
	 */
	instance.temperatureCallback = function(fun, interval)
	{
		return instance
	}

	/**
	 * Public. Set the accelerometer notification callback.
	 * @param fun - success callback called repeatedly: fun(data)
	 * @param interval - accelerometer rate in milliseconds.
	 * @instance
	 * @public
	 */
	instance.accelerometerCallback = function(fun, interval)
	{
		return instance
	}

	/**
	 * Public. Set the humidity notification callback.
	 * @param fun - success callback called repeatedly: fun(data)
	 * @param interval - humidity rate in milliseconds.
	 * @instance
	 * @public
	 */
	instance.humidityCallback = function(fun, interval)
	{
		return instance
	}

	/**
	 * Public. Set the magnetometer notification callback.
	 * @param fun - success callback called repeatedly: fun(data)
	 * @param interval - magnetometer rate in milliseconds.
	 * @instance
	 * @public
	 */
	instance.magnetometerCallback = function(fun, interval)
	{
		return instance
	}

	/**
	 * Public. Set the barometer notification callback.
	 * @param fun - success callback called repeatedly: fun(data)
	 * @param interval - barometer rate in milliseconds.
	 * @instance
	 * @public
	 */
	instance.barometerCallback = function(fun, interval)
	{
		return instance
	}

	/**
	 * Public. Set the gyroscope notification callback.
	 * @param fun - success callback called repeatedly: fun(data)
	 * @param interval - gyroscope rate in milliseconds.
	 * @param axes - (optional) the axes to enable ((z << 2) | (y << 1) | x)
	 * Only available on SensorTag CC2541.
	 * Axis parameter values are:
	 * 1 = X only, 2 = Y only,
	 * 3 = X and Y, 4 = Z only,
	 * 5 = X and Z, 6 = Y and Z,
	 * 7 = X, Y and Z.
	 * @instance
	 * @public
	 */
	instance.gyroscopeCallback = function(fun, interval, axes)
	{
		return instance
	}

	/**
	 * Public. Set the luxometer notification callback.
	 * @param fun - success callback called repeatedly: fun(data)
	 * @param interval - luxometer rate in milliseconds.
	 */
	instance.luxometerCallback = function(fun, interval)
	{
		return instance
	}

	/**
	 * Public. Set the keypress notification callback.
	 * @param fun - success callback called when a key is pressed: fun(data)
	 * @instance
	 * @public
	 */
	instance.keypressCallback = function(fun)
	{
		return instance
	}

	/**
	 * Public. Set the error handler function.
	 * @param fun - error callback: fun(error)
	 * @instance
	 * @public
	 */
	instance.errorCallback = function(fun)
	{
		instance.errorFun = fun

		return instance
	}

	/**
	 * Public. Set the status handler function.
	 * @param fun - callback: fun(status)
	 * @instance
	 * @public
	 */
	instance.statusCallback = function(fun)
	{
		instance.statusFun = fun

		return instance
	}

	/**
	 * Public. Call the error handler function.
	 * @instance
	 * @public
	 */
	instance.callErrorCallback = function(error)
	{
		instance.errorFun && instance.errorFun(error)
	}

	/**
	 * Public. Call the status handler function.
	 * @instance
	 * @public
	 */
	instance.callStatusCallback = function(status)
	{
		instance.statusFun && instance.statusFun(status)
	}

	/**
	 * Public. Get device model number.
	 * @instance
	 * @public
	 */
	instance.getDeviceModel = function()
	{
		return instance.deviceModel
	}

	/**
	 * Public. Get firmware string.
	 * @instance
	 * @public
	 */
	instance.getFirmwareString = function()
	{
		return instance.firmwareString
	}

	/**
	 * Public. Checks if the Temperature sensor is available.
	 * @preturn true if available, false if not.
	 * @instance
	 * @public
	 */
	instance.isTemperatureAvailable = function()
	{
		return instance
	}

	/**
	 * Public. Checks if the accelerometer sensor is available.
	 * @preturn true if available, false if not.
	 * @instance
	 * @public
	 */
	instance.isAccelerometerAvailable = function()
	{
		return false
	}

	/**
	 * Public. Checks if the humidity sensor is available.
	 * @preturn true if available, false if not.
	 * @instance
	 * @public
	 */
	instance.isHumidityAvailable = function()
	{
		return false
	}

	/**
	 * Public. Checks if the magnetometer sensor is available.
	 * @preturn true if available, false if not.
	 * @instance
	 * @public
	 */
	instance.isMagnetometerAvailable = function()
	{
		return false
	}

	/**
	 * Public. Checks if the barometer sensor is available.
	 * @preturn true if available, false if not.
	 * @instance
	 * @public
	 */
	instance.isBarometerAvailable = function()
	{
		return false
	}

	/**
	 * Public. Checks if the gyroscope sensor is available.
	 * @preturn true if available, false if not.
	 * @instance
	 * @public
	 */
	instance.isGyroscopeAvailable = function()
	{
		return false
	}

	/**
	 * Public. Checks if movement sensor is available that
	 * combines accelerometer, gyroscope, and magnetometer.
	 * @preturn true if available, false if not.
	 * @instance
	 * @public
	 */
	instance.isMovementAvailable = function()
	{
		return false
	}

	/**
	 * Public. Checks if the luxometer sensor is available.
	 * @preturn true if available, false if not.
	 * @instance
	 * @public
	 */
	instance.isLuxometerAvailable = function()
	{
		return false
	}

	/**
	 * Public. Checks if the keypress sensor is available.
	 * @preturn true if available, false if not.
	 * @instance
	 * @public
	 */
	instance.isKeypressAvailable = function()
	{
		return false
	}

	/**
	 * Public. Turn on temperature notification.
	 * @instance
	 * @public
	 */
	instance.temperatureOn = function()
	{
		return instance
	}

	/**
	 * Public. Turn off temperature notification.
	 * @instance
	 * @public
	 */
	instance.temperatureOff = function()
	{
		return instance
	}

	/**
	 * Public. Turn on accelerometer notification (SensorTag 1).
	 * @instance
	 * @public
	 */
	instance.accelerometerOn = function()
	{
		return instance
	}

	/**
	 * Public. Turn off accelerometer notification (SensorTag 1).
	 * @instance
	 * @public
	 */
	instance.accelerometerOff = function()
	{
		return instance
	}

	/**
	 * Public. Turn on humidity notification.
	 * @instance
	 * @public
	 */
	instance.humidityOn = function()
	{
		return instance
	}

	/**
	 * Public. Turn off humidity notification.
	 * @instance
	 * @public
	 */
	instance.humidityOff = function()
	{
		return instance
	}

	/**
	 * Public. Turn on magnetometer notification.
	 * @instance
	 * @public
	 */
	instance.magnetometerOn = function()
	{
		return instance
	}

	/**
	 * Public. Turn off magnetometer notification (SensorTag 1).
	 * @instance
	 * @public
	 */
	instance.magnetometerOff = function()
	{
		return instance
	}

	/**
	 * Public. Turn on barometer notification.
	 * @instance
	 * @public
	 */
	instance.barometerOn = function()
	{
		return instance
	}

	/**
	 * Public. Turn off barometer notification.
	 * @instance
	 * @public
	 */
	instance.barometerOff = function()
	{
		return instance
	}

	/**
	 * Public. Turn on gyroscope notification (SensorTag 1).
	 * @instance
	 * @public
	 */
	instance.gyroscopeOn = function()
	{
		return instance
	}

	/**
	 * Public. Turn off gyroscope notification (SensorTag 1).
	 * @instance
	 * @public
	 */
	instance.gyroscopeOff = function()
	{
		return instance
	}


	/**
	 * Public. Turn on luxometer notification.
	 */
	instance.luxometerOn = function()
	{
		return instance
	}

	/**
	 * Public. Turn off luxometer notification.
	 */
	instance.luxometerOff = function()
	{
		return instance
	}

	/**
	 * Public. Turn on keypress notification.
	 * @instance
	 * @public
	 */
	instance.keypressOn = function()
	{
		return instance
	}

	/**
	 * Public. Turn off keypress notification.
	 * @instance
	 * @public
	 */
	instance.keypressOff = function()
	{
		return instance
	}

	/**
	 * Convert Celsius to Fahrenheit.
	 * @param celsius Temperature in Celsius.
	 * @returns Temperature converted to Fahrenheit.
	 * @public
	 */
	instance.celsiusToFahrenheit = function(celsius)
	{
		return (celsius * 9 / 5) + 32
	}

	return instance
}

// Load TI SensorTag library components.
evothings.loadScripts(
[
	'libs/evothings/easyble/easyble.js',
	'libs/evothings/tisensortag/tisensortag-ble.js',    // Abstract object for BLE tags
	'libs/evothings/tisensortag/tisensortag-ble-cc2541.js', // Specific object for CC2541
	'libs/evothings/tisensortag/tisensortag-ble-cc2650.js'  // Specific object for CC2650
])
