export type ARButtonOptions = {
	sessionInit?: XRSessionInit;
	onSessionStarted?: (session: XRSession) => void;
	onSessionEnded?: (session: XRSession) => void;
	onUnsupported?: () => void;
	onNotAllowed?: (exception: DOMException) => void;
	ENTER_AR_TEXT?: string;
	LEAVE_AR_TEXT?: string;
	AR_NOT_SUPPORTED_TEXT?: string;
	AR_NOT_ALLOWED_TEXT?: string;
};

export class ARButton {
	static convertToARButton(
		button: HTMLButtonElement,
		renderer: THREE.WebGLRenderer,
		options: ARButtonOptions = {},
	) {
		function showStartAR(/*device*/) {
			const sessionInit = options.sessionInit ?? { optionalFeatures: [] };
			let currentSession: XRSession;

			async function onSessionStarted(session: XRSession) {
				session.addEventListener('end', onSessionEnded);
				renderer.xr.setReferenceSpaceType('local');
				await renderer.xr.setSession(session);
				button.textContent = options.LEAVE_AR_TEXT ?? 'EXIT AR';
				currentSession = session;
				if (options.onSessionStarted) options.onSessionStarted(currentSession);
			}

			function onSessionEnded(/*event*/) {
				currentSession.removeEventListener('end', onSessionEnded);
				button.textContent = options.ENTER_AR_TEXT ?? 'ENTER AR';
				if (options.onSessionEnded) options.onSessionEnded(currentSession);
				currentSession = null;
			}

			button.textContent = options.ENTER_AR_TEXT ?? 'ENTER AR';

			button.onclick = function () {
				if (!currentSession) {
					navigator.xr
						.requestSession('immersive-ar', sessionInit)
						.then(onSessionStarted);
				} else {
					currentSession.end();
				}
			};
		}

		function showARNotSupported() {
			button.onclick = null;
			button.classList.add('ar-not-supported');
			button.textContent = options.AR_NOT_SUPPORTED_TEXT ?? 'AR NOT SUPPORTED';
			if (options.onUnsupported) options.onUnsupported();
		}

		function showARNotAllowed(exception: DOMException) {
			button.onclick = null;
			button.classList.add('ar-not-allowed');
			button.textContent = options.AR_NOT_ALLOWED_TEXT ?? 'AR NOT ALLOWED';
			console.warn(
				'Exception when trying to call xr.isSessionSupported',
				exception,
			);
			if (options.onNotAllowed) options.onNotAllowed(exception);
		}

		if ('xr' in navigator) {
			navigator.xr
				.isSessionSupported('immersive-ar')
				.then(function (supported) {
					supported ? showStartAR() : showARNotSupported();
				})
				.catch(showARNotAllowed);
		} else {
			showARNotSupported();
		}
	}

	static createButton(
		renderer: THREE.WebGLRenderer,
		options: ARButtonOptions = {},
	) {
		const button = document.createElement('button');
		ARButton.convertToARButton(button, renderer, options);
		return button;
	}
}
