// File: easyble.js updated 160620

;(function()
{
	// Load script used by this file.
	evothings.loadScript('libs/evothings/util/util.js');

	/**
	 * @namespace
	 * @description <p>Library for making BLE programming easier.</p>
	 * <p>It is safe practise to call function {@link evothings.scriptsLoaded}
	 * to ensure dependent libraries are loaded before calling functions
	 * in this library.</p>
	 */
	evothings.easyble = {};

	/**
	 * @namespace
	 * @description Error string.
	 */
	evothings.easyble.error = {};

	/**
	 * @description BLE device was disconnected.
	 */
	evothings.easyble.error.DISCONNECTED = 'EASYBLE_ERROR_DISCONNECTED';

	/**
	 * @description BLE service was not found.
	 */
	evothings.easyble.error.SERVICE_NOT_FOUND = 'EASYBLE_ERROR_SERVICE_NOT_FOUND';

	/**
	 * @description BLE characteristic was not found.
	 */
	evothings.easyble.error.CHARACTERISTIC_NOT_FOUND = 'EASYBLE_ERROR_CHARACTERISTIC_NOT_FOUND';

	/**
	 * @description BLE descriptor was not found.
	 */
	evothings.easyble.error.DESCRIPTOR_NOT_FOUND = 'EASYBLE_ERROR_DESCRIPTOR_NOT_FOUND';

	/**
	 * @private
	 */
	var base64 = cordova.require('cordova/base64');

	/**
	 * Set to true to report found devices only once,
	 * set to false to report continuously.
	 * @private
	 */
	var reportDeviceOnce = false;

	/**
	 * @private
	 */
	var serviceFilter = false;

	/**
	 * Internal properties and functions.
	 * @private
	 */
	var internal = {};

	/**
	 * Internal variable used to track reading of service data.
	 * @private
	 */
	var readCounter = 0;

	/**
	 * Table of discovered devices.
	 * @private
	 */
	internal.knownDevices = {};

	/**
	 * Table of connected devices.
	 * @private
	 */
	internal.connectedDevices = {};

	/**
	 * Set whether to report devices once or continuously during scan.
	 * The default is to report continously.
	 * @param {boolean} reportOnce - Set to true to report found devices only once.
	 * Set to false to report continuously.
	 * @public
	 */
	evothings.easyble.reportDeviceOnce = function(reportOnce)
	{
		reportDeviceOnce = reportOnce;
	};

	/**
	 * Set to an Array of UUID strings to enable filtering of devices
	 * found by startScan().
	 * @param services - Array of UUID strings. Set to false to disable filtering.
	 * The default is no filtering. An empty array will cause no devices to be reported.
	 * @public
	 */
	evothings.easyble.filterDevicesByService = function(services)
	{
		serviceFilter = services;
	};

	/**
	 * @description Called during scanning when a BLE device is found.
	 * @callback evothings.easyble.scanCallback
	 * @param {evothings.easyble.EasyBLEDevice} device - EasyBLE device object
	 * found during scanning.
	 */

	/**
	 * @description This callback indicates that an operation was successful,
	 * without specifying and additional information.
	 * @callback evothings.easyble.emptyCallback - Callback that takes no parameters.
	 */

	/**
	 * @description This function is called when an operation fails.
	 * @callback evothings.easyble.failCallback
	 * @param {string} errorString - A human-readable string that
	 * describes the error that occurred.
	 */

	/**
	 * @description Called when successfully connected to a device.
	 * @callback evothings.easyble.connectCallback
	 * @param {evothings.easyble.EasyBLEDevice} device - EasyBLE devices object.
	 */

	/**
	 * @description Called when services are successfully read.
	 * @callback evothings.easyble.servicesCallback
	 * @param {evothings.easyble.EasyBLEDevice} device - EasyBLE devices object.
	 */

	/**
	 * @description Function when data is available.
	 * @callback evothings.easyble.dataCallback
	 * @param {ArrayBuffer} data - The data is an array buffer.
	 * Use an ArrayBufferView to access the data.
	 */

	/**
	 * @description Called with RSSI value.
	 * @callback evothings.easyble.rssiCallback
	 * @param {number} rssi - A negative integer, the signal strength in decibels.
	 * This value may be 127 which indicates an unknown value.
	 */

	/**
	 * Start scanning for devices.
	 * @param {array} serviceUUIDs - Array with service UUID strings (optional).
	 * On iOS multiple UUIDs are scanned for using logical OR operator,
	 * any UUID that matches any of the UUIDs adverticed by the device
	 * will count as a match. On Android, multiple UUIDs are scanned for
	 * using AND logic, the device must advertise all of the given UUIDs
	 * to produce a match. (The matching logic will be unified in future
	 * versions of the plugin.) When providing one service UUID, behaviour
	 * is the same on Android and iOS. Learning out this parameter or
	 * setting it to null, will scan for all devices, regardless of
	 * advertised services.
	 * @param {evothings.easyble.scanCallback} - Success function called when a
	 * device is found.
	 * Format: success({@link evothings.easyble.EasyBLEDevice}).
	 * @param {evothings.easyble.failCallback} fail - Error callback: fail(error).
	 * @public
	 * @example
	 *   // Scan for all services.
	 *   evothings.easyble.startScan(
	 *       function(device)
	 *       {
	 *           console.log('Found device named: ' + device.name);
	 *       },
	 *       function(errorCode)
	 *       {
	 *           console.log('startScan error: ' + errorCode);
	 *       }
	 *   );
	 *
	 *   // Scan for specific service.
	 *   evothings.easyble.startScan(
	 *       // Eddystone service UUID.
	 *       ['0000FEAA-0000-1000-8000-00805F9B34FB'],
	 *       function(device)
	 *       {
	 *           console.log('Found device named: ' + device.name);
	 *       },
	 *       function(errorCode)
	 *       {
	 *           console.log('startScan error: ' + errorCode);
	 *       }
	 *   );
	 */
	evothings.easyble.startScan = function(serviceUUIDs, success, fail)
	{
		evothings.easyble.stopScan();

		internal.knownDevices = {};

		if ('function' == typeof serviceUUIDs)
		{
			// No Service UUIDs specified.
			fail = success;
			success = serviceUUIDs;
			evothings.ble.startScan(onDeviceFound, onError);
		}
		else
		{
			evothings.ble.startScan(serviceUUIDs, onDeviceFound, onError);
		}

		function onDeviceFound(device)
		{
			// Ensure we have advertisementData.
			internal.ensureAdvertisementData(device);

			// Check if the device matches the filter, if we have a filter.
			if (!internal.deviceMatchesServiceFilter(device))
			{
				return;
			}

			// Check if we already have got the device.
			var existingDevice = internal.knownDevices[device.address]
			if (existingDevice)
			{
				// Do not report device again if flag is set.
				if (reportDeviceOnce) { return; }

				// Flag not set, report device again.
				existingDevice.rssi = device.rssi;
				existingDevice.name = device.name;
				existingDevice.scanRecord = device.scanRecord;
				existingDevice.advertisementData = device.advertisementData;
				success(existingDevice);
				return;
			}

			// New device, add to known devices.
			internal.knownDevices[device.address] = device;

			// Set connect status.
			device.__isConnected = false;

			// Add methods to the device info object.
			internal.addMethodsToDeviceObject(device);

			// Call callback function with device info.
			success(device);
		}

		function onError(errorCode)
		{
			fail(errorCode);
		}
	};

	/**
	 * Stop scanning for devices.
	 * @example
	 *   evothings.easyble.stopScan();
	 */
	evothings.easyble.stopScan = function()
	{
		evothings.ble.stopScan();
	};

	/**
	 * Disconnect and close all connected BLE devices.
	 * @example
	 *   evothings.easyble.closeConnectedDevices();
	 */
	evothings.easyble.closeConnectedDevices = function()
	{
		for (var key in internal.connectedDevices)
		{
			var device = internal.connectedDevices[key];
			device && device.close();
			internal.connectedDevices[key] = null;
		}
	};

	/**
	 * If device already has advertisementData, does nothing.
	 * If device instead has scanRecord, creates advertisementData.
	 * See ble.js for AdvertisementData reference.
	 * @param device - Device object.
	 * @private
	 */
	internal.ensureAdvertisementData = function(device)
	{
		// If device object already has advertisementData we
		// do not need to parse the scanRecord.
		if (device.advertisementData) { return; }

		// Must have scanRecord yo continue.
		if (!device.scanRecord) { return; }

		// Here we parse BLE/GAP Scan Response Data.
		// See the Bluetooth Specification, v4.0, Volume 3, Part C, Section 11,
		// for details.

		var byteArray = evothings.util.base64DecToArr(device.scanRecord);
		var pos = 0;
		var advertisementData = {};
		var serviceUUIDs;
		var serviceData;

		// The scan record is a list of structures.
		// Each structure has a length byte, a type byte, and (length-1) data bytes.
		// The format of the data bytes depends on the type.
		// Malformed scanRecords will likely cause an exception in this function.
		while (pos < byteArray.length)
		{
			var length = byteArray[pos++];
			if (length == 0)
			{
				break;
			}
			length -= 1;
			var type = byteArray[pos++];

			// Parse types we know and care about.
			// Skip other types.

			var BLUETOOTH_BASE_UUID = '-0000-1000-8000-00805f9b34fb'

			// Convert 16-byte Uint8Array to RFC-4122-formatted UUID.
			function arrayToUUID(array, offset)
			{
				var k=0;
				var string = '';
				var UUID_format = [4, 2, 2, 2, 6];
				for (var l=0; l<UUID_format.length; l++)
				{
					if (l != 0)
					{
						string += '-';
					}
					for (var j=0; j<UUID_format[l]; j++, k++)
					{
						string += evothings.util.toHexString(array[offset+k], 1);
					}
				}
				return string;
			}

			if (type == 0x02 || type == 0x03) // 16-bit Service Class UUIDs.
			{
				serviceUUIDs = serviceUUIDs ? serviceUUIDs : [];
				for(var i=0; i<length; i+=2)
				{
					serviceUUIDs.push(
						'0000' +
						evothings.util.toHexString(
							evothings.util.littleEndianToUint16(byteArray, pos + i),
							2) +
						BLUETOOTH_BASE_UUID);
				}
			}
			if (type == 0x04 || type == 0x05) // 32-bit Service Class UUIDs.
			{
				serviceUUIDs = serviceUUIDs ? serviceUUIDs : [];
				for (var i=0; i<length; i+=4)
				{
					serviceUUIDs.push(
						evothings.util.toHexString(
							evothings.util.littleEndianToUint32(byteArray, pos + i),
							4) +
						BLUETOOTH_BASE_UUID);
				}
			}
			if (type == 0x06 || type == 0x07) // 128-bit Service Class UUIDs.
			{
				serviceUUIDs = serviceUUIDs ? serviceUUIDs : [];
				for (var i=0; i<length; i+=16)
				{
					serviceUUIDs.push(arrayToUUID(byteArray, pos + i));
				}
			}
			if (type == 0x08 || type == 0x09) // Local Name.
			{
				advertisementData.kCBAdvDataLocalName = evothings.ble.fromUtf8(
					new Uint8Array(byteArray.buffer, pos, length));
			}
			if (type == 0x0a) // TX Power Level.
			{
				advertisementData.kCBAdvDataTxPowerLevel =
					evothings.util.littleEndianToInt8(byteArray, pos);
			}
			if (type == 0x16) // Service Data, 16-bit UUID.
			{
				serviceData = serviceData ? serviceData : {};
				var uuid =
					'0000' +
					evothings.util.toHexString(
						evothings.util.littleEndianToUint16(byteArray, pos),
						2) +
					BLUETOOTH_BASE_UUID;
				var data = new Uint8Array(byteArray.buffer, pos+2, length-2);
				serviceData[uuid] = base64.fromArrayBuffer(data);
			}
			if (type == 0x20) // Service Data, 32-bit UUID.
			{
				serviceData = serviceData ? serviceData : {};
				var uuid =
					evothings.util.toHexString(
						evothings.util.littleEndianToUint32(byteArray, pos),
						4) +
					BLUETOOTH_BASE_UUID;
				var data = new Uint8Array(byteArray.buffer, pos+4, length-4);
				serviceData[uuid] = base64.fromArrayBuffer(data);
			}
			if (type == 0x21) // Service Data, 128-bit UUID.
			{
				serviceData = serviceData ? serviceData : {};
				var uuid = arrayToUUID(byteArray, pos);
				var data = new Uint8Array(byteArray.buffer, pos+16, length-16);
				serviceData[uuid] = base64.fromArrayBuffer(data);
			}
			if (type == 0xff) // Manufacturer-specific Data.
			{
				// Annoying to have to transform base64 back and forth,
				// but it has to be done in order to maintain the API.
				advertisementData.kCBAdvDataManufacturerData =
					base64.fromArrayBuffer(new Uint8Array(byteArray.buffer, pos, length));
			}

			pos += length;
		}
		advertisementData.kCBAdvDataServiceUUIDs = serviceUUIDs;
		advertisementData.kCBAdvDataServiceData = serviceData;
		device.advertisementData = advertisementData;

		/*
		// Log raw data for debugging purposes.

		console.log("scanRecord: "+evothings.util.typedArrayToHexString(byteArray));

		console.log(JSON.stringify(advertisementData));
		*/
	}

	/**
	 * Returns true if the device matches the serviceFilter, or if there is no filter.
	 * Returns false otherwise.
	 * @private
	 */
	internal.deviceMatchesServiceFilter = function(device)
	{
		if (!serviceFilter) { return true; }

		var advertisementData = device.advertisementData;
		if (advertisementData)
		{
			var serviceUUIDs = advertisementData.kCBAdvDataServiceUUIDs;
			if (serviceUUIDs)
			{
				for (var i in serviceUUIDs)
				{
					for (var j in serviceFilter)
					{
						if (serviceUUIDs[i].toLowerCase() ==
							serviceFilter[j].toLowerCase())
						{
							return true;
						}
					}
				}
			}
		}
		return false;
	}

	/**
	 * Add functions to the device object to allow calling them
	 * in an object-oriented style.
	 * @private
	 */
	internal.addMethodsToDeviceObject = function(deviceObject)
	{
		/**
		 * @namespace
		 * @alias evothings.easyble.EasyBLEDevice
		 * @description This is the BLE DeviceInfo object obtained from the
		 * underlying Cordova plugin.
		 * @property {string} address - Uniquely identifies the device.
		 * The form of the address depends on the host platform.
		 * @property {number} rssi - A negative integer, the signal strength in decibels.
		 * @property {string} name - The device's name, or nil.
		 * @property {string} scanRecord - Base64-encoded binary data. Its meaning is
		 * device-specific. Not available on iOS.
		 * @property {evothings.easyble.AdvertisementData} advertisementData -
		 * Object containing some of the data from the scanRecord.
		 */
		var device = deviceObject;

		/**
		 * @typedef {Object} evothings.easyble.AdvertisementData
		 * @description Information extracted from a scanRecord. Some or all of the fields may be
		 * undefined. This varies between BLE devices.
		 * Depending on OS version and BLE device, additional fields, not documented
		 * here, may be present.
		 * @property {string} kCBAdvDataLocalName - The device's name. Use this field
		 * rather than device.name, since on iOS the device name is cached and changes
		 * are not reflected in device.name.
		 * @property {number} kCBAdvDataTxPowerLevel - Transmission power level as
		 * advertised by the device.
		 * @property {boolean} kCBAdvDataIsConnectable - True if the device accepts
		 * connections. False if it doesn't.
		 * @property {array} kCBAdvDataServiceUUIDs - Array of strings, the UUIDs of
		 * services advertised by the device. Formatted according to RFC 4122,
		 * all lowercase.
		 * @property {object} kCBAdvDataServiceData - Dictionary of strings to strings.
		 * The keys are service UUIDs. The values are base-64-encoded binary data.
		 * @property {string} kCBAdvDataManufacturerData - Base-64-encoded binary data.
		 * This field is used by BLE devices to advertise custom data that don't fit
		 * into any of the other fields.
		 */

		/**
		 * Match device name. First checks the device name present in
		 * advertisement data, if not present checks device.name field.
		 * @param name The name to match.
		 * @return true if device has the given name, false if not.
		 * @public
		 * @instance
		 * @example
		 *   device.hasName('MyBLEDevice');
		 */
		device.hasName = function(name)
		{
			// If there is a device name present in advertisement data,
			// check if this matches. (This name is not cached by iOS.)
			var deviceName = device.advertisementData ?
				device.advertisementData.kCBAdvDataLocalName : false;
			if (deviceName) 
			{ 
				return 0 == deviceName.indexOf(name);
			}
			
			// Otherwise check if device.name matches (cached by iOS,
			// might not match if device name is updated).
			return name = device.name;
		};

		/**
		 * Connect to the device.
		 * @param {evothings.easyble.connectCallback} success -
		 * Called when connected: success(device).
		 * @param {evothings.easyble.failCallback} fail -
		 * Called on error and if a disconnect happens.
		 * Format: error(errorMessage)
		 * @public
		 * @instance
		 * @example
		 *   device.connect(
		 *     function(device)
		 *     {
		 *       console.log('BLE device connected.');
		 *       // Read services here.
		 *     },
		 *     function(errorCode)
		 *     {
		 *       console.log('BLE connect error: ' + errorCode);
		 *     });
		 */
		device.connect = function(success, fail)
		{
			internal.connectToDevice(device, success, fail);
		};

		/**
		 * Check if device is connected.
		 * @return true if connected, false if not connected.
		 * @public
		 * @instance
		 * @example
		 *   var connected = device.isConnected();
		 */
		device.isConnected = function()
		{
			return device.__isConnected;
		};

		/**
		 * Close the device. This disconnects from the BLE device.
		 * @public
		 * @instance
		 * @example
		 * device.close();
		 */
		device.close = function()
		{
			if (device.deviceHandle)
			{
				device.__isConnected = false;
				evothings.ble.close(device.deviceHandle);
			}
		};

		/**
		 * Read devices RSSI. Device must be connected.
		 * @param {evothings.easyble.rssiCallback} success - Callback called with
		 * RSSI value: success(rssi).
		 * @param {evothings.easyble.failCallback} fail - Called on error: fail(error).
		 * @public
		 * @instance
		 */
		device.readRSSI = function(success, fail)
		{
			evothings.ble.rssi(device.deviceHandle, success, fail);
		};

		/**
		 * Read services, characteristics and descriptors for the
		 * specified service UUIDs.
		 * <strong>Services must be read be able to access characteristics and
		 * descriptors</strong>. Call this function before reading and writing
		 * characteristics/descriptors.
		 * @param serviceUUIDs - array of UUID strings, if null all
		 * services are read (this can be time-consuming compared to
		 * reading selected services).
		 * @param {evothings.easyble.servicesCallback} success -
		 * Called when services are read: success(device).
		 * @param {evothings.easyble.failCallback} fail - error callback:
		 * error(errorMessage)
		 * @public
		 * @instance
		 * @example
		 *   device.readServices(
		 *     null, // Read all services
		 *     function(device)
		 *     {
		 *       console.log('BLE Services available.');
		 *       // Read/write/enable notifications here.
		 *     },
		 *     function(errorCode)
		 *     {
		 *       console.log('BLE readServices error: ' + errorCode);
		 *     });
		 */
		device.readServices = function(serviceUUIDs, success, fail)
		{
			internal.readServices(device, serviceUUIDs, success, fail);
		};

		/**
		 * Read value of characteristic.
		 * @param {string} characteristicUUID - UUID of characteristic to read.
		 * @param {evothings.easyble.dataCallback} success - Success callback:
		 * success(data).
		 * @param {evothings.easyble.failCallback} fail - Error callback: fail(error).
		 * @public
		 * @instance
		 * @example
		 *   device.readCharacteristic(
		 *     characteristicUUID,
		 *     function(data)
		 *     {
		 *       console.log('BLE characteristic data: ' + evothings.ble.fromUtf8(data));
		 *     },
		 *     function(errorCode)
		 *     {
		 *       console.log('BLE readCharacteristic error: ' + errorCode);
		 *     });
		 */
		device.readCharacteristic = function(characteristicUUID, success, fail)
		{
			internal.readCharacteristic(device, characteristicUUID, success, fail);
		};

		/**
		 * Read value of a characteristic for a specific service. This is useful when
		 * multiple services have characteristics with the same UUID.
		 * @param {string} serviceUUID - UUID of service for characteristic.
		 * @param {string} characteristicUUID - UUID of characteristic to read.
		 * @param {evothings.easyble.dataCallback} success - Success callback:
		 * success(data).
		 * @param {evothings.easyble.failCallback} fail - Error callback: fail(error).
		 * @public
		 * @instance
		 * @example
		 *   device.readServiceCharacteristic(
		 *     serviceUUID,
		 *     characteristicUUID,
		 *     function(data)
		 *     {
		 *       console.log('BLE characteristic data: ' + evothings.ble.fromUtf8(data));
		 *     },
		 *     function(errorCode)
		 *     {
		 *       console.log('BLE readServiceCharacteristic error: ' + errorCode);
		 *     });
		 */
		device.readServiceCharacteristic = function(
			serviceUUID, characteristicUUID, success, fail)
		{
			internal.readServiceCharacteristic(
				device, serviceUUID, characteristicUUID, success, fail);
		};

		/**
		 * Read value of descriptor.
		 * @param {string} characteristicUUID - UUID of characteristic for descriptor.
		 * @param {string} descriptorUUID - UUID of descriptor to read.
		 * @param {evothings.easyble.dataCallback} success - Success callback:
		 * success(data).
		 * @param {evothings.easyble.failCallback} fail - Error callback: fail(error).
		 * @public
		 * @instance
		 * @example
		 *   device.readDescriptor(
		 *     characteristicUUID,
		 *     descriptorUUID,
		 *     function(data)
		 *     {
		 *       console.log('BLE descriptor data: ' + evothings.ble.fromUtf8(data));
		 *     },
		 *     function(errorCode)
		 *     {
		 *       console.log('BLE readDescriptor error: ' + errorCode);
		 *     });
		 */
		device.readDescriptor = function(
			characteristicUUID, descriptorUUID, success, fail)
		{
			internal.readDescriptor(
				device, characteristicUUID, descriptorUUID, success, fail);
		};

		/**
		 * Read value of a descriptor for a specific service and characteristic.
		 * This is useful when multiple services and characteristics have
		 * descriptors with the same UUID.
		 * @param {string} serviceUUID - UUID of service that has the characteristic.
		 * @param {string} characteristicUUID - UUID of characteristic for descriptor.
		 * @param {string} descriptorUUID - UUID of descriptor to read.
		 * @param {evothings.easyble.dataCallback} success - Success callback:
		 * success(data).
		 * @param {evothings.easyble.failCallback} fail - Error callback: fail(error).
		 * @public
		 * @instance
		 * @example
		 *   device.readServiceDescriptor(
		 *     serviceUUID,
		 *     characteristicUUID,
		 *     descriptorUUID,
		 *     function(data)
		 *     {
		 *       console.log('BLE descriptor data: ' + evothings.ble.fromUtf8(data));
		 *     },
		 *     function(errorCode)
		 *     {
		 *       console.log('BLE readServiceDescriptor error: ' + errorCode);
		 *     });
		 */
		device.readServiceDescriptor = function(
			serviceUUID, characteristicUUID, descriptorUUID, success, fail)
		{
			internal.readServiceDescriptor(
				device, serviceUUID, characteristicUUID, descriptorUUID, success, fail);
		};

		/**
		 * Write value of characteristic.
		 * @param {string} characteristicUUID - UUID of characteristic to write to.
		 * @param {ArrayBufferView} value - Value to write.
		 * @param {evothings.easyble.emptyCallback} success - Success callback: success().
		 * @param {evothings.easyble.failCallback} fail - Error callback: fail(error).
		 * @public
		 * @instance
		 * @example
		 *   device.writeCharacteristic(
		 *     characteristicUUID,
		 *     new Uint8Array([1]), // Write byte with value 1.
		 *     function()
		 *     {
		 *       console.log('BLE characteristic written.');
		 *     },
		 *     function(errorCode)
		 *     {
		 *       console.log('BLE writeCharacteristic error: ' + errorCode);
		 *     });
		 */
		device.writeCharacteristic = function(characteristicUUID, value, success, fail)
		{
			internal.writeCharacteristic(
				device, characteristicUUID, value, success, fail);
		};

		/**
		 * Write value of a characteristic for a specific service. This is useful when
		 * multiple services have characteristics with the same UUID.
		 * @param {string} serviceUUID - UUID of service that has the characteristic.
		 * @param {string} characteristicUUID - UUID of characteristic to write to.
		 * @param {ArrayBufferView} value - Value to write.
		 * @param {evothings.easyble.emptyCallback} success - Success callback: success().
		 * @param {evothings.easyble.failCallback} fail - Error callback: fail(error).
		 * @public
		 * @instance
		 * @example
		 *   device.writeServiceCharacteristic(
		 *     serviceUUID,
		 *     characteristicUUID,
		 *     new Uint8Array([1]), // Write byte with value 1.
		 *     function()
		 *     {
		 *       console.log('BLE characteristic written.');
		 *     },
		 *     function(errorCode)
		 *     {
		 *       console.log('BLE writeServiceCharacteristic error: ' + errorCode);
		 *     });
		 */
		device.writeServiceCharacteristic = function(
			serviceUUID, characteristicUUID, value, success, fail)
		{
			internal.writeServiceCharacteristic(
				device, serviceUUID, characteristicUUID, value, success, fail);
		};

		/**
		 * Write value of descriptor.
		 * @param {string} characteristicUUID - UUID of characteristic for descriptor.
		 * @param {string} descriptorUUID - UUID of descriptor to write to.
		 * @param {ArrayBufferView} value - Value to write.
		 * @param {evothings.easyble.emptyCallback} success - Success callback: success().
		 * @param {evothings.easyble.failCallback} fail - Error callback: fail(error).
		 * @public
		 * @instance
		 * @example
		 *   device.writeDescriptor(
		 *     characteristicUUID,
		 *     descriptorUUID,
		 *     new Uint8Array([1]), // Write byte with value 1.
		 *     function()
		 *     {
		 *       console.log('BLE descriptor written.');
		 *     },
		 *     function(errorCode)
		 *     {
		 *       console.log('BLE writeDescriptor error: ' + errorCode);
		 *     });
		 */
		device.writeDescriptor = function(
			characteristicUUID, descriptorUUID, value, success, fail)
		{
			internal.writeDescriptor(
				device, characteristicUUID, descriptorUUID, value, success, fail);
		};

		/**
		 * Write value of a descriptor for a specific service and characteristic.
		 * This is useful when multiple services and characteristics have descriptors
		 * with the same UUID.
		 * @param {string} serviceUUID - UUID of service for characteristic.
		 * @param {string} characteristicUUID - UUID of characteristic for descriptor.
		 * @param {string} descriptorUUID - UUID of descriptor to write to.
		 * @param {ArrayBufferView} value - Value to write.
		 * @param {evothings.easyble.emptyCallback} success - Success callback: success().
		 * @param {evothings.easyble.failCallback} fail - Error callback: fail(error).
		 * @public
		 * @instance
		 * @example
		 *   device.writeServiceDescriptor(
		 *     serviceUUID,
		 *     characteristicUUID,
		 *     descriptorUUID,
		 *     new Uint8Array([1]), // Write byte with value 1.
		 *     function()
		 *     {
		 *       console.log('BLE descriptor written.');
		 *     },
		 *     function(errorCode)
		 *     {
		 *       console.log('BLE writeServiceDescriptor error: ' + errorCode);
		 *     });
		 */
		device.writeServiceDescriptor = function(
			serviceUUID, characteristicUUID, descriptorUUID, value, success, fail)
		{
			internal.writeServiceDescriptor(
				device,
				serviceUUID,
				characteristicUUID,
				descriptorUUID,
				value,
				success,
				fail);
		};

		/**
		 * Subscribe to value updates of a characteristic. The success function
		 * will be called repeatedly whenever there is new data available.
		 * @param {string} characteristicUUID - UUID of characteristic to subscribe to.
		 * @param {evothings.easyble.dataCallback} success - Success callback:
		 * success(data).
		 * @param {evothings.easyble.failCallback} fail - Error callback: fail(error).
		 * @public
		 * @instance
		 * @example
		 * device.enableNotification(
		 *   characteristicUUID,
		 *   function(data)
		 *   {
		 *     console.log('BLE characteristic data: ' + evothings.ble.fromUtf8(data));
		 *   },
		 *   function(errorCode)
		 *   {
		 *     console.log('BLE enableNotification error: ' + errorCode);
		 *   });
		 */
		device.enableNotification = function(characteristicUUID, success, fail)
		{
			internal.enableNotification(device, characteristicUUID, success, fail);
		};

		/**
		 * Subscribe to value updates of a characteristic for a specific service.
		 * This is useful when multiple services have characteristics with the
		 * same UUID. The success function will be called repeatedly whenever there
		 * is new data available.
		 * @param {string} serviceUUID - UUID of service that has the given
		 * characteristic.
		 * @param {string} characteristicUUID - UUID of characteristic to subscribe to.
		 * @param {evothings.easyble.dataCallback} success - Success callback:
		 * success(data).
		 * @param {evothings.easyble.failCallback} fail - Error callback: fail(error).
		 * @public
		 * @instance
		 * @example
		 * device.enableServiceNotification(
		 *   serviceUUID,
		 *   characteristicUUID,
		 *   function(data)
		 *   {
		 *     console.log('BLE characteristic data: ' + evothings.ble.fromUtf8(data));
		 *   },
		 *   function(errorCode)
		 *   {
		 *     console.log('BLE enableServiceNotification error: ' + errorCode);
		 *   });
		 */
		device.enableServiceNotification = function(
			serviceUUID, characteristicUUID, success, fail)
		{
			internal.enableServiceNotification(
				device,
				serviceUUID,
				characteristicUUID,
				success,
				fail);
		};

		/**
		 * Unsubscribe from characteristic updates to stop notifications.
		 * @param characteristicUUID - UUID of characteristic to unsubscribe from.
		 * @param {evothings.easyble.emptyCallback} success - Success callback: success()
		 * @param {evothings.easyble.failCallback} fail - Error callback: fail(error)
		 * @public
		 * @instance
		 * @example
		 *  device.disableNotification(
		 *    characteristicUUID,
		 *    function()
		 *    {
		 *      console.log('BLE characteristic notification disabled');
		 *    },
		 *    function(errorCode)
		 *    {
		 *      console.log('BLE disableNotification error: ' + errorCode);
		 *    });
		 */
		device.disableNotification = function(characteristicUUID, success, fail)
		{
			internal.disableNotification(device, characteristicUUID, success, fail);
		};

		/**
		 * Unsubscribe from characteristic updates for a specific service to stop
		 * notifications. This is useful when multiple services have characteristics
		 * with the same UUID.
		 * @param serviceUUID - UUID of service that has the given characteristic.
		 * @param characteristicUUID - UUID of characteristic to unsubscribe from.
		 * @param {evothings.easyble.emptyCallback} success - Success callback: success()
		 * @param {evothings.easyble.failCallback} fail - Error callback: fail(error)
		 * @public
		 * @instance
		 * @example
		 *  device.disableServiceNotification(
		 *    serviceUUID,
		 *    characteristicUUID,
		 *    function()
		 *    {
		 *      console.log('BLE characteristic notification disabled');
		 *    },
		 *    function(errorCode)
		 *    {
		 *      console.log('BLE disableNotification error: ' + errorCode);
		 *    });
		 */
		device.disableServiceNotification = function(
			serviceUUID, characteristicUUID, success, fail)
		{
			internal.disableServiceNotification(
				device, serviceUUID, characteristicUUID, success, fail);
		};
	};

	/**
	 * Connect to a device.
 	 * Called from evothings.easyble.EasyBLEDevice.
	 * @private
	 */
	internal.connectToDevice = function(device, success, fail)
	{
		// Check that device is not already connected.
		if (device.__isConnected)
		{
			fail('Device already connected');
			return;
		}
		
		evothings.ble.connect(device.address, function(connectInfo)
		{
			if (connectInfo.state == 2) // connected
			{
				device.deviceHandle = connectInfo.deviceHandle;
				device.__uuidMap = {};
				device.__serviceMap = {};
				device.__isConnected = true;
				internal.connectedDevices[device.address] = device;

				success(device);
			}
			else if (connectInfo.state == 0) // disconnected
			{
				var theDevice = internal.connectedDevices[device.address];
				theDevice.__isConnected = false;
				internal.connectedDevices[device.address] = null;

				// TODO: Perhaps this should be redesigned, as disconnect is
				// more of a status change than an error? What do you think?
				fail && fail(evothings.easyble.error.DISCONNECTED);
			}
		},
		function(errorCode)
		{
			fail(errorCode);
		});
	};
	
	/**
	 * Obtain device services, them read characteristics and descriptors
	 * for the services with the given uuid(s).
	 * If serviceUUIDs is null, info is read for all services.
 	 * Called from evothings.easyble.EasyBLEDevice.
	 * @private
	 */
	internal.readServices = function(device, serviceUUIDs, success, fail)
	{
		// Read services.
		evothings.ble.services(
			device.deviceHandle,
			function(services)
			{
				// Array that stores services.
				device.__services = [];

				for (var i = 0; i < services.length; ++i)
				{
					var service = services[i];
					service.uuid = service.uuid.toLowerCase();
					device.__services.push(service);
					device.__uuidMap[service.uuid] = service;
				}

				internal.readCharacteristicsForServices(
					device, serviceUUIDs, success, fail);
			},
			function(errorCode)
			{
				fail(errorCode);
			});
	};

	/**
	 * Read characteristics and descriptors for the services with the given uuid(s).
	 * If serviceUUIDs is null, info for all services are read.
	 * Internal function.
 	 * Called from evothings.easyble.EasyBLEDevice.
	 * @private
	 */
	internal.readCharacteristicsForServices = function(device, serviceUUIDs, success, fail)
	{
		var characteristicsCallbackFun = function(service)
		{
			// Array with characteristics for service.
			service.__characteristics = [];

			return function(characteristics)
			{
				--readCounter; // Decrements the count added by services.
				readCounter += characteristics.length;
				for (var i = 0; i < characteristics.length; ++i)
				{
					var characteristic = characteristics[i];
					characteristic.uuid = characteristic.uuid.toLowerCase();
					service.__characteristics.push(characteristic);
					device.__uuidMap[characteristic.uuid] = characteristic;
					device.__serviceMap[service.uuid + ':' + characteristic.uuid] = characteristic;

					// Read descriptors for characteristic.
					evothings.ble.descriptors(
						device.deviceHandle,
						characteristic.handle,
						descriptorsCallbackFun(service, characteristic),
						function(errorCode)
						{
							fail(errorCode);
						});
				}
			};
		};

 		/**
	 	 * @private
	 	 */
		var descriptorsCallbackFun = function(service, characteristic)
		{
			// Array with descriptors for characteristic.
			characteristic.__descriptors = [];

			return function(descriptors)
			{
				--readCounter; // Decrements the count added by characteristics.
				for (var i = 0; i < descriptors.length; ++i)
				{
					var descriptor = descriptors[i];
					descriptor.uuid = descriptor.uuid.toLowerCase();
					characteristic.__descriptors.push(descriptor);
					device.__uuidMap[characteristic.uuid + ':' + descriptor.uuid] = descriptor;
					device.__serviceMap[service.uuid + ':' + characteristic.uuid + ':' + descriptor.uuid] = descriptor;
				}
				if (0 == readCounter)
				{
					// Everything is read.
					success(device);
				}
			};
		};

		// Initialize read counter.
		readCounter = 0;

		if (null != serviceUUIDs)
		{
			// Read info for service UUIDs.
			readCounter = serviceUUIDs.length;
			for (var i = 0; i < serviceUUIDs.length; ++i)
			{
				var uuid = serviceUUIDs[i].toLowerCase();
				var service = device.__uuidMap[uuid];
				if (!service)
				{
					fail(evothings.easyble.error.SERVICE_NOT_FOUND + ' ' + uuid);
					return;
				}

				// Read characteristics for service. Will also read descriptors.
				evothings.ble.characteristics(
					device.deviceHandle,
					service.handle,
					characteristicsCallbackFun(service),
					function(errorCode)
					{
						fail(errorCode);
					});
			}
		}
		else
		{
			// Read info for all services.
			readCounter = device.__services.length;
			for (var i = 0; i < device.__services.length; ++i)
			{
				// Read characteristics for service. Will also read descriptors.
				var service = device.__services[i];
				evothings.ble.characteristics(
					device.deviceHandle,
					service.handle,
					characteristicsCallbackFun(service),
					function(errorCode)
					{
						fail(errorCode);
					});
			}
		}
	};

 	/**
 	 * Called from evothings.easyble.EasyBLEDevice.
	 * @private
	 */
	internal.readCharacteristic = function(device, characteristicUUID, success, fail)
	{
		characteristicUUID = characteristicUUID.toLowerCase();

		var characteristic = device.__uuidMap[characteristicUUID];
		if (!characteristic)
		{
			fail(evothings.easyble.error.CHARACTERISTIC_NOT_FOUND + ' ' +
				characteristicUUID);
			return;
		}

		evothings.ble.readCharacteristic(
			device.deviceHandle,
			characteristic.handle,
			success,
			fail);
	};

	/**
	 * Called from evothings.easyble.EasyBLEDevice.
	 * @private
	 */
	internal.readServiceCharacteristic = function(
		device, serviceUUID, characteristicUUID, success, fail)
	{
		var key = serviceUUID.toLowerCase() + ':' + characteristicUUID.toLowerCase();

		var characteristic = device.__serviceMap[key];
		if (!characteristic)
		{
			fail(evothings.easyble.error.CHARACTERISTIC_NOT_FOUND + ' ' + key);
			return;
		}

		evothings.ble.readCharacteristic(
			device.deviceHandle,
			characteristic.handle,
			success,
			fail);
	};

 	/**
 	 * Called from evothings.easyble.EasyBLEDevice.
	 * @private
	 */
	internal.readDescriptor = function(
		device, characteristicUUID, descriptorUUID, success, fail)
	{
		characteristicUUID = characteristicUUID.toLowerCase();
		descriptorUUID = descriptorUUID.toLowerCase();

		var descriptor = device.__uuidMap[characteristicUUID + ':' + descriptorUUID];
		if (!descriptor)
		{
			fail(evothings.easyble.error.DESCRIPTOR_NOT_FOUND + ' ' + descriptorUUID);
			return;
		}

		evothings.ble.readDescriptor(
			device.deviceHandle,
			descriptor.handle,
			success,
			fail);
	};

	/**
	 * Called from evothings.easyble.EasyBLEDevice.
	 * @private
	 */
	internal.readServiceDescriptor = function(
		device, serviceUUID, characteristicUUID, descriptorUUID, success, fail)
	{
		var key = serviceUUID.toLowerCase() + ':' +
			characteristicUUID.toLowerCase() + ':' +
			descriptorUUID.toLowerCase();

		var descriptor = device.__serviceMap[key];
		if (!descriptor)
		{
			fail(evothings.easyble.error.DESCRIPTOR_NOT_FOUND + ' ' + key);
			return;
		}

		evothings.ble.readDescriptor(
			device.deviceHandle,
			descriptor.handle,
			success,
			fail);
	};

 	/**
 	 * Called from evothings.easyble.EasyBLEDevice.
	 * @private
	 */
	internal.writeCharacteristic = function(
		device, characteristicUUID, value, success, fail)
	{
		characteristicUUID = characteristicUUID.toLowerCase();

		var characteristic = device.__uuidMap[characteristicUUID];
		if (!characteristic)
		{
			fail(evothings.easyble.error.CHARACTERISTIC_NOT_FOUND + ' ' +
				characteristicUUID);
			return;
		}

		evothings.ble.writeCharacteristic(
			device.deviceHandle,
			characteristic.handle,
			value,
			function()
			{
				success();
			},
			function(errorCode)
			{
				fail(errorCode);
			});
	};

	/**
	* Called from evothings.easyble.EasyBLEDevice.
	* @private
	*/
	internal.writeServiceCharacteristic = function(
		device, serviceUUID, characteristicUUID, value, success, fail)
	{
		var key = serviceUUID.toLowerCase() + ':' + characteristicUUID.toLowerCase();

		var characteristic = device.__serviceMap[key];
		if (!characteristic)
		{
			fail(evothings.easyble.error.CHARACTERISTIC_NOT_FOUND + ' ' + key);
			return;
		}

		evothings.ble.writeCharacteristic(
			device.deviceHandle,
			characteristic.handle,
			value,
			success,
			fail);
	};

 	/**
 	 * Called from evothings.easyble.EasyBLEDevice.
	 * @private
	 */
	internal.writeDescriptor = function(
		device, characteristicUUID, descriptorUUID, value, success, fail)
	{
		characteristicUUID = characteristicUUID.toLowerCase();
		descriptorUUID = descriptorUUID.toLowerCase();

		var descriptor = device.__uuidMap[characteristicUUID + ':' + descriptorUUID];
		if (!descriptor)
		{
			fail(evothings.easyble.error.DESCRIPTOR_NOT_FOUND + ' ' + descriptorUUID);
			return;
		}

		evothings.ble.writeDescriptor(
			device.deviceHandle,
			descriptor.handle,
			value,
			function()
			{
				success();
			},
			function(errorCode)
			{
				fail(errorCode);
			});
	};

	/**
	 * Called from evothings.easyble.EasyBLEDevice.
	 * @private
	 */
	internal.writeServiceDescriptor = function(
		device, serviceUUID, characteristicUUID, descriptorUUID, value, success, fail)
	{
		var key = serviceUUID.toLowerCase() + ':' +
			characteristicUUID.toLowerCase() + ':' +
			descriptorUUID.toLowerCase();

		var descriptor = device.__serviceMap[key];
		if (!descriptor)
		{
			fail(evothings.easyble.error.DESCRIPTOR_NOT_FOUND + ' ' + key);
			return;
		}

		evothings.ble.writeDescriptor(
			device.deviceHandle,
			descriptor.handle,
			value,
			success,
			fail);
	};

 	/**
 	 * Called from evothings.easyble.EasyBLEDevice.
	 * @private
	 */
	internal.enableNotification = function(device, characteristicUUID, success, fail)
	{
		characteristicUUID = characteristicUUID.toLowerCase();

		var characteristic = device.__uuidMap[characteristicUUID];
		if (!characteristic)
		{
			fail(evothings.easyble.error.CHARACTERISTIC_NOT_FOUND + ' ' +
				characteristicUUID);
			return;
		}

		evothings.ble.enableNotification(
			device.deviceHandle,
			characteristic.handle,
			success,
			fail);
	};

	/**
	 * Called from evothings.easyble.EasyBLEDevice.
	 * @private
	 */
	internal.enableServiceNotification = function(
		device, serviceUUID, characteristicUUID, success, fail)
	{
		var key = serviceUUID.toLowerCase() + ':' + characteristicUUID.toLowerCase();

		var characteristic = device.__serviceMap[key];
		if (!characteristic)
		{
			fail(evothings.easyble.error.CHARACTERISTIC_NOT_FOUND + ' ' + key);
			return;
		}

		evothings.ble.enableNotification(
			device.deviceHandle,
			characteristic.handle,
			success,
			fail);
	};

 	/**
 	 * Called from evothings.easyble.EasyBLEDevice.
	 * @private
	 */
	internal.disableNotification = function(device, characteristicUUID, success, fail)
	{
		characteristicUUID = characteristicUUID.toLowerCase();

		var characteristic = device.__uuidMap[characteristicUUID];
		if (!characteristic)
		{
			fail(evothings.easyble.error.CHARACTERISTIC_NOT_FOUND + ' ' +
				characteristicUUID);
			return;
		}

		evothings.ble.disableNotification(
			device.deviceHandle,
			characteristic.handle,
			success,
			fail);
	};

	/**
	 * Called from evothings.easyble.EasyBLEDevice.
	 * @private
	 */
	internal.disableServiceNotification = function(
		device, serviceUUID, characteristicUUID, success, fail)
	{
		var key = serviceUUID.toLowerCase() + ':' + characteristicUUID.toLowerCase();

		var characteristic = device.__serviceMap[key];
		if (!characteristic)
		{
			fail(evothings.easyble.error.CHARACTERISTIC_NOT_FOUND + ' ' + key);
			return;
		}

		evothings.ble.disableNotification(
			device.deviceHandle,
			characteristic.handle,
			success,
			fail);
	};

	/**
	 * Prints and object for debugging purposes.
	 * @deprecated. Defined here for backwards compatibility.
	 * Use evothings.printObject().
	 * @public
	 */
	evothings.easyble.printObject = evothings.printObject;

 	/**
 	 * Reset the BLE hardware. Can be time consuming.
	 * @public
	 */
	evothings.easyble.reset = function()
	{
		evothings.ble.reset();
	};
})();
