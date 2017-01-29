// Shared functions for BLE TI SensorTags.

;(function()
{
	/**
	 * @namespace
	 * @description JavaScript library for the TI SensorTag.
	 * @alias evothings.tisensortag.ble
	 * @public
	 */
	var sensortag = {}

	// Add object to namespace.
	evothings.tisensortag.ble = sensortag

	/**
	 * @namespace
	 * @description Status constants.
	 * @alias evothings.tisensortag.ble.status
	 * @public
	 */
	var status = {}

	// Add to namespace. This trick is needed for JSDoc,
	// cannot use sensortag.status below, docs do not
	// generate properly in this case.
	sensortag.status = status

	/**
	 * @description Scanning is ongoing.
	 * @public
	 */
	status.SCANNING = 'SCANNING'

	/**
	 * @description Found SensorTag device.
	 * @public
	 */
	status.SENSORTAG_FOUND = 'SENSORTAG_FOUND'

	/**
	 * @description Scanning timed out, no device found.
	 * @public
	 */
	status.SENSORTAG_NOT_FOUND = 'SENSORTAG_NOT_FOUND'

	/**
	 * @description Connecting to physical device.
	 * @public
	 */
	status.CONNECTING = 'CONNECTING'

	/**
	 * @description Connected to physical device.
	 * @public
	 */
	status.CONNECTED = 'CONNECTED'

	/**
	 * @description Reading info about the device.
	 * @public
	 */
	status.READING_DEVICE_INFO = 'READING_DEVICE_INFO'

	/**
	 * @description Info about the device is available.
	 * @public
	 */
	status.DEVICE_INFO_AVAILABLE = 'DEVICE_INFO_AVAILABLE'

	/**
	 * @description Reading services of the device.
	 * @public
	 */
	status.READING_SERVICES = 'READING_SERVICES'

	/**
	 * @description SensorTag device is connected and sensors are avaliable.
	 * @public
	 */
	status.SENSORTAG_ONLINE = 'SENSORTAG_ONLINE'

	/**
	 * @namespace
	 * @description Error constants. There are additional
	 * error strings reported by the cordova-ble plugin
	 * and the easyble.js library.
	 * @alias evothings.tisensortag.ble.error
	 * @public
	 */
	var error = {}

	// Add to namespace. This trick is needed for JSDoc,
	// cannot use sensortag.error below, docs do not
	// generate properly in this case.
	sensortag.error = error

	/**
	 * @description Scan failed.
	 * @public
	 */
	error.SCAN_FAILED = 'SCAN_FAILED'

	/**
	 * Public. Create a SensorTag instance.
	 * @returns {@link evothings.tisensortag.SensorTagInstanceBLE}
	 * @private
	 */
	sensortag.addInstanceMethods = function(anInstance)
	{
		/**
		 * @namespace
		 * @alias evothings.tisensortag.SensorTagInstanceBLE
		 * @description Abstract SensorTag instance object.
		 * This object specifies the interface common to Bluetooth Smart
		 * SensorTags.
		 * @public
		 */
		var instance = anInstance

		// UUIDs for services, characteristics, and descriptors.
		instance.NOTIFICATION_DESCRIPTOR = '00002902-0000-1000-8000-00805f9b34fb'

		instance.DEVICEINFO_SERVICE = '0000180a-0000-1000-8000-00805f9b34fb'
		instance.FIRMWARE_DATA = '00002a26-0000-1000-8000-00805f9b34fb'
		instance.MODELNUMBER_DATA = '00002a24-0000-1000-8000-00805f9b34fb'

		instance.TEMPERATURE = {
			SERVICE: 'f000aa00-0451-4000-b000-000000000000',
			DATA: 'f000aa01-0451-4000-b000-000000000000',
			CONFIG: 'f000aa02-0451-4000-b000-000000000000',
			// Missing in HW rev. 1.2 (FW rev. 1.5)
			PERIOD: 'f000aa03-0451-4000-b000-000000000000',
		}

		instance.HUMIDITY = {
			SERVICE: 'f000aa20-0451-4000-b000-000000000000',
			DATA: 'f000aa21-0451-4000-b000-000000000000',
			CONFIG: 'f000aa22-0451-4000-b000-000000000000',
			PERIOD: 'f000aa23-0451-4000-b000-000000000000',
		}

		instance.BAROMETER = {
			SERVICE: 'f000aa40-0451-4000-b000-000000000000',
			DATA: 'f000aa41-0451-4000-b000-000000000000',
			CONFIG: 'f000aa42-0451-4000-b000-000000000000',
			CALIBRATION: 'f000aa43-0451-4000-b000-000000000000',
			PERIOD: 'f000aa44-0451-4000-b000-000000000000',
		}

		// Only in SensorTag CC2541.
		instance.ACCELEROMETER = {
			SERVICE: 'f000aa10-0451-4000-b000-000000000000',
			DATA: 'f000aa11-0451-4000-b000-000000000000',
			CONFIG: 'f000aa12-0451-4000-b000-000000000000',
			PERIOD: 'f000aa13-0451-4000-b000-000000000000',
		}

		// Only in SensorTag CC2541.
		instance.MAGNETOMETER = {
			SERVICE: 'f000aa30-0451-4000-b000-000000000000',
			DATA: 'f000aa31-0451-4000-b000-000000000000',
			CONFIG: 'f000aa32-0451-4000-b000-000000000000',
			PERIOD: 'f000aa33-0451-4000-b000-000000000000',
		}

		// Only in SensorTag CC2541.
		instance.GYROSCOPE = {
			SERVICE: 'f000aa50-0451-4000-b000-000000000000',
			DATA: 'f000aa51-0451-4000-b000-000000000000',
			CONFIG: 'f000aa52-0451-4000-b000-000000000000',
			PERIOD: 'f000aa53-0451-4000-b000-000000000000',
		}

		// Only in SensorTag CC2650.
		instance.LUXOMETER = {
			SERVICE: 'f000aa70-0451-4000-b000-000000000000',
			DATA: 'f000aa71-0451-4000-b000-000000000000',
			CONFIG: 'f000aa72-0451-4000-b000-000000000000',
			PERIOD: 'f000aa73-0451-4000-b000-000000000000',
		}

		// Only in SensorTag CC2650.
		instance.MOVEMENT = {
			SERVICE: 'f000aa80-0451-4000-b000-000000000000',
			DATA: 'f000aa81-0451-4000-b000-000000000000',
			CONFIG: 'f000aa82-0451-4000-b000-000000000000',
			PERIOD: 'f000aa83-0451-4000-b000-000000000000',
		}

		instance.KEYPRESS = {
			SERVICE: '0000ffe0-0000-1000-8000-00805f9b34fb',
			DATA: '0000ffe1-0000-1000-8000-00805f9b34fb',
		}

		/**
		 * Internal. Services used by the application.
		 * @instance
		 * @private
		 */
		instance.requiredServices = []

		/**
		 * Both CC2541 and CC2650.
		 * Public. Set the humidity temperature callback.
		 * @param fun - success callback called repeatedly: fun(data)
		 * @param interval - humidity rate in milliseconds.
		 * @instance
		 * @public
		 */
		instance.temperatureCallback = function(fun, interval)
		{
			instance.temperatureFun = fun
			instance.temperatureConfig = [1] // on
			instance.temperatureInterval = Math.max(300, interval)
			instance.requiredServices.push(instance.TEMPERATURE.SERVICE)

			return instance
		}

		/**
		 * Both CC2541 and CC2650.
		 * Public. Set the humidity notification callback.
		 * @param fun - success callback called repeatedly: fun(data)
		 * @param interval - humidity rate in milliseconds.
		 * @instance
		 * @public
		 */
		instance.humidityCallback = function(fun, interval)
		{
			instance.humidityFun = fun
			instance.humidityConfig = [1] // on
			instance.humidityInterval = Math.max(100, interval)
			instance.requiredServices.push(instance.HUMIDITY.SERVICE)

			return instance
		}

		/**
		 * Both CC2541 and CC2650.
		 * Public. Set the barometer notification callback.
		 * @param fun - success callback called repeatedly: fun(data)
		 * @param interval - barometer rate in milliseconds.
		 * @instance
		 * @public
		 */
		instance.barometerCallback = function(fun, interval)
		{
			instance.barometerFun = fun
			instance.barometerConfig = [1] // on
			instance.barometerInterval = Math.max(100, interval)
			instance.requiredServices.push(instance.BAROMETER.SERVICE)

			return instance
		}

		/**
		 * Both CC2541 and CC2650.
		 * Public. Set the keypress notification callback.
		 * @param fun - success callback called when a key is pressed: fun(data)
		 * @instance
		 * @public
		 */
		instance.keypressCallback = function(fun)
		{
			instance.keypressFun = fun
			instance.requiredServices.push(instance.KEYPRESS.SERVICE)

			return instance
		}

		/**
		 * Determine if a BLE device is a SensorTag.
		 * This version checks the general case using
		 * the advertised name.
		 * Specific versions for CC2541 and CC2650 uses
		 * advertisement data to determine tag type.
		 * @instance
		 * @public
		 */
		instance.deviceIsSensorTag = function(device)
		{
			return (device != null) &&
				(device.name != null) &&
				(device.name.indexOf('Sensor Tag') > -1 ||
					device.name.indexOf('SensorTag') > -1)
		}

		/**
		 * Public. Connect to the nearest physical SensorTag device.
		 * @instance
		 * @public
		 * @deprecated Use evothings.tiseonsortag.ble.connectToNearestDevice
		 */
		instance.connectToClosestDevice = function()
		{
			return instance.connectToNearestDevice()
		}

		/**
		 * Public. Connect to the nearest physical SensorTag device.
		 * For this to work reliably SensorTags should be at least a
		 * couple of meters apart.
		 * @param scanTimeMilliseconds The time to scan for nearby
		 * SensorTags (optional, defaults to 3 seconds).
		 * @instance
		 * @public
		 */
		instance.connectToNearestDevice = function(scanTimeMilliseconds)
		{
			instance.callStatusCallback(sensortag.status.SCANNING)
			instance.disconnectDevice()
			evothings.easyble.stopScan()
			evothings.easyble.reportDeviceOnce(false)

			var nearestDevice = null
			var strongestRSSI = -1000
			var scanTimeoutStarted = false
			var noTagFoundTimer = null

			// Timer that connects to the nearest SensorTag efter the
			// specified timeout.
			function startConnectTimer()
			{
				// Set timeout period.
				scanTimeMilliseconds = (('undefined' == typeof scanTimeMilliseconds)
					? 1000 // Default scan time is 3 seconds
					: scanTimeMilliseconds) // Use user-set value

				// Start timer.
				setTimeout(
					function() {
						if (nearestDevice)
						{
							evothings.easyble.stopScan()
							instance.callStatusCallback(
								sensortag.status.SENSORTAG_FOUND)
							instance.connectToDevice(nearestDevice)
						}
					},
					scanTimeMilliseconds)
			}

			// Timer that times out if no tag at all is found.
			// Period is set to 10 seconds.
			function startNoTagFoundTimer(device)
			{
				// Set scan timeout period.
				var timeOut = 10000

				// Start timer.
				noTagFoundTimer = setTimeout(
					function() {
						if (!nearestDevice)
						{
							evothings.easyble.stopScan()
							instance.callStatusCallback(
								sensortag.status.SENSORTAG_NOT_FOUND)
						}
					},
					timeOut)
			}

			function stopNoTagFoundTimer()
			{
				clearTimeout(noTagFoundTimer)
			}

			// Called when a device is found during scanning.
			function deviceFound(device)
			{
				// Update the device if it is nearest so far
				// and the RRSI value is valid. 127 is an invalid
				// (unknown) RSSI value reported occasionally.
				// deviceIsSensorTag is implemented in CC2541 and
				// CC2650 object code.
				if (device.rssi != 127 && instance.deviceIsSensorTag(device))
				{
					//console.log('deviceFound: ' + device.name)

					if (device.rssi > strongestRSSI)
					{
						// If this is the first SensorTag found,
						// start the timer that makes the connection.
						if (!nearestDevice)
						{
							stopNoTagFoundTimer()
							startConnectTimer()
						}

						nearestDevice = device
						strongestRSSI = device.rssi
					}
				}
			}

			function scanError(errorCode)
			{
				instance.callErrorCallback(sensortag.error.SCAN_FAILED)
			}

			// Start timer that reports if no tag at all was found.
			startNoTagFoundTimer()

			// Start scanning.
			evothings.easyble.startScan(deviceFound, scanError)

			return instance
		}

		/**
		 * Start scanning for physical devices.
		 * @param foundCallback Function called when a SensorTag
		 * is found. It has the form foundCallback(device) where
		 * is a an object representing a BLE device object. You can
		 * inspect the device fields to determine properties such as
		 * RSSI, name etc. You can call deviceIsSensorTag(device) to
		 * determine if this is a  SensorTag of the same type as the
		 * instance object.
		 * To connect to a SensorTag call connectToDevice(device).
		 * @instance
		 * @public
		 */
		instance.startScanningForDevices = function(foundCallback)
		{
			instance.callStatusCallback(sensortag.status.SCANNING)
			instance.disconnectDevice()
			evothings.easyble.stopScan()
			evothings.easyble.reportDeviceOnce(false)

			// Called when a device is found during scanning.
			function deviceFound(device)
			{
				// 127 is an invalid (unknown) RSSI value reported occasionally.
				if (device.rssi != 127)
				{
					foundCallback(device)
				}
			}

			function scanError(errorCode)
			{
				instance.callErrorCallback(sensortag.error.SCAN_FAILED)
			}

			// Start scanning.
			evothings.easyble.startScan(deviceFound, scanError)

			return instance
		}

		/**
		 * Stop scanning for physical devices.
		 * @instance
		 * @public
		 */
		instance.stopScanningForDevices = function()
		{
			instance.callStatusCallback(sensortag.status.SENSORTAG_NOT_FOUND)

			evothings.easyble.stopScan()

			return instance
		}

		/**
		 * Connect to a SensorTag BLE device.
		 * @param device A Bluetooth Low Energy device object.
		 * @instance
		 * @public
		 */
		instance.connectToDevice = function(device)
		{
			instance.device = device
			instance.callStatusCallback(sensortag.status.CONNECTING)
			instance.device.connect(
				function(device)
				{
					instance.callStatusCallback(sensortag.status.CONNECTED)
					instance.readDeviceInfo()
				},
				instance.errorFun)
		}

		/**
		 * Public. Disconnect from the physical device.
		 * @instance
		 * @public
		 */
		instance.disconnectDevice = function()
		{
			if (instance.device)
			{
				instance.device.close()
				instance.device = null
			}

			return instance
		}

		/**
		 * Internal. When connected we read device info and services.
		 * @instance
		 * @private
		 */
		instance.readDeviceInfo = function()
		{
			function readDeviceInfoService()
			{
				// Notify that status is reading device info.
				instance.callStatusCallback(sensortag.status.READING_DEVICE_INFO)

				// Read device information service.
				instance.device.readServices(
					[instance.DEVICEINFO_SERVICE],
					gotDeviceInfoService,
					instance.errorFun)
			}

			function gotDeviceInfoService(device)
			{
				// Reading of model is disabled. See comment below.
				//readModelNumber()
				readFirmwareVersion()
			}

			/*
			Commented out unused code.

			The value we get from the MODELNUMBER_DATA charaterictic
			does not seem to be consistent.

			We instead set model number in tisensortag-ble-cc2541.js
			and tisensortag-ble-cc2650.js

			function readModelNumber()
			{
				// Read model number.
				instance.device.readCharacteristic(
					instance.MODELNUMBER_DATA,
					gotModelNumber,
					instance.errorFun)
			}

			function gotModelNumber(data)
			{
				// Set model number.
				var modelNumber = evothings.ble.fromUtf8(data)
				console.log('devicemodel: ' + modelNumber)
				if (-1 !== modelNumber.indexOf('CC2650'))
				{
					instance.deviceModel = 'CC2650'
				}
				else
				{
					instance.deviceModel = 'CC2541'
				}

				// Next read firmware version.
				readFirmwareVersion()
			}
			*/

			function readFirmwareVersion()
			{
				instance.device.readServiceCharacteristic(
					instance.DEVICEINFO_SERVICE,
					instance.FIRMWARE_DATA,
					gotFirmwareVersion,
					instance.errorFun)
			}

			function gotFirmwareVersion(data)
			{
				// Set firmware string.
				var fw = evothings.ble.fromUtf8(data)
				instance.firmwareString = fw.match(/\d+\.\d+\S?\b/g)[0] || ''

				// Notify that device info is available.
				instance.callStatusCallback(sensortag.status.DEVICE_INFO_AVAILABLE)

				// Read services requested by the application.
				readRequestedServices()
			}

			function readRequestedServices()
			{
				// Notify that status is reading services.
				instance.callStatusCallback(sensortag.status.READING_SERVICES)

				// Read services requested by the application.
				instance.device.readServices(
					instance.requiredServices,
					instance.activateSensors,
					instance.errorFun)
			}

			// Start by reading model number. Then read other
			// data successively.
			readDeviceInfoService()
		}

		/**
		 * Internal.
		 * @instance
		 * @private
		 */
		instance.activateSensors = function()
		{
			// Debug logging.
			//console.log('-------------------- SERVICES --------------------')
			//sensortag.logServices(instance.device)
			//console.log('---------------------- END -----------------------')

			// Call implementation method in sub module.
			instance.activateSensorsImpl()

			instance.callStatusCallback(sensortag.status.SENSORTAG_ONLINE)
		}

		/**
		 * Both CC2541 and CC2650.
		 * Public. Turn on IR temperature notification.
		 * @instance
		 * @public
		 */
		instance.temperatureOn = function()
		{
			instance.sensorOn(
				instance.TEMPERATURE,
				instance.temperatureConfig,
				instance.temperatureInterval,
				instance.temperatureFun
			)

			return instance
		}

		/**
		 * Both CC2541 and CC2650.
		 * Public. Turn off IR temperature notification.
		 * @instance
		 * @public
		 */
		instance.temperatureOff = function()
		{
			instance.sensorOff(instance.TEMPERATURE)

			return instance
		}

		/**
		 * Both CC2541 and CC2650.
		 * Public. Turn on humidity notification.
		 * @instance
		 * @public
		 */
		instance.humidityOn = function()
		{
			instance.sensorOn(
				instance.HUMIDITY,
				instance.humidityConfig,
				instance.humidityInterval,
				instance.humidityFun
			)

			return instance
		}

		/**
		 * Both CC2541 and CC2650.
		 * Public. Turn off humidity notification.
		 * @instance
		 * @public
		 */
		instance.humidityOff = function()
		{
			instance.sensorOff(instance.HUMIDITY)

			return instance
		}

		/**
		 * Public. Turn on barometer notification.
		 * @instance
		 * @public
		 */
		instance.barometerOn = function()
		{
			// Implemented in sub modules.

			return instance
		}

		/**
		 * Both CC2541 and CC2650.
		 * Public. Turn off barometer notification.
		 * @instance
		 * @public
		 */
		instance.barometerOff = function()
		{
			instance.sensorOff(instance.BAROMETER)

			return instance
		}

		/**
		 * Both CC2541 and CC2650.
		 * Public. Turn on keypress notification.
		 * @instance
		 * @public
		 */
		instance.keypressOn = function()
		{
			instance.sensorOn(
				instance.KEYPRESS,
				null, // Not used.
				null, // Not used.
				instance.keypressFun
			)

			return instance
		}

		/**
		 * Both CC2541 and CC2650.
		 * Public. Turn off keypress notification.
		 * @instance
		 * @public
		 */
		instance.keypressOff = function()
		{
			instance.sensorOff(instance.KEYPRESS)

			return instance
		}

		/**
		 * Public. Used internally as a helper function for turning on
		 * sensor notification. You can call this function from the
		 * application to enable sensors using custom parameters.
		 * For advanced use.
		 * @instance
		 * @public
		 */
		instance.sensorOn = function(
			service,
			configValue,
			periodValue,
			notificationFunction)
		{
			// Only start sensor if a notification function has been set.
			if (!notificationFunction) { return }

			// Set sensor configuration to ON.
			// If configValue is provided, service.CONFIG must be set.
			configValue && instance.device.writeServiceCharacteristic(
				service.SERVICE,
				service.CONFIG,
				new Uint8Array(configValue),
				function() {},
				instance.errorFun)

			// Set sensor update period.
			periodValue && instance.device.writeServiceCharacteristic(
				service.SERVICE,
				service.PERIOD,
				new Uint8Array([periodValue / 10]),
				function() {},
				instance.errorFun)

			// Set sensor notification to ON.
			service.DATA && instance.device.writeServiceDescriptor(
				service.SERVICE,
				service.DATA,
				instance.NOTIFICATION_DESCRIPTOR,
				new Uint8Array([1,0]),
				function() {
					// Make sure value got written correctly.
					// Also test readServiceDescriptor().
					instance.device.readServiceDescriptor(service.SERVICE, service.DATA, instance.NOTIFICATION_DESCRIPTOR, function(data) {
						//console.log('BLE descriptor data: ' + instance.dataToString(data))
					}, function(errorCode)
					{
						console.log('BLE readServiceDescriptor error: ' + errorCode)
					})
				},
				instance.errorFun)

			// Start sensor notification.
			service.DATA && instance.device.enableServiceNotification(
				service.SERVICE,
				service.DATA,
				function(data) { notificationFunction(new Uint8Array(data)) },
				instance.errorFun)

			return instance
		}

		instance.dataToString = function(data)
		{
			var str = '['
			data = new Uint8Array(data)
			for(var i=0; i<data.length; i++) {
				if(i > 0)
					str += ','
				str += data[i]
			}
			str += ']'
			return str
		}

		/**
		 * Helper function for turning off sensor notification.
		 * @instance
		 * @public
		 */
		instance.sensorOff = function(service)
		{
			// TODO: Check that sensor notification function is set.

			// Set sensor configuration to OFF
			service.CONFIG && instance.device.writeServiceCharacteristic(
				service.SERVICE,
				service.CONFIG,
				new Uint8Array([0]),
				function() {},
				instance.errorFun)

			// Set sensor notification to OFF.
			service.DATA && instance.device.writeServiceDescriptor(
				service.SERVICE,
				service.DATA,
				instance.NOTIFICATION_DESCRIPTOR,
				new Uint8Array([0,0]),
				function() {
					// Make sure value got written correctly.
					// Also test readServiceDescriptor().
					instance.device.readServiceDescriptor(service.SERVICE, service.DATA, instance.NOTIFICATION_DESCRIPTOR, function(data) {
						//console.log('BLE descriptor data: ' + instance.dataToString(data))
					}, function(errorCode)
					{
						console.log('BLE readServiceDescriptor error: ' + errorCode)
					})
				},
				instance.errorFun)

			service.DATA && instance.device.disableServiceNotification(
				service.SERVICE,
				service.DATA,
				function() {
					//console.log("disableServiceNotification success")
				},
				instance.errorFun)

			return instance
		}

		/**
		 * Calculate humidity values from raw data.
		 * @param data - an Uint8Array.
		 * @return Object with fields: humidityTemperature, relativeHumidity.
		 * @instance
		 * @public
		 */
		instance.getHumidityValues = function(data)
		{
			// Calculate the humidity temperature (Celsius).
			var tData = evothings.util.littleEndianToInt16(data, 0)
			var tc = -46.85 + 175.72 / 65536.0 * tData

			// Calculate the relative humidity.
			var hData = (evothings.util.littleEndianToInt16(data, 2) & ~0x03)
			var h = -6.0 + 125.00 / 65536.0 * hData

			// Return result.
			return { humidityTemperature: tc, relativeHumidity: h }
		}

		// Finally, return the SensorTag instance object.
		return instance
	}
})()
