//
//  GerdshadViewController.swift
//  App
//

import UIKit
import Capacitor

class GershadViewController: CAPBridgeViewController {

    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }

    override open func capacitorDidLoad() {
        bridge?.registerPluginInstance(GershadCheckPermissionsPlugin())
    }


    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destination.
        // Pass the selected object to the new view controller.
    }
    */

}
