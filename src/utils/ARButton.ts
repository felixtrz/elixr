export type ARButtonOptions = {
	sessionInit?: XRSessionInit;
	ENTER_AR_TEXT?: string;
	LEAVE_AR_TEXT?: string;
	AR_NOT_SUPPORTED_TEXT?: string;
	AR_NOT_ALLOWED_TEXT?: string;
};

export class ARButton {
	static createButton(
		renderer: THREE.WebGLRenderer,
		options: ARButtonOptions = {},
		button: HTMLButtonElement = document.createElement('button'),
	) {
		function showStartAR(/*device*/) {
			const sessionInit = options.sessionInit ?? {};
			let currentSession: XRSession;

			if (sessionInit.domOverlay === undefined) {
				const overlay = document.createElement('div');
				overlay.style.display = 'none';
				document.body.appendChild(overlay);

				if (sessionInit.optionalFeatures === undefined) {
					sessionInit.optionalFeatures = [];
				}

				sessionInit.optionalFeatures.push('dom-overlay');
				sessionInit.domOverlay = { root: overlay };
			}

			async function onSessionStarted(session: XRSession) {
				session.addEventListener('end', onSessionEnded);
				renderer.xr.setReferenceSpaceType('local');
				await renderer.xr.setSession(session);
				button.textContent = options.LEAVE_AR_TEXT ?? 'STOP AR';
				currentSession = session;
			}

			function onSessionEnded(/*event*/) {
				currentSession.removeEventListener('end', onSessionEnded);
				button.textContent = options.ENTER_AR_TEXT ?? 'START AR';
				currentSession = null;
			}

			button.textContent = options.ENTER_AR_TEXT ?? 'START AR';

			button.onclick = function () {
				if (currentSession === null) {
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
			button.textContent = 'AR NOT SUPPORTED';
		}

		function showARNotAllowed(exception: DOMException) {
			button.onclick = null;
			button.textContent = options.AR_NOT_ALLOWED_TEXT ?? 'AR NOT ALLOWED';
			console.warn(
				'Exception when trying to call xr.isSessionSupported',
				exception,
			);
		}

		if ('xr' in navigator) {
			button.id = 'ARButton';
			button.style.display = 'none';

			navigator.xr
				.isSessionSupported('immersive-ar')
				.then(function (supported) {
					supported ? showStartAR() : showARNotSupported();
				})
				.catch(showARNotAllowed);
		} else {
			showARNotSupported();
		}

		return button;
	}
}
