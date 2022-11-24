export type VRButtonOptions = {
	sessionInit?: XRSessionInit;
	ENTER_VR_TEXT?: string;
	LEAVE_VR_TEXT?: string;
	VR_NOT_SUPPORTED_TEXT?: string;
	VR_NOT_ALLOWED_TEXT?: string;
};

export class VRButton {
	static convertToVRButton(
		button: HTMLButtonElement,
		renderer: THREE.WebGLRenderer,
		options: VRButtonOptions = {},
	) {
		function showEnterVR(/*device*/) {
			const sessionInit = options.sessionInit ?? {
				optionalFeatures: [
					'local-floor',
					'bounded-floor',
					'hand-tracking',
					'layers',
				],
			};
			let currentSession: XRSession;

			async function onSessionStarted(session: XRSession) {
				session.addEventListener('end', onSessionEnded);
				await renderer.xr.setSession(session);
				button.textContent = options.LEAVE_VR_TEXT ?? 'EXIT VR';
				currentSession = session;
			}

			function onSessionEnded(/*event*/) {
				currentSession.removeEventListener('end', onSessionEnded);
				button.textContent = options.ENTER_VR_TEXT ?? 'ENTER VR';
				currentSession = null;
			}

			button.textContent = options.ENTER_VR_TEXT ?? 'ENTER VR';

			button.onclick = function () {
				if (!currentSession) {
					// WebXR's requestReferenceSpace only works if the corresponding feature
					// was requested at session creation time. For simplicity, just ask for
					// the interesting ones as optional features, but be aware that the
					// requestReferenceSpace call will fail if it turns out to be unavailable.
					// ('local' is always available for immersive sessions and doesn't need to
					// be requested separately.)

					navigator.xr
						.requestSession('immersive-vr', sessionInit)
						.then(onSessionStarted);
				} else {
					currentSession.end();
				}
			};
		}

		function showWebXRNotFound() {
			button.onclick = null;
			button.classList.add('webxr-not-found');
			button.textContent = 'VR NOT SUPPORTED';
		}

		function showVRNotAllowed(exception: DOMException) {
			button.onclick = null;
			button.classList.add('vr-not-allowed');
			button.textContent = 'VR NOT ALLOWED';
			console.warn(
				'Exception when trying to call xr.isSessionSupported',
				exception,
			);
		}

		if ('xr' in navigator) {
			button.id = 'VRButton';

			navigator.xr
				.isSessionSupported('immersive-vr')
				.then(function (supported) {
					supported ? showEnterVR() : showWebXRNotFound();

					if (supported && VRButton.xrSessionIsGranted) {
						button.click();
					}
				})
				.catch(showVRNotAllowed);
		} else {
			showWebXRNotFound();
		}
	}

	static xrSessionIsGranted = false;

	static registerSessionGrantedListener() {
		if ('xr' in navigator) {
			// WebXRViewer (based on Firefox) has a bug where addEventListener
			// throws a silent exception and aborts execution entirely.
			if (/WebXRViewer\//i.test(navigator.userAgent)) return;

			navigator.xr.addEventListener('sessiongranted', () => {
				VRButton.xrSessionIsGranted = true;
			});
		}
	}

	static createButton(
		renderer: THREE.WebGLRenderer,
		options: VRButtonOptions = {},
	) {
		const button = document.createElement('button');
		VRButton.convertToVRButton(button, renderer, options);
		return button;
	}
}

VRButton.registerSessionGrantedListener();
