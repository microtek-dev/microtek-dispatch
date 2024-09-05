package com.samsepi0l_2023.microtekdispatch;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.nlscan.nlsdk.NLDevice;
import com.nlscan.nlsdk.NLDeviceStream;

public class MyScanToolModule extends ReactContextBaseJavaModule {
	private static final String TAG = "MyScanToolModule";
	private NLDeviceStream ds;
	private byte[] barcodeBuff = new byte[2 * 1024];
	private int barcodeLen = 0;
	private boolean usbOpenChecked = false;

	public MyScanToolModule(ReactApplicationContext reactContext) {
		super(reactContext);
		ds = (NLDeviceStream) new NLDevice(NLDeviceStream.DevClass.DEV_COMPOSITE);
	}

	@NonNull
	@Override
	public String getName() {
		return "MyScanTool";
	}

	@ReactMethod
	public void openDevice(String serialName, int baud, Callback successCallback, Callback errorCallback) {
		try {
			if (!serialName.startsWith("/dev/tty")) {
				errorCallback.invoke("Invalid serial name.");
				return;
			}

			if (!ds.open(serialName, baud, new NLDeviceStream.NLUartListener() {
				@Override
				public void actionRecv(byte[] recvBuff, int len) {
					barcodeLen = len;
					if (usbOpenChecked) {
						System.arraycopy(recvBuff, 0, barcodeBuff, 0, len);
						// Pass the result back to JS
						successCallback.invoke(new String(barcodeBuff, 0, barcodeLen));
					}
				}
			})) {
				usbOpenChecked = false;
				errorCallback.invoke("Failed to open your device.");
				return;
			}

			usbOpenChecked = true;
			successCallback.invoke("Device opened successfully.");
		} catch (Exception e) {
			errorCallback.invoke(e.getMessage());
		}
	}

	@ReactMethod
	public void closeDevice() {
		if (ds != null) {
			ds.close();
			usbOpenChecked = false;
		}
	}

	@ReactMethod
	public void getDeviceInformation(Callback callback) {
		if (ds != null) {
			String deviceInfo = ds.getDeviceInformation();
			callback.invoke(deviceInfo != null ? deviceInfo : "No device information available.");
		}
	}
}