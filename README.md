# Purpose of the repository

This repository contains sample code for messaging over the Azure IoT Hub.

The scenario demonstrated is:
* How to upload blobs from Python
* How send device to cloud messages that contain metadata about the uploaded files
* How to use Azure Functions to store the metadata onto a PostgreSQL database
* How to call device methods

# Instructions

## Setup IoT Hub

* [Create IoT Hub](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-create-through-portal)
* [Configure file uploads](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-csharp-csharp-file-upload#associate-an-azure-storage-account-to-iot-hub)
* [Create a consumer group](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-devguide-messaging#device-to-cloud-messages) that will be used by the Azure Functions to read device to cloud messages

## Setup Python sample

* [Clone](https://github.com/Azure/azure-iot-sdk-python#how-to-clone-the-repository)
* Build using the script appropriate for you platform https://github.com/Azure/azure-iot-sdk-python/tree/master/build_all
* After success build, copy the native library (e.g. `iothub_client.so`) onto root of this repository or to a system path (or edit `LD_LIBRARY_PATH`)
* Update line `CONNECTION_STRING = "[Device Connection String]"` in file `iothub_upload_sample.py` to have your device connection string
  * If you haven't created a device yet, you can do that in Azure Portal
* Run the sample with `python iothub_upload_sample.py`

## Setup Azure Functions

* [Create](https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-first-azure-function) an Azure Function 
* Setup the Function to be [deployed from a local Git repository](https://docs.microsoft.com/en-us/azure/azure-functions/functions-continuous-deployment)
* Edit file `IoTHubToPostgreSQL/config.js` to have connection details for you PostgreSQL database
* Edit file `IoTHubToPostgreSQL/function.js` to have right Event Hub name and consumer group
* Push this repository into the local Git repository that you created above
* Construct an Event Hub compatible connection string
  * Due to Azure Functions [not supporting IoT Hub trigger](https://github.com/Azure/azure-webjobs-sdk-script/issues/413) directly, you have to [contruct the connection string manually](http://www.firewing1.com/blog/2017/01/31/connecting-azure-iot-hub-azure-functions-and-other-event-hub-compatible-services)
* Update the Azure Function to have the right connection string in App Settings with key `iothub-ehub` (this key is referenced from file `IoTHubToPostgreSQL/function.json`):

![Update app settings](https://cloud.githubusercontent.com/assets/207474/24997061/e4190cfa-203d-11e7-90bd-fc1fbb4fe5bf.png)

## Calling device methods

You can use [https://github.com/Azure/iothub-explorer](https://github.com/Azure/iothub-explorer) to test invocation of device methods. At the same time, you can observe that the Azure Function is not getting triggered from these, because the device method messaging is not routed via the same pipeline as cloud to device messages.