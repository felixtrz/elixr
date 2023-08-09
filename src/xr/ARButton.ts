export type ARButtonOptions = {
	sessionInit?: XRSessionInit;
	onSessionStarted?: (session: XRSession) => void;
	onSessionEnded?: (session: XRSession) => void;
	onUnsupported?: () => void;
	onNotAllowed?: (exception: DOMException) => void;
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
				currentSession = session;
				if (options.onSessionStarted) options.onSessionStarted(currentSession);
			}

			function onSessionEnded(/*event*/) {
				currentSession.removeEventListener('end', onSessionEnded);
				if (options.onSessionEnded) options.onSessionEnded(currentSession);
				currentSession = null;
			}

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
			if (options.onUnsupported) options.onUnsupported();
		}

		function showARNotAllowed(exception: DOMException) {
			button.onclick = null;
			button.classList.add('ar-not-allowed');
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
