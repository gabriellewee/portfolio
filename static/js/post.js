import { removePlaceholders, scrollToAnchors, enableClipboardCode } from './helpers/domHelpers.js';
import { timeAgo, durationFormat } from './helpers/timeHelpers.js';
import { lightbox } from './components/lightbox.js';
import { preferences } from './components/preferences.js';

// Run scripts
removePlaceholders();
scrollToAnchors();
enableClipboardCode();
durationFormat();
timeAgo();
lightbox();
preferences();