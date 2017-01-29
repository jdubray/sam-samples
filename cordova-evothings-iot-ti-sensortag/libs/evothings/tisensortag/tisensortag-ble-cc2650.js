
;(function()
{
	evothings.tisensortag.ble.CC2650 = {}

	/**
	 * @namespace
	 * @description Internal implementation of JavaScript library for the TI SensorTag CC2650.
	 * @alias evothings.tisensortag.ble.CC2650
	 */
	var sensortag = {}

	evothings.tisensortag.ble.CC2650 = sensortag

	/**
	 * Create a SensorTag CC2650 instance.
	 * @returns {@link evothings.tisensortag.SensorTagInstanceBLE_CC2650}
	 * @private
	 */
	sensortag.addInstanceMethods = function(anInstance)
	{
		/**
		 * @namespace
		 * @alias evothings.tisensortag.SensorTagInstanceBLE_CC2650
		 * @description SensorTag CC2650 instance object.
		 * @public
		 */
		var instance = anInstance

		// Add generic BLE instance methods.
		evothings.tisensortag.ble.addInstanceMethods(instance)

		/**
		 * The device model.
		 * @instance
		 * @public
		 */
		instance.deviceModel = 'CC2650'

		/**
		 * Determine if a BLE device is a SensorTag CC2650.
		 * Checks for the CC2650 using the advertised name.
		 * @instance
		 * @public
		 */
		instance.deviceIsSensorTag = function(device)
		{
			return (device != null) &&
				(device.advertisementData != null) &&
				(device.advertisementData.kCBAdvDataLocalName ==
					'CC2650 SensorTag')
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
			instance.accelerometerFun = fun

			// Enable movement callback.
			instance.setupCatchAllMovementCallback(interval)

			return instance
		}

		/**
		 * Public. Set the gyroscope notification callback.
		 * Enables all axes.
		 * @param fun - success callback called repeatedly: fun(data)
		 * @param interval - gyroscope rate in milliseconds.
		 * @instance
		 * @public
		 */
		instance.gyroscopeCallback = function(fun, interval)
		{
			instance.gyroscopeFun = fun

			// Enable movement callback.
			instance.setupCatchAllMovementCallback(interval)

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
			instance.magnetometerFun = fun

			// Enable movement callback.
			instance.setupCatchAllMovementCallback(interval)

			return instance
		}

		/**
		 * Private. Setup the movement sensor to call accelerometer,
		 * gyroscope and magnetometer callbacks.
		 * @param fun - success callback called repeatedly: fun(data)
		 * @param interval - magnetometer rate in milliseconds.
		 * @instance
		 * @private
		 */
		instance.setupCatchAllMovementCallback = function(interval)
		{
			// Only do this once.
			if (instance.catchAllMovementCallbackEnabled) { return }
			instance.catchAllMovementCallbackEnabled = true

			// Call all of the movement service's callbacks
			// (accelerometer, gyroscope, magnetometer)

 			// Set the config that turns on the needed sensors.
			// magnetometer on: 64 (1000000) (seems to not work in ST2 FW 0.89)
			// 3-axis acc. on: 56 (0111000)
			// 3-axis gyro on: 7 (0000111)
			// 3-axis acc. + 3-axis gyro on: 63 (0111111)
			// 3-axis acc. + 3-axis gyro + magnetometer on: 127 (1111111)
			instance.movementCallback(
				function(data)
				{
					instance.accelerometerFun && instance.accelerometerFun(data)
					instance.magnetometerFun && instance.magnetometerFun(data)
					instance.gyroscopeFun && instance.gyroscopeFun(data)
				},
				interval,
				127)
		}

		/**
		 * SensorTag CC2650.
		 * Public. Set the movement notification callback.
		 * Movement callbacks are routed back to accelerometer,
		 * gyroscope, and magnetometer callbacks.
		 * @param fun - Success callback called repeatedly: fun(data)
		 * @param interval - Sensor rate in milliseconds.
		 * @param sensors - Set the config that turns on the needed sensors:<br/>
		 * Magnetometer on: 64 (1000000) (seems to not work in ST2 FW 0.89)<br/>
		 * 3-axis acc. on: 56 (0111000)<br/>
		 * 3-axis gyro on: 7 (0000111)<br/>
		 * 3-axis acc. + 3-axis gyro on: 63 (0111111)<br/>
		 * 3-axis acc. + 3-axis gyro + magnetometer on: 127 (1111111)<br/>
		 * @instance
		 * @public
		 */
		instance.movementCallback = function(fun, interval, sensors)
		{
			// Callback for all movement sensors (accelerometer, gyroscope, magnetometer).
			instance.movementFun = fun

 			// Set the config that turns on the needed sensors.
			instance.movementConfig = [sensors, 0]
			instance.movementInterval = interval
			instance.requiredServices.push(instance.MOVEMENT.SERVICE)

			return instance
		}

		/**
		 * Public. Set the luxometer notification callback.
		 * @param fun - success callback called repeatedly: fun(data)
		 * @param interval - luxometer rate in milliseconds.
		 */
		instance.luxometerCallback = function(fun, interval)
		{
			instance.luxometerFun = fun
			instance.luxometerConfig = [1] // on
			instance.luxometerInterval = Math.max(1000, interval)
			instance.requiredServices.push(instance.LUXOMETER.SERVICE)

			return instance
		}

		/**
		 * SensorTag CC2650.
		 * Internal.
		 * @instance
		 * @private
		 */
		instance.activateSensorsImpl = function()
		{
			// Debug logging.
			//console.log('-------------------- SERVICES --------------------')
			//sensortag.logServices(instance.device)
			//console.log('---------------------- END -----------------------')

			instance.temperatureOn()
			instance.humidityOn()
			instance.barometerOn()
			instance.luxometerOn()
			instance.movementOn()
			instance.keypressOn()
		}

		/**
		 * SensorTag CC2650.
		 * Public. Turn on barometer notification.
		 * @instance
		 * @public
		 */
		instance.barometerOn = function()
		{
			instance.sensorOn(
				instance.BAROMETER,
				instance.barometerConfig,
				instance.barometerInterval,
				instance.barometerFun
			)

			return instance
		}

		/**
		 * SensorTag CC2650.
		 * Public. Turn on movement notification (SensorTag 2).
		 * @instance
		 * @public
		 */
		instance.movementOn = function()
		{
			instance.sensorOn(
				instance.MOVEMENT,
				instance.movementConfig,
				instance.movementInterval,
				instance.movementFun
			)

			return instance
		}

		/**
		 * SensorTag CC2650.
		 * Public. Turn off movement notification (SensorTag 2).
		 * @instance
		 * @public
		 */
		instance.movementOff = function()
		{
			instance.sensorOff(instance.MOVEMENT)

			return instance
		}

		/**
		 * SensorTag CC2650.
		 * Public. Turn on luxometer notification.
		 * @instance
		 * @public
		 */
		instance.luxometerOn = function()
		{
			instance.sensorOn(
				instance.LUXOMETER,
				instance.luxometerConfig,
				instance.luxometerInterval,
				instance.luxometerFun
			)

			return instance
		}

		/**
		 * SensorTag CC2650.
		 * Public. Turn off luxometer notification.
		 * @instance
		 * @public
		 */
		instance.luxometerOff = function()
		{
			instance.sensorOff(instance.LUXOMETER)

			return instance
		}

		/**
		 * SensorTag CC2650.
		 * Calculate temperature values from raw data.
		 * @param data - an Uint8Array.
		 * @return Object with fields: ambientTemperature, targetTemperature.
		 * @instance
		 * @public
		 */
		instance.getTemperatureValues = function(data)
		{
			// Calculate ambient temperature (Celsius).
			var ac = evothings.util.littleEndianToUint16(data, 2) / 128.0

			// Calculate target temperature (Celsius).
			var tc = evothings.util.littleEndianToInt16(data, 0)
			tc = (tc >> 2) * 0.03125

			// Return result.
			return { ambientTemperature: ac, targetTemperature: tc }
		}

		/**
		 * SensorTag CC2650.
		 * Calculate humidity values from raw data.
		 * @param data - an Uint8Array.
		 * @return Object with fields: humidityTemperature, relativeHumidity.
		 * @instance
		 * @public
		 */
		instance.getHumidityValues = function(data)
		{
			// Calculate the humidity temperature (Celsius).
			var tData = evothings.util.littleEndianToInt16(data, 0);
			var tc = (tData / 65536.0) * 165 - 40;

			// Calculate the relative humidity.
			var hData = evothings.util.littleEndianToUint16(data, 2);
			var h = hData * 100 / 65536.0;

			// Return result.
			return { humidityTemperature: tc, relativeHumidity: h }
		}

		/**
		 * SensorTag CC2650.
		 * Calculate accelerometer values from raw data.
		 * @param data - an Uint8Array.
		 * @return Object with fields: x, y, z.
		 * @instance
		 * @public
		 */
		instance.getAccelerometerValues = function(data)
		{
			var divisors = {x: -16384.0, y: 16384.0, z: -16384.0}

			// Calculate accelerometer values.
			var ax = evothings.util.littleEndianToInt16(data, 6) / divisors.x
			var ay = evothings.util.littleEndianToInt16(data, 8) / divisors.y
			var az = evothings.util.littleEndianToInt16(data, 10) / divisors.z

			// Return result.
			return { x: ax, y: ay, z: az }
		}

		/**
		 * SensorTag CC2650.
		 * Calculate gyroscope values from raw data.
		 * @param data - an Uint8Array.
		 * @return Object with fields: x, y, z.
		 * @instance
		 * @public
		 */
		instance.getGyroscopeValues = function(data)
		{
			// Calculate gyroscope values.
			var gx = evothings.util.littleEndianToInt16(data, 0) * 255.0 / 32768.0
			var gy = evothings.util.littleEndianToInt16(data, 2) * 255.0 / 32768.0
			var gz =  evothings.util.littleEndianToInt16(data, 4) * 255.0 / 32768.0

			// Return result.
			return { x: gx, y: gy, z: gz }
		}

		/**
		 * SensorTag CC2650.
		 * Calculate barometer values from raw data.
		 * @instance
		 * @public
		 */
		instance.getBarometerValues = function(data)
		{
			var p = evothings.util.littleEndianToUint16(data, 2)

			// Extraction of pressure value, based on sfloatExp2ToDouble from
			// BLEUtility.m in Texas Instruments TI BLE SensorTag iOS app
			// source code.
			// TODO: Move to util.js
			var mantissa = p & 0x0FFF
			var exponent = p >> 12

			magnitude = Math.pow(2, exponent)
			output = (mantissa * magnitude)

			var pInterpreted = output / 10000.0

			return { pressure: pInterpreted }
		}

		/**
		 * SensorTag CC2650.
		 * Calculate magnetometer values from raw data.
		 * @param data - an Uint8Array.
		 * @return Object with fields: x, y, z.
		 * @instance
		 * @public
		 */
		instance.getMagnetometerValues = function(data)
		{
			// Magnetometer values (Micro Tesla).
			var mx = evothings.util.littleEndianToInt16(data, 12) * (4912.0 / 32768.0)
			var my = evothings.util.littleEndianToInt16(data, 14) * (4912.0 / 32768.0)
			var mz = evothings.util.littleEndianToInt16(data, 16) * (4912.0 / 32768.0)

			// Return result.
			return { x: mx, y: my, z: mz }
		}

		/**
		 * SensorTag CC2650.
		 * Calculate luxometer values from raw data.
		 * @param data - an Uint8Array.
		 * @return Light level in lux units.
		 * @instance
		 * @public
		 */
		instance.getLuxometerValue = function(data)
		{
			// Calculate the light level.
			var value = evothings.util.littleEndianToUint16(data, 0)

			// Extraction of luxometer value, based on sfloatExp2ToDouble
			// from BLEUtility.m in Texas Instruments TI BLE SensorTag
			// iOS app source code.
			// TODO: move to util.js
			var mantissa = value & 0x0FFF
			var exponent = value >> 12

			magnitude = Math.pow(2, exponent)
			output = (mantissa * magnitude)

			var lux = output / 100.0

			// Return result.
			return lux
		}

		/**
		 * Public. Checks if the Temperature sensor is available.
		 * @preturn true if available, false if not.
		 * @instance
		 * @public
		 */
		instance.isTemperatureAvailable = function()
		{
			return true
		}

		/**
		 * Public. Checks if the accelerometer sensor is available.
		 * @preturn true if available, false if not.
		 * @instance
		 * @public
		 */
		instance.isAccelerometerAvailable = function()
		{
			return true
		}

		/**
		 * Public. Checks if the humidity sensor is available.
		 * @preturn true if available, false if not.
		 * @instance
		 * @public
		 */
		instance.isHumidityAvailable = function()
		{
			return true
		}

		/**
		 * Public. Checks if the magnetometer sensor is available.
		 * @preturn true if available, false if not.
		 * @instance
		 * @public
		 */
		instance.isMagnetometerAvailable = function()
		{
			return true
		}

		/**
		 * Public. Checks if the barometer sensor is available.
		 * @preturn true if available, false if not.
		 * @instance
		 * @public
		 */
		instance.isBarometerAvailable = function()
		{
			return true
		}

		/**
		 * Public. Checks if the gyroscope sensor is available.
		 * @preturn true if available, false if not.
		 * @instance
		 * @public
		 */
		instance.isGyroscopeAvailable = function()
		{
			return true
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
			return true
		}

		/**
		 * Public. Checks if the luxometer sensor is available.
		 * @preturn true if available, false if not.
		 * @instance
		 * @public
		 */
		instance.isLuxometerAvailable = function()
		{
			return true
		}

		/**
		 * Public. Checks if the keypress sensor is available.
		 * @preturn true if available, false if not.
		 * @instance
		 * @public
		 */
		instance.isKeypressAvailable = function()
		{
			return true
		}

		// Finally, return the SensorTag instance object.
		return instance
	}
})()
