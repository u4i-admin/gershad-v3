//
//  GershadLocationPermissionsPlugin.swift
//  App
//

import Foundation
import Capacitor
import CoreLocation
import CoreMotion


@objc(GershadCheckPermissionsPlugin)
public class GershadCheckPermissionsPlugin: CAPPlugin, CAPBridgedPlugin {
    public var identifier: String = "GershadCheckPermissionsPlugin"
    public var jsName: String = "GershadCheckPermissionsPlugin"

    let motionActivityManager = CMMotionActivityManager()

    private enum MotionPermissionState: String {
        case granted = "granted"
        case denied = "denied"
        case prompt = "prompt"
    }

    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "isBackgroundLocationPermissionGranted", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getMotionPermissionState", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "requestMotionPermission", returnType: CAPPluginReturnPromise)
    ]

    @objc func isBackgroundLocationPermissionGranted(_ call: CAPPluginCall) {
        let locationManager = CLLocationManager()

        var isGranted: Bool = false
        if #available(iOS 14.0, *) {
            isGranted = locationManager.authorizationStatus == .authorizedAlways
        } else {
            isGranted = CLLocationManager.authorizationStatus() == .authorizedAlways
        }

        call.resolve([
            "isGranted": isGranted
        ])
    }

    @objc func getMotionPermissionState(_ call: CAPPluginCall) {
        var permissionState = getMotionPermissionState()
        print("getMotionPermissionState permissionState =\(permissionState)")
        call.resolve(["permissionState": permissionState.rawValue])
    }

    private func getMotionPermissionState() -> MotionPermissionState {
        var permissionState: MotionPermissionState = MotionPermissionState.granted
        if #available(iOS 11.0, *) {
            var permissionStatus = CMMotionActivityManager.authorizationStatus()
            switch permissionStatus {
            case .authorized:
                permissionState = MotionPermissionState.granted
            case .denied, .restricted:
                permissionState = MotionPermissionState.denied
            default:
                permissionState = MotionPermissionState.prompt
            }
        }
        print("getMotionPermissionState - permissionState = \(permissionState)")
        return permissionState
    }

    @objc func requestMotionPermission(_ call: CAPPluginCall) {
        print("requestMotionPermission")


        if CMMotionActivityManager.isActivityAvailable() {
            bridge?.saveCall(call)

            motionActivityManager.queryActivityStarting(from: Date(), to: Date(), to: .main) { (activities, error) in
                let permissionState = self.getMotionPermissionState();

                if let error = error {
                    print("requestMotionPermission - Motion updates not authorized: \(error.localizedDescription)")
                } else {
                    print("requestMotionPermission - Motion updates authorized")
                }

                call.resolve(["permissionState": permissionState.rawValue])
            }
        } else {
            print("requestMotionPermission - Device motion not available on this device")
            var permissionState = self.getMotionPermissionState()
            call.resolve(["permissionState": permissionState.rawValue])
        }
    }
}
