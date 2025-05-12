import { scrollToAnchors, enableClipboardCode } from './helpers/domHelpers.js';
import { lightbox } from './components/lightbox.js';
import { accessibility } from './components/accessibility.js';

// Run scripts
scrollToAnchors();
enableClipboardCode();
lightbox();
accessibility();