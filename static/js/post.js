import { scrollToAnchors, enableClipboardCode } from './helpers/domHelpers.js';
import { lightbox } from './components/lightbox.js';
import { preferences } from './components/preferences.js';

// Run scripts
scrollToAnchors();
enableClipboardCode();
lightbox();
preferences();